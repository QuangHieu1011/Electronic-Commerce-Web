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
                message.success('Mã OTP đã được gửi đến email của bạn!')
                setEmail(values.email)
                setStep(2)
            } else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Send OTP error:', error)
            message.error(error.response?.data?.message || 'Có lỗi xảy ra')
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
                message.success('Đặt lại mật khẩu thành công!')
                onSuccess && onSuccess()
                handleClose()
            } else {
                message.error(response.message)
            }
        } catch (error) {
            console.error('Reset password error:', error)
            message.error(error.response?.data?.message || 'Có lỗi xảy ra')
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
                    Khôi phục mật khẩu
                </Title>

                {step === 1 && (
                    <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                            Nhập email để nhận mã OTP khôi phục mật khẩu
                        </Text>

                        <Form
                            form={form}
                            onFinish={handleSendOTP}
                            layout="vertical"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Nhập email của bạn"
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
                                >
                                    Gửi mã OTP
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            Mã OTP đã được gửi đến
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
                                label="Mã OTP"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã OTP!' },
                                    { len: 6, message: 'Mã OTP phải có 6 chữ số!' }
                                ]}
                            >
                                <Input
                                    placeholder="Nhập mã OTP (6 chữ số)"
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
                                label="Mật khẩu mới"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'))
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Xác nhận mật khẩu mới"
                                />
                            </Form.Item>

                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Button onClick={handleBack}>
                                    Quay lại
                                </Button>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<CheckCircleOutlined />}
                                >
                                    Đặt lại mật khẩu
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