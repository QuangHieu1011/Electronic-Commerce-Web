const crypto = require('crypto')

// Tạo mã OTP 6 số
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Lưu trữ OTP tạm thời (trong production nên dùng Redis)
const otpStorage = new Map()

// Lưu OTP
const storeOTP = (email, otp, type = 'signup', expiryMinutes = 10) => {
    const key = `${email}_${type}`
    const expiry = Date.now() + (expiryMinutes * 60 * 1000)

    otpStorage.set(key, {
        otp: otp,
        expiry: expiry,
        email: email,
        type: type,
        attempts: 0
    })

    // Auto cleanup after expiry
    setTimeout(() => {
        otpStorage.delete(key)
    }, expiryMinutes * 60 * 1000)

    return key
}

// Xác thực OTP
const verifyOTP = (email, inputOTP, type = 'signup') => {
    const key = `${email}_${type}`
    const stored = otpStorage.get(key)

    if (!stored) {
        return { valid: false, message: 'OTP không tồn tại hoặc đã hết hạn' }
    }

    if (Date.now() > stored.expiry) {
        otpStorage.delete(key)
        return { valid: false, message: 'OTP đã hết hạn' }
    }

    // Tăng số lần thử
    stored.attempts += 1

    // Giới hạn số lần thử (5 lần)
    if (stored.attempts > 5) {
        otpStorage.delete(key)
        return { valid: false, message: 'Đã vượt quá số lần thử cho phép' }
    }

    if (stored.otp !== inputOTP) {
        return { valid: false, message: 'Mã OTP không chính xác', attemptsLeft: 5 - stored.attempts }
    }

    // OTP hợp lệ, xóa khỏi storage
    otpStorage.delete(key)
    return { valid: true, message: 'Xác thực thành công' }
}

// Kiểm tra OTP có tồn tại không
const hasOTP = (email, type = 'signup') => {
    const key = `${email}_${type}`
    const stored = otpStorage.get(key)

    if (!stored || Date.now() > stored.expiry) {
        if (stored) otpStorage.delete(key)
        return false
    }

    return true
}

// Lấy thông tin OTP
const getOTPInfo = (email, type = 'signup') => {
    const key = `${email}_${type}`
    const stored = otpStorage.get(key)

    if (!stored || Date.now() > stored.expiry) {
        if (stored) otpStorage.delete(key)
        return null
    }

    return {
        email: stored.email,
        type: stored.type,
        attempts: stored.attempts,
        expiryTime: stored.expiry,
        timeLeft: Math.ceil((stored.expiry - Date.now()) / 1000)
    }
}

// Xóa OTP
const deleteOTP = (email, type = 'signup') => {
    const key = `${email}_${type}`
    return otpStorage.delete(key)
}

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP,
    hasOTP,
    getOTPInfo,
    deleteOTP
}