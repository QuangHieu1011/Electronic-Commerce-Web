const OTPService = require('../services/OTPService')
const EmailService = require('../services/EmailService')
const User = require('../models/UserModel')
const bcrypt = require('bcrypt')

// Gửi OTP cho đăng ký
const sendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email là bắt buộc'
            })
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email đã được đăng ký'
            })
        }

        // Tạo và gửi OTP
        const otp = OTPService.generateOTP()
        OTPService.storeOTP(email, otp, 'signup', 10)

        const emailResult = await EmailService.sendOTPEmail(email, otp, 'signup')

        if (!emailResult.success) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Không thể gửi email OTP'
            })
        }

        res.status(200).json({
            status: 'OK',
            message: 'Mã OTP đã được gửi đến email của bạn',
            data: {
                email: email,
                expiryTime: 10 * 60 // 10 phút
            }
        })
    } catch (error) {
        console.error('Error sending signup OTP:', error)
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server'
        })
    }
}

// Xác thực OTP đăng ký
const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email và mã OTP là bắt buộc'
            })
        }

        const verification = OTPService.verifyOTP(email, otp, 'signup')

        if (!verification.valid) {
            return res.status(400).json({
                status: 'ERR',
                message: verification.message,
                attemptsLeft: verification.attemptsLeft
            })
        }

        res.status(200).json({
            status: 'OK',
            message: 'Xác thực OTP thành công',
            data: {
                email: email,
                verified: true
            }
        })
    } catch (error) {
        console.error('Error verifying signup OTP:', error)
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server'
        })
    }
}

// Gửi OTP cho khôi phục mật khẩu
const sendResetPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email là bắt buộc'
            })
        }

        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Email không tồn tại trong hệ thống'
            })
        }

        // Tạo và gửi OTP
        const otp = OTPService.generateOTP()
        OTPService.storeOTP(email, otp, 'reset', 10)

        const emailResult = await EmailService.sendOTPEmail(email, otp, 'reset')

        if (!emailResult.success) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Không thể gửi email OTP'
            })
        }

        res.status(200).json({
            status: 'OK',
            message: 'Mã OTP khôi phục mật khẩu đã được gửi đến email',
            data: {
                email: email,
                expiryTime: 10 * 60 // 10 phút
            }
        })
    } catch (error) {
        console.error('Error sending reset password OTP:', error)
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server'
        })
    }
}

// Xác thực OTP và đặt lại mật khẩu
const resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email, mã OTP và mật khẩu mới là bắt buộc'
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            })
        }

        // Xác thực OTP
        const verification = OTPService.verifyOTP(email, otp, 'reset')

        if (!verification.valid) {
            return res.status(400).json({
                status: 'ERR',
                message: verification.message,
                attemptsLeft: verification.attemptsLeft
            })
        }

        // Cập nhật mật khẩu mới
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy người dùng'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.findByIdAndUpdate(user._id, { password: hashedPassword })

        res.status(200).json({
            status: 'OK',
            message: 'Đặt lại mật khẩu thành công',
            data: {
                email: email,
                updated: true
            }
        })
    } catch (error) {
        console.error('Error resetting password:', error)
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server'
        })
    }
}

// Kiểm tra trạng thái OTP
const getOTPStatus = async (req, res) => {
    try {
        const { email, type } = req.query

        if (!email || !type) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email và type là bắt buộc'
            })
        }

        const otpInfo = OTPService.getOTPInfo(email, type)

        if (!otpInfo) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy OTP hoặc đã hết hạn'
            })
        }

        res.status(200).json({
            status: 'OK',
            message: 'Thông tin OTP',
            data: otpInfo
        })
    } catch (error) {
        console.error('Error getting OTP status:', error)
        res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server'
        })
    }
}

module.exports = {
    sendSignupOTP,
    verifySignupOTP,
    sendResetPasswordOTP,
    resetPasswordWithOTP,
    getOTPStatus
}