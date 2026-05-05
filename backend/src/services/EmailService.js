const nodemailer = require('nodemailer')

const escapeHtml = (value) =>
    String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

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

const sendReviewModerationAlert = async ({
    to,
    reviewId,
    productId,
    productName,
    userId,
    rating,
    comment,
    score,
    category,
    labels,
    reason
}) => {
    try {
        if (!to) {
            return { success: false, error: 'Missing recipient' }
        }

        const transporter = createTransporter()
        const fromEmail = process.env.EMAIL_USER || 'your-email@gmail.com'
        const fromName = process.env.EMAIL_FROM_NAME || 'TechStore'

        const safeComment = escapeHtml(comment)
        const labelText = Array.isArray(labels) && labels.length ? labels.join(', ') : 'n/a'
        const categoryText = category ? String(category) : 'n/a'
        const categoryValue = categoryText.toLowerCase()
        const scoreNumber = Number(score)
        const scoreText = Number.isFinite(scoreNumber) ? scoreNumber.toFixed(2) : String(score || 'n/a')

        const badgeMap = {
            toxic: { label: 'TOXIC', color: '#d92d20', bg: '#fff1f0', border: '#ffccc7' },
            negative: { label: 'NEGATIVE', color: '#d48806', bg: '#fffbe6', border: '#ffe58f' },
            clean: { label: 'CLEAN', color: '#237804', bg: '#f6ffed', border: '#b7eb8f' }
        }
        const badge = badgeMap[categoryValue] || badgeMap.toxic

        const html = `
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6; padding: 24px 0; font-family: Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="720" style="width: 720px; max-width: 95%; background:#ffffff; border:1px solid #e5e7eb; border-radius: 14px; overflow:hidden;">
                            <tr>
                                <td style="padding: 22px 28px; background:#0f172a; color:#ffffff;">
                                    <div style="font-size: 16px; letter-spacing: 0.3px; font-weight: 700;">${escapeHtml(fromName)}</div>
                                    <div style="font-size: 12px; opacity: 0.75; margin-top: 4px;">Review moderation alert</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 22px 28px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td>
                                                <span style="display:inline-block; padding:4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; color:${badge.color}; background:${badge.bg}; border:1px solid ${badge.border};">${badge.label}</span>
                                            </td>
                                            <td align="right" style="font-size: 12px; color:#6b7280;">Score: ${escapeHtml(scoreText)}</td>
                                        </tr>
                                    </table>

                                    <div style="margin-top: 16px; border:1px solid #eef2f7; border-radius: 10px; overflow:hidden;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                                            <tr style="background:#f9fafb;">
                                                <td style="padding: 10px 14px; color:#6b7280; width: 140px;">Review ID</td>
                                                <td style="padding: 10px 14px; color:#111827; font-weight: 600;">${escapeHtml(reviewId)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 14px; color:#6b7280;">Product</td>
                                                <td style="padding: 10px 14px; color:#111827;">${escapeHtml(productName || '')} (${escapeHtml(productId)})</td>
                                            </tr>
                                            <tr style="background:#f9fafb;">
                                                <td style="padding: 10px 14px; color:#6b7280;">User ID</td>
                                                <td style="padding: 10px 14px; color:#111827;">${escapeHtml(userId)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 14px; color:#6b7280;">Rating</td>
                                                <td style="padding: 10px 14px; color:#111827;">${escapeHtml(rating)}</td>
                                            </tr>
                                            <tr style="background:#f9fafb;">
                                                <td style="padding: 10px 14px; color:#6b7280;">Category</td>
                                                <td style="padding: 10px 14px; color:#111827;">${escapeHtml(categoryText)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 14px; color:#6b7280;">Labels</td>
                                                <td style="padding: 10px 14px; color:#111827;">${escapeHtml(labelText)}</td>
                                            </tr>
                                            <tr style="background:#f9fafb;">
                                                <td style="padding: 10px 14px; color:#6b7280;">Reason</td>
                                                <td style="padding: 10px 14px; color:#111827;">${escapeHtml(reason)}</td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div style="margin-top: 18px; font-size: 12px; color:#6b7280;">Comment</div>
                                    <div style="margin-top: 6px; background:#f8fafc; border:1px solid #e2e8f0; padding: 12px 14px; border-radius: 10px; color:#111827; line-height: 1.6; white-space: pre-wrap;">
                                        ${safeComment}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 14px 28px; background:#f9fafb; border-top:1px solid #e5e7eb; font-size: 12px; color:#6b7280;">
                                    Review this content in the admin panel. If this is expected, no action is required.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `

        const mailOptions = {
            from: `${fromName} <${fromEmail}>`,
            to,
            subject: 'Canh bao review doc hai',
            html,
            replyTo: process.env.EMAIL_REPLY_TO || fromEmail
        }

        const result = await transporter.sendMail(mailOptions)
        console.log('Email sent successfully:', result.messageId)
        return { success: true, messageId: result.messageId }
    } catch (error) {
        console.error('Error sending moderation email:', error)
        return { success: false, error: error.message }
    }
}

module.exports = {
    sendOTPEmail,
    sendReviewModerationAlert
}