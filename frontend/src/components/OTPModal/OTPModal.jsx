import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Typography, Space, message, Divider } from 'antd'
import { MailOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import * as OTPService from '../../service/OTPService'

const { Title, Text } = Typography

const OTPModal = ({
    visible,
    onClose,
    onSuccess,
    email,
    type = 'signup', // 'signup' or 'reset'
    title = 'Xác thực OTP'
}) => {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
    const [canResend, setCanResend] = useState(false)

    // Countdown timer
    useEffect(() => {
        if (!visible) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setCanResend(true)
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [visible])

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setOtp('')
            setTimeLeft(600)
            setCanResend(false)
        }
    }, [visible])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) {
            message.error('Vui lòng nhập đủ 6 chữ số')
            return
        }

        setLoading(true)
        try {
            const response = await OTPService.verifySignupOTP(email, otp)
            if (response.status === 'OK') {
                message.success('Xác thực OTP thành công!')
                onSuccess && onSuccess(response.data)
                onClose()
            } else {
                message.error(response.message)
                if (response.attemptsLeft !== undefined) {
                    message.warning(`Còn lại ${response.attemptsLeft} lần thử`)
                }
            }
        } catch (error) {
            console.error('OTP verification error:', error)
            message.error(error.response?.data?.message || 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResendLoading(true)
        try {
            let response
            if (type === 'signup') {
                response = await OTPService.sendSignupOTP(email)
            } else {
                response = await OTPService.sendResetPasswordOTP(email)
            }

            if (response.status === 'OK') {
                message.success('Mã OTP mới đã được gửi!')
                setTimeLeft(600)
                setCanResend(false)
                setOtp('')
            } else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Resend OTP error:', error)
            message.error('Không thể gửi lại OTP')
        } finally {
            setResendLoading(false)
        }
    }

    const handleOtpChange = (value) => {
        // Chỉ cho phép số và tối đa 6 ký tự
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6)
        setOtp(numericValue)
    }

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={450}
            centered
            maskClosable={false}
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ marginBottom: 20 }}>
                    <MailOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>

                <Title level={3} style={{ marginBottom: 8 }}>
                    {title}
                </Title>

                <Text type="secondary" style={{ fontSize: 14 }}>
                    Mã OTP đã được gửi đến email
                </Text>
                <br />
                <Text strong style={{ color: '#1890ff' }}>
                    {email}
                </Text>

                <Divider />

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Nhập mã OTP (6 chữ số)
                        </Text>
                        <Input
                            value={otp}
                            onChange={(e) => handleOtpChange(e.target.value)}
                            placeholder="000000"
                            style={{
                                fontSize: 18,
                                textAlign: 'center',
                                letterSpacing: '0.2em'
                            }}
                            maxLength={6}
                            onPressEnter={handleVerify}
                        />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {timeLeft > 0 ? (
                            <Space>
                                <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                                <Text type="secondary">
                                    Mã sẽ hết hạn sau {formatTime(timeLeft)}
                                </Text>
                            </Space>
                        ) : (
                            <Space>
                                <Text type="danger">Mã OTP đã hết hạn</Text>
                            </Space>
                        )}
                    </div>

                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Button
                            type="link"
                            onClick={handleResend}
                            disabled={!canResend}
                            loading={resendLoading}
                            style={{ padding: 0 }}
                        >
                            Gửi lại mã OTP
                        </Button>

                        <Button
                            type="primary"
                            onClick={handleVerify}
                            loading={loading}
                            disabled={!otp || otp.length !== 6}
                            icon={<CheckCircleOutlined />}
                        >
                            Xác thực
                        </Button>
                    </Space>
                </Space>
            </div>
        </Modal>
    )
}

export default OTPModal