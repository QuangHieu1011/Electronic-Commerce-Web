const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.get('/product/:productId', ReviewController.getReviewsByProduct);
router.post('/product/:productId', authUserMiddleware, ReviewController.createReview);

module.exports = router;
