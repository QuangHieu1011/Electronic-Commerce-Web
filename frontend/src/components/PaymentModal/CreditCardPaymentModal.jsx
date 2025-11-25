import React, { useState } from 'react'
import { Modal, Form, Input, Button, message, Select, Row, Col } from 'antd'
import { CreditCardOutlined, LockOutlined } from '@ant-design/icons'

const { Option } = Select

const CreditCardPaymentModal = ({ visible, onClose, onSuccess, orderData }) => {
    const [form] = Form.useForm()
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (values) => {
        setProcessing(true)
        
        // Giả lập xử lý thanh toán trong 3 giây
        setTimeout(() => {
            setProcessing(false)
            message.success('Thanh toán thành công!')
            form.resetFields()
            onSuccess()
        }, 3000)
    }

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CreditCardOutlined style={{ fontSize: 20, color: '#722ed1' }} />
                    <span>Thanh toán bằng thẻ</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ padding: '20px 0' }}
            >
                {/* Số tiền */}
                <div style={{ 
                    textAlign: 'center', 
                    background: '#f0f0f0', 
                    padding: 16, 
                    borderRadius: 8,
                    marginBottom: 24
                }}>
                    <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Số tiền thanh toán</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#ff4d4f' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderData?.totalAmount || 0)}
                    </div>
                </div>

                {/* Số thẻ */}
                <Form.Item
                    label="Số thẻ"
                    name="cardNumber"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số thẻ!' },
                        { len: 19, message: 'Số thẻ không hợp lệ!' }
                    ]}
                    normalize={formatCardNumber}
                >
                    <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        prefix={<CreditCardOutlined />}
                        size="large"
                    />
                </Form.Item>

                {/* Tên chủ thẻ */}
                <Form.Item
                    label="Tên chủ thẻ"
                    name="cardHolder"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên chủ thẻ!' },
                        { 
                            pattern: /^[A-Za-z\s]+$/, 
                            message: 'Tên chỉ được chứa chữ cái và khoảng trắng!' 
                        }
                    ]}
                    normalize={(value) => value.toUpperCase()}
                >
                    <Input
                        placeholder="NGUYEN VAN A"
                        size="large"
                    />
                </Form.Item>

                <Row gutter={16}>
                    {/* Ngày hết hạn */}
                    <Col span={12}>
                        <Form.Item
                            label="Ngày hết hạn"
                            name="expiryDate"
                            rules={[
                                { required: true, message: 'Vui lòng nhập ngày hết hạn!' },
                                { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Định dạng: MM/YY' }
                            ]}
                        >
                            <Input
                                placeholder="MM/YY"
                                maxLength={5}
                                size="large"
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '')
                                    if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 4)
                                    }
                                    form.setFieldValue('expiryDate', value)
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* CVV */}
                    <Col span={12}>
                        <Form.Item
                            label="CVV"
                            name="cvv"
                            rules={[
                                { required: true, message: 'Vui lòng nhập CVV!' },
                                { len: 3, message: 'CVV phải có 3 số!' }
                            ]}
                        >
                            <Input
                                placeholder="123"
                                maxLength={3}
                                type="password"
                                prefix={<LockOutlined />}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Loại thẻ */}
                <Form.Item
                    label="Loại thẻ"
                    name="cardType"
                    initialValue="visa"
                >
                    <Select size="large">
                        <Option value="visa">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>💳 Visa</span>
                            </div>
                        </Option>
                        <Option value="mastercard">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>💳 Mastercard</span>
                            </div>
                        </Option>
                        <Option value="jcb">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>💳 JCB</span>
                            </div>
                        </Option>
                    </Select>
                </Form.Item>

                {/* Thông báo bảo mật */}
                <div style={{ 
                    background: '#e6f7ff', 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 16,
                    fontSize: 12
                }}>
                    <LockOutlined style={{ marginRight: 6 }} />
                    Thông tin thẻ của bạn được mã hóa và bảo mật tuyệt đối
                </div>

                {/* Nút thanh toán */}
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={processing}
                    block
                    style={{ 
                        height: 48, 
                        fontSize: 16, 
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                    }}
                >
                    {processing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                </Button>

                <div style={{ marginTop: 12, fontSize: 12, color: '#999', textAlign: 'center' }}>
                    * Đây là chức năng demo. Không thu phí thật
                </div>
            </Form>
        </Modal>
    )
}

export default CreditCardPaymentModal
