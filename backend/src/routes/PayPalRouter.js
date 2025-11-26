const express = require('express')
const router = express.Router()
const PayPalController = require('../controllers/PayPalController')

// Tạo PayPal order
router.post('/create-order', PayPalController.createOrder)

// Capture PayPal payment
router.post('/capture-order', PayPalController.captureOrder)

// Verify PayPal payment
router.post('/verify-payment', PayPalController.verifyPayment)

// Get PayPal client token
router.get('/client-token', PayPalController.getClientToken)

module.exports = router