const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authMiddleware, authUserMiddleware, authAnyUserMiddleware } = require("../middleware/authMiddleware");

// User routes
router.post('/create', authAnyUserMiddleware, OrderController.createOrder)
router.get('/get-all-orders/:id', authUserMiddleware, OrderController.getAllOrdersByUser)
router.put('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrder)
router.put('/hide-order/:id', authUserMiddleware, OrderController.hideOrderFromUser)
router.post('/reorder/:id', authUserMiddleware, OrderController.reorderItems)

// Admin routes
router.get('/get-all-orders', authMiddleware, OrderController.getAllOrders)
router.put('/update-status/:id', authMiddleware, OrderController.updateOrderStatus)
router.put('/update-payment/:id', authMiddleware, OrderController.updatePaymentStatus)
router.put('/restore-order/:id', authMiddleware, OrderController.restoreOrderForUser)

module.exports = router
