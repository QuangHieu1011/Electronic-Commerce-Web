const mongoose = require('mongoose');
const Review = require('../models/ReviewModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderProduct');

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const getVerifiedBuyerIds = async (productId) => {
    const orders = await Order.find(
        {
            'orderItems.product._id': String(productId),
            orderStatus: { $ne: 'cancelled' }
        },
        'user'
    ).lean();

    return [...new Set(orders.map((order) => String(order.user)).filter(Boolean))];
};

const buildReviewSummary = async (productId) => {
    const productObjectId = toObjectId(productId);

    const stats = await Review.aggregate([
        { $match: { product: productObjectId } },
        {
            $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' },
                star1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
                star2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                star3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                star4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                star5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
            }
        }
    ]);

    if (!stats.length) {
        return {
            totalReviews: 0,
            averageRating: 0,
            ratingBreakdown: [
                { star: 5, count: 0, percentage: 0 },
                { star: 4, count: 0, percentage: 0 },
                { star: 3, count: 0, percentage: 0 },
                { star: 2, count: 0, percentage: 0 },
                { star: 1, count: 0, percentage: 0 }
            ]
        };
    }

    const raw = stats[0];
    const total = raw.totalReviews || 0;
    const average = raw.averageRating ? Number(raw.averageRating.toFixed(1)) : 0;

    const countByStar = {
        1: raw.star1 || 0,
        2: raw.star2 || 0,
        3: raw.star3 || 0,
        4: raw.star4 || 0,
        5: raw.star5 || 0
    };

    const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
        const count = countByStar[star];
        return {
            star,
            count,
            percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0
        };
    });

    return {
        totalReviews: total,
        averageRating: average,
        ratingBreakdown
    };
};

const createOrUpdateReview = async ({ productId, userId, rating, comment, images = [] }) => {
    const product = await Product.findById(productId);
    if (!product) {
        return {
            status: 'ERR',
            message: 'Sản phẩm không tồn tại'
        };
    }

    const cleanedImages = Array.isArray(images)
        ? images
              .filter((url) => typeof url === 'string')
              .map((url) => url.trim())
              .filter((url) => url.length > 0)
              .slice(0, 5)
        : [];

    const savedReview = await Review.findOneAndUpdate(
        { product: productId, user: userId },
        {
            rating,
            comment: comment.trim(),
            images: cleanedImages
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    const summary = await buildReviewSummary(productId);

    // Keep product.rating aligned with real reviews for existing UI usage.
    await Product.findByIdAndUpdate(productId, {
        rating: summary.averageRating
    });

    return {
        status: 'OK',
        message: 'SUCCESS',
        data: savedReview,
        summary
    };
};

const getReviewsByProduct = async ({
    productId,
    page = 1,
    limit = 6,
    hasImages = false,
    verifiedPurchase = false,
    ratings = []
}) => {
    const product = await Product.findById(productId);
    if (!product) {
        return {
            status: 'ERR',
            message: 'Sản phẩm không tồn tại'
        };
    }

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 6, 1), 20);
    const safeRatings = Array.isArray(ratings)
        ? [...new Set(ratings.map((item) => Number(item)))].filter(
              (item) => Number.isInteger(item) && item >= 1 && item <= 5
          )
        : [];

    const reviewQuery = { product: productId };
    if (hasImages) {
        reviewQuery['images.0'] = { $exists: true };
    }
    if (safeRatings.length > 0) {
        reviewQuery.rating = { $in: safeRatings };
    }

    let verifiedBuyerIds = [];
    if (verifiedPurchase) {
        verifiedBuyerIds = await getVerifiedBuyerIds(productId);
        if (!verifiedBuyerIds.length) {
            return {
                status: 'OK',
                message: 'SUCCESS',
                data: {
                    reviews: [],
                    summary: await buildReviewSummary(productId),
                    pagination: {
                        pageCurrent: safePage,
                        limit: safeLimit,
                        totalReviews: 0,
                        totalPages: 0
                    }
                }
            };
        }

        reviewQuery.user = {
            $in: verifiedBuyerIds.map((id) => toObjectId(id))
        };
    }

    const [totalReviews, reviews, summary] = await Promise.all([
        Review.countDocuments(reviewQuery),
        Review.find(reviewQuery)
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit),
        buildReviewSummary(productId)
    ]);

    const reviewsWithVerifiedFlag = reviews.map((review) => {
        const plainReview = review.toObject();
        const isVerifiedPurchase = verifiedBuyerIds.length
            ? verifiedBuyerIds.includes(String(review.user?._id || review.user))
            : false;

        return {
            ...plainReview,
            isVerifiedPurchase
        };
    });

    return {
        status: 'OK',
        message: 'SUCCESS',
        data: {
            reviews: reviewsWithVerifiedFlag,
            summary,
            pagination: {
                pageCurrent: safePage,
                limit: safeLimit,
                totalReviews,
                totalPages: Math.ceil(totalReviews / safeLimit)
            }
        }
    };
};

module.exports = {
    createOrUpdateReview,
    getReviewsByProduct
};
