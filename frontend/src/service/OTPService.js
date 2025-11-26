import axios from "axios"

// Gửi OTP cho đăng ký
export const sendSignupOTP = async (email) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/otp/send-signup-otp`, {
        email
    })
    return res.data
}

// Xác thực OTP đăng ký
export const verifySignupOTP = async (email, otp) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/otp/verify-signup-otp`, {
        email,
        otp
    })
    return res.data
}

// Gửi OTP cho khôi phục mật khẩu
export const sendResetPasswordOTP = async (email) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/otp/send-reset-otp`, {
        email
    })
    return res.data
}

// Đặt lại mật khẩu với OTP
export const resetPasswordWithOTP = async (email, otp, newPassword) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/otp/reset-password`, {
        email,
        otp,
        newPassword
    })
    return res.data
}

// Kiểm tra trạng thái OTP
export const getOTPStatus = async (email, type) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/otp/status?email=${email}&type=${type}`)
    return res.data
}

// Đăng ký với OTP
export const signUpWithOTP = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up-otp`, data)
    return res.data
}