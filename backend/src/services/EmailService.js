const nodemailer = require('nodemailer')

// Cấu hình email transporter - Hỗ trợ nhiều email provider
const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER || 'your-email@gmail.com'
    const emailPass = process.env.EMAIL_PASS || 'your-app-password'

    // Auto-detect email provider based on email domain
    if (emailUser.includes('@gmail.com')) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        })
    } else if (emailUser.includes('@outlook.com') || emailUser.includes('@hotmail.com')) {
        return nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        })
    } else if (emailUser.includes('@yahoo.com')) {
        return nodemailer.createTransport({
            service: 'yahoo',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        })
    } else {
        // Custom SMTP for business emails
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: emailUser,
                pass: emailPass
            }
        })
    }
}

// Gửi email OTP
const sendOTPEmail = async (email, otp, type = 'signup') => {
    try {
        const transporter = createTransporter()

        let subject, html

        if (type === 'signup') {
            subject = 'Xác thực tài khoản - Mã OTP'
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1890ff;">Xác thực tài khoản</h2>
                    <p>Chào bạn,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #52c41a; background: #f6ffed; padding: 10px 20px; border-radius: 5px; border: 1px solid #b7eb8f;">${otp}</span>
                    </div>
                    <p>Mã OTP có hiệu lực trong 10 phút.</p>
                    <p>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
                </div>
            `
        } else if (type === 'reset') {
            subject = 'Khôi phục mật khẩu - Mã OTP'
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #fa541c;">Khôi phục mật khẩu</h2>
                    <p>Chào bạn,</p>
                    <p>Bạn đã yêu cầu khôi phục mật khẩu. Vui lòng sử dụng mã OTP dưới đây:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #fa541c; background: #fff2e8; padding: 10px 20px; border-radius: 5px; border: 1px solid #ffd591;">${otp}</span>
                    </div>
                    <p>Mã OTP có hiệu lực trong 10 phút.</p>
                    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
                </div>
            `
        }

        const fromEmail = process.env.EMAIL_USER || 'your-email@gmail.com'
        const fromName = process.env.EMAIL_FROM_NAME || 'TechStore'

        const mailOptions = {
            from: `${fromName} <${fromEmail}>`,
            to: email,
            subject: subject,
            html: html,
            replyTo: process.env.EMAIL_REPLY_TO || fromEmail
        }

        const result = await transporter.sendMail(mailOptions)
        console.log('Email sent successfully:', result.messageId)
        return { success: true, messageId: result.messageId }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error: error.message }
    }
}

module.exports = {
    sendOTPEmail
}