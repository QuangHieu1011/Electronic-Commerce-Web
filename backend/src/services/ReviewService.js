const mongoose = require('mongoose');
const Review = require('../models/ReviewModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderProduct');
const ReviewModerationService = require('./ReviewModerationService');

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

    const cleanedComment = comment.trim();
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
            comment: cleanedComment,
            images: cleanedImages
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    const moderation = await ReviewModerationService.moderateReview({
        comment: cleanedComment,
        rating,
        productId,
        productName: product.name,
        userId,
        reviewId: savedReview._id
    });

    if (moderation) {
        savedReview.moderation = moderation;
        await savedReview.save();
    }

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

const getAdminReviews = async ({ page = 1, limit = 10, search = '', rating = '', flagged }) => {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

    const query = {};

    // Nếu có search thì tìm product ID trước, rồi lọc review theo product ID đó
    if (search) {
        const matchingProducts = await Product.find(
            { name: { $regex: search, $options: 'i' } },
            '_id'
        ).lean();
        query.product = { $in: matchingProducts.map((p) => p._id) };
    }

    if (rating && Number(rating) >= 1 && Number(rating) <= 5) {
        query.rating = Number(rating);
    }

    if (flagged === true) {
        query['moderation.isFlagged'] = true;
    } else if (flagged === false) {
        query['moderation.isFlagged'] = { $ne: true };
    }

    const [total, reviews] = await Promise.all([
        Review.countDocuments(query),
        Review.find(query)
            .populate('product', 'name image')
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit)
            .lean()
    ]);

    return {
        status: 'OK',
        message: 'SUCCESS',
        data: reviews,
        pagination: {
            pageCurrent: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit)
        }
    };
};

const getProductReviewStats = async ({ page = 1, limit = 10, sort = 'rating' }) => {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

    const sortField = sort === 'totalReviews' ? 'totalReviews' : 'averageRating';

    // Group theo product để tính thống kê
    const grouped = await Review.aggregate([
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                star5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                star4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                star3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                star2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                star1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
            }
        },
        { $sort: { [sortField]: -1 } }
    ]);

    const total = grouped.length;
    const paged = grouped.slice((safePage - 1) * safeLimit, safePage * safeLimit);

    // Lấy thông tin product bằng find().lean() bình thường
    const productIds = paged.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } }, 'name image type price').lean();
    const productMap = {};
    products.forEach((p) => { productMap[String(p._id)] = p; });

    const data = paged.map((item) => ({
        ...item,
        averageRating: Number((item.averageRating || 0).toFixed(1)),
        productInfo: productMap[String(item._id)] || null
    }));

    return {
        status: 'OK',
        message: 'SUCCESS',
        data,
        pagination: {
            pageCurrent: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit)
        }
    };
};

const deleteReview = async (reviewId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        return { status: 'ERR', message: 'Đánh giá không tồn tại' };
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    const summary = await buildReviewSummary(productId);
    await Product.findByIdAndUpdate(productId, { rating: summary.averageRating });

    return { status: 'OK', message: 'Xóa đánh giá thành công' };
};

module.exports = {
    createOrUpdateReview,
    getReviewsByProduct,
    getAdminReviews,
    getProductReviewStats,
    deleteReview
};
