const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware');

router.get('/product/:productId', ReviewController.getReviewsByProduct);
router.post('/product/:productId', authUserMiddleware, ReviewController.createReview);

// Admin routes
router.get('/admin/all', authMiddleware, ReviewController.getAdminReviews);
router.get('/admin/product-stats', authMiddleware, ReviewController.getProductReviewStats);
router.delete('/admin/:reviewId', authMiddleware, ReviewController.deleteReview);

module.exports = router;
