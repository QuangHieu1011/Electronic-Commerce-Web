const express = require('express')
const router = express.Router()
const OTPController = require('../controllers/OTPController')

// Gửi OTP cho đăng ký
router.post('/send-signup-otp', OTPController.sendSignupOTP)

// Xác thực OTP đăng ký
router.post('/verify-signup-otp', OTPController.verifySignupOTP)

// Gửi OTP cho khôi phục mật khẩu
router.post('/send-reset-otp', OTPController.sendResetPasswordOTP)

// Đặt lại mật khẩu với OTP
router.post('/reset-password', OTPController.resetPasswordWithOTP)

// Kiểm tra trạng thái OTP
router.get('/status', OTPController.getOTPStatus)

module.exports = router