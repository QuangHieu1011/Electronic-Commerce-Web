const ReviewService = require('../services/ReviewService');

const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string') return false;

    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

const parseRatings = (value) => {
    if (!value) return [];

    const rawValues = Array.isArray(value)
        ? value
        : String(value)
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean);

    const uniqueRatings = [...new Set(rawValues.map((item) => Number(item)))].filter(
        (rating) => Number.isInteger(rating) && rating >= 1 && rating <= 5
    );

    return uniqueRatings;
};

const createReview = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;
        const { rating, comment, images } = req.body || {};

        if (!userId) {
            return res.status(401).json({
                status: 'ERR',
                message: 'Unauthorized'
            });
        }

        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Product ID is required'
            });
        }

        const parsedRating = Number(rating);
        if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Rating phải từ 1 đến 5 sao'
            });
        }

        if (!comment || !String(comment).trim()) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Nội dung bình luận là bắt buộc'
            });
        }

        const response = await ReviewService.createOrUpdateReview({
            productId,
            userId,
            rating: parsedRating,
            comment: String(comment),
            images
        });

        const statusCode = response.status === 'ERR' ? 400 : 200;
        return res.status(statusCode).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || e
        });
    }
};

const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 6, hasImages, verifiedPurchase, ratings } = req.query;

        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Product ID is required'
            });
        }

        const response = await ReviewService.getReviewsByProduct({
            productId,
            page,
            limit,
            hasImages: parseBoolean(hasImages),
            verifiedPurchase: parseBoolean(verifiedPurchase),
            ratings: parseRatings(ratings)
        });

        const statusCode = response.status === 'ERR' ? 400 : 200;
        return res.status(statusCode).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || e
        });
    }
};

module.exports = {
    createReview,
    getReviewsByProduct
};
