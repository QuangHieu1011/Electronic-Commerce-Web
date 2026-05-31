const express = require('express');
const router = express.Router();
const PromotionController = require('../controllers/PromotionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, PromotionController.getAllPromotions);
router.get('/:id', authMiddleware, PromotionController.getPromotionById);
router.post('/create', authMiddleware, PromotionController.createPromotion);
router.put('/update/:id', authMiddleware, PromotionController.updatePromotion);
router.patch('/toggle/:id', authMiddleware, PromotionController.togglePromotionActive);
router.delete('/delete/:id', authMiddleware, PromotionController.deletePromotion);

module.exports = router;
