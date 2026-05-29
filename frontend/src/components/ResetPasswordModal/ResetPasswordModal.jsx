import React, { useState } from 'react'
import { Modal, Input, Button, Typography, Space, message, Form } from 'antd'
import { LockOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons'
import * as OTPService from '../../service/OTPService'

const { Title, Text } = Typography

const ResetPasswordModal = ({ visible, onClose, onSuccess }) => {
    const [step, setStep] = useState(1) // 1: Email, 2: OTP + New Password
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleSendOTP = async (values) => {
        setLoading(true)
        try {
            const response = await OTPService.sendResetPasswordOTP(values.email)
            if (response.status === 'OK') {
                message.success('An OTP has been sent to your email!')
                setEmail(values.email)
                setStep(2)
            } else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Send OTP error:', error)
            message.error(error.response?.data?.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (values) => {
        setLoading(true)
        try {
            const response = await OTPService.resetPasswordWithOTP(
                email,
                values.otp,
                values.newPassword
            )
            if (response.status === 'OK') {
                message.success('Password reset successfully!')
                onSuccess && onSuccess()
                handleClose()
            } else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Reset password error:', error)
            message.error(error.response?.data?.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setStep(1)
        setEmail('')
        form.resetFields()
        onClose()
    }

    const handleBack = () => {
        setStep(1)
        setEmail('')
    }

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={450}
            centered
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ marginBottom: 20 }}>
                    <LockOutlined style={{ fontSize: 48, color: '#fa541c' }} />
                </div>

                <Title level={3} style={{ marginBottom: 8 }}>
                    Restore password
                </Title>

                {step === 1 && (
                    <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                            Enter your email to receive a password reset OTP
                        </Text>

                        <Form
                            form={form}
                            onFinish={handleSendOTP}
                            layout="vertical"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email!' },
                                    { type: 'email', message: 'Invalid email!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Enter your email"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    block
                                    style={{ backgroundColor: '#1890ff', color: '#fff' }}
                                >
                                    Send OTP
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            An OTP has been sent to
                        </Text>
                        <Text strong style={{ color: '#1890ff', display: 'block', marginBottom: 24 }}>
                            {email}
                        </Text>

                        <Form
                            form={form}
                            onFinish={handleResetPassword}
                            layout="vertical"
                        >
                            <Form.Item
                                name="otp"
                                label="OTP Code"
                                rules={[
                                    { required: true, message: 'Please enter the OTP!' },
                                    { len: 6, message: 'OTP must be 6 digits!' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter OTP (6 digits)"
                                    maxLength={6}
                                    style={{
                                        fontSize: 16,
                                        textAlign: 'center',
                                        letterSpacing: '0.1em'
                                    }}
                                    onChange={(e) => {
                                        // Chỉ cho phép số
                                        const value = e.target.value.replace(/[^0-9]/g, '')
                                        form.setFieldValue('otp', value)
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="newPassword"
                                label="New Password"
                                rules={[
                                    { required: true, message: 'Please enter a new password!' },
                                    { min: 6, message: 'Password must be at least 6 characters long!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter new password"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Confirm password"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Please confirm your password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(new Error('Passwords do not match!'))
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm new password"
                                />
                            </Form.Item>

                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Button type="primary" onClick={handleBack}>
                                    Back
                                </Button>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<CheckCircleOutlined />}
                                    style={{ backgroundColor: '#1890ff', color: '#fff' }}
                                >
                                    Reset Password
                                </Button>
                            </Space>
                        </Form>
                    </>
                )}
            </div>
        </Modal>
    )
}

export default ResetPasswordModal