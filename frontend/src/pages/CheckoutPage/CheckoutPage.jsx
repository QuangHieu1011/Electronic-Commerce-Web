import React, { useState, useEffect, useMemo } from 'react'
import {
    Button,
    Form,
    Input,
    Select,
    Radio,
    Divider,
    Card,
    Row,
    Col,
    Image,
    message,
    Space,
    Typography
} from 'antd'
import {
    ArrowLeftOutlined,
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { createOrder } from '../../redux/slides/orderSlice'
import { removeFromCart } from '../../redux/slides/cartSlice'
// import { updateUser } from '../../redux/slides/userSlide'
import * as OrderService from '../../service/OrderService'
import {
    WrapperContainer,
    WrapperHeader,
    WrapperContent,
    WrapperSection,
    WrapperSummary
} from './style'

const { Title, Text } = Typography
const { Option } = Select

const CheckoutPage = () => {
    const [form] = Form.useForm()
    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    // Lấy thông tin sản phẩm từ state được truyền qua navigation
    const selectedProducts = useMemo(() => location.state?.selectedProducts || [], [location.state?.selectedProducts])
    const totalAmount = useMemo(() => location.state?.totalAmount || 0, [location.state?.totalAmount])
    const user = useSelector((state) => state.user)

    // Kiểm tra đăng nhập khi vào trang checkout
    useEffect(() => {
        console.log('=== CHECKOUT PAGE DEBUG ===')
        console.log('User state:', user)
        console.log('User access token:', user?.access_token)
        console.log('Selected products:', selectedProducts)
        console.log('Total amount:', totalAmount)

        // Nếu chưa đăng nhập, redirect về trang đăng nhập
        if (!user?.access_token) {
            message.warning('Vui lòng đăng nhập để đặt hàng!')
            navigate('/sign-in', {
                state: {
                    from: '/checkout',
                    selectedProducts: selectedProducts,
                    totalAmount: totalAmount
                }
            })
            return
        }

        // Pre-fill form với thông tin user nếu đã đăng nhập
        if (user) {
            form.setFieldsValue({
                fullName: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            })
        }
    }, [user, form, navigate, selectedProducts, totalAmount]) // eslint-disable-line react-hooks/exhaustive-deps

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Xử lý khi hoàn tất đơn hàng
    const handleFinishOrder = async (values) => {
        setLoading(true)

        try {
            // Tạo đơn hàng
            const orderData = {
                orderItems: selectedProducts,
                userInfo: user,
                totalAmount: totalAmount + 30000, // Cộng phí ship
                shippingInfo: {
                    fullName: values.fullName,
                    phone: values.phone,
                    address: values.address,
                    ward: values.ward,
                    district: values.district,
                    province: values.province,
                    note: values.note || ''
                },
                paymentMethod: paymentMethod
            }

            console.log('Sending order data:', orderData)
            console.log('User access token:', user?.access_token)
            console.log('Token length:', user?.access_token?.length)
            console.log('Is user logged in?', !!user?.id)

            // Gọi API để lưu vào database
            if (user?.access_token) {
                const response = await OrderService.createOrder(orderData, user.access_token)
                console.log('API response:', response)

                if (response.status === 'OK') {
                    // Cũng lưu vào Redux để sync UI ngay lập tức
                    dispatch(createOrder(orderData))

                    // Xóa sản phẩm đã mua khỏi giỏ hàng
                    selectedProducts.forEach(item => {
                        dispatch(removeFromCart({ productId: item.product._id }))
                    })

                    message.success('Đặt hàng thành công!')
                    navigate('/order-tracking')
                } else {
                    throw new Error(response.message || 'Lỗi từ server')
                }
            } else {
                // Fallback: chỉ lưu local nếu không có token
                dispatch(createOrder(orderData))
                selectedProducts.forEach(item => {
                    dispatch(removeFromCart({ productId: item.product._id }))
                })
                message.success('Đặt hàng thành công (chưa đăng nhập)!')
                navigate('/order-tracking')
            }

        } catch (error) {
            console.error('Order creation error:', error)
            message.error('Có lỗi xảy ra khi đặt hàng: ' + (error.response?.data?.message || error.message))
        } finally {
            setLoading(false)
        }
    }

    if (selectedProducts.length === 0) {
        return (
            <WrapperContainer>
                <WrapperHeader>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/order')}
                    >
                        Quay lại
                    </Button>
                    <Title level={3}>Không có sản phẩm để thanh toán</Title>
                </WrapperHeader>
            </WrapperContainer>
        )
    }

    return (
        <WrapperContainer>
            <WrapperHeader>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/order')}
                >
                    Quay lại giỏ hàng
                </Button>
                <Title level={3}>Thanh toán đơn hàng</Title>
            </WrapperHeader>

            <WrapperContent>
                <Row gutter={24}>
                    {/* Cột trái - Form thông tin */}
                    <Col span={16}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinishOrder}
                            initialValues={{
                                fullName: user?.name || '',
                                phone: user?.phone || '',
                                province: 'Hồ Chí Minh',
                                paymentMethod: 'cod'
                            }}
                        >
                            {/* Thông tin giao hàng */}
                            <WrapperSection>
                                <Title level={4}>Thông tin giao hàng</Title>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Họ và tên"
                                            name="fullName"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                        >
                                            <Input placeholder="Nhập họ và tên" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phone"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                                            ]}
                                        >
                                            <Input placeholder="Nhập số điện thoại" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Tỉnh/Thành phố"
                                            name="province"
                                            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                                        >
                                            <Select placeholder="Chọn tỉnh/thành phố">
                                                <Option value="Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                                                <Option value="Hà Nội">Hà Nội</Option>
                                                <Option value="Đà Nẵng">Đà Nẵng</Option>
                                                <Option value="Cần Thơ">Cần Thơ</Option>
                                                <Option value="Khác">Tỉnh khác</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Quận/Huyện"
                                            name="district"
                                            rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
                                        >
                                            <Input placeholder="Nhập quận/huyện" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Phường/Xã"
                                            name="ward"
                                            rules={[{ required: true, message: 'Vui lòng nhập phường/xã!' }]}
                                        >
                                            <Input placeholder="Nhập phường/xã" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Địa chỉ cụ thể"
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                >
                                    <Input placeholder="Số nhà, tên đường..." />
                                </Form.Item>

                                <Form.Item label="Ghi chú" name="note">
                                    <Input.TextArea placeholder="Ghi chú cho đơn hàng (không bắt buộc)" rows={3} />
                                </Form.Item>
                            </WrapperSection>

                            {/* Hình thức thanh toán */}
                            <WrapperSection>
                                <Title level={4}>Hình thức thanh toán</Title>
                                <Radio.Group
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Card
                                            hoverable
                                            className={paymentMethod === 'cod' ? 'selected' : ''}
                                            onClick={() => setPaymentMethod('cod')}
                                        >
                                            <Radio value="cod">
                                                <Space>
                                                    <WalletOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>Thanh toán khi nhận hàng (COD)</div>
                                                        <div style={{ fontSize: 12, color: '#666' }}>Thanh toán bằng tiền mặt khi nhận hàng</div>
                                                    </div>
                                                </Space>
                                            </Radio>
                                        </Card>

                                        <Card
                                            hoverable
                                            className={paymentMethod === 'banking' ? 'selected' : ''}
                                            onClick={() => setPaymentMethod('banking')}
                                        >
                                            <Radio value="banking">
                                                <Space>
                                                    <BankOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>Chuyển khoản ngân hàng</div>
                                                        <div style={{ fontSize: 12, color: '#666' }}>Chuyển khoản qua ATM, Internet Banking</div>
                                                    </div>
                                                </Space>
                                            </Radio>
                                        </Card>

                                        <Card
                                            hoverable
                                            className={paymentMethod === 'credit' ? 'selected' : ''}
                                            onClick={() => setPaymentMethod('credit')}
                                        >
                                            <Radio value="credit">
                                                <Space>
                                                    <CreditCardOutlined style={{ fontSize: 20, color: '#722ed1' }} />
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>Thanh toán bằng thẻ</div>
                                                        <div style={{ fontSize: 12, color: '#666' }}>Visa, MasterCard, JCB</div>
                                                    </div>
                                                </Space>
                                            </Radio>
                                        </Card>
                                    </Space>
                                </Radio.Group>
                            </WrapperSection>

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                style={{
                                    width: '100%',
                                    height: 50,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none'
                                }}
                            >
                                <CheckCircleOutlined />
                                Hoàn tất đơn hàng
                            </Button>
                        </Form>
                    </Col>

                    {/* Cột phải - Tóm tắt đơn hàng */}
                    <Col span={8}>
                        <WrapperSummary>
                            <Title level={4}>Tóm tắt đơn hàng</Title>

                            {/* Danh sách sản phẩm */}
                            <div style={{ marginBottom: 16 }}>
                                {selectedProducts.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                        padding: 12,
                                        border: '1px solid #f0f0f0',
                                        borderRadius: 8
                                    }}>
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={50}
                                            height={50}
                                            style={{ borderRadius: 4 }}
                                            preview={false}
                                        />
                                        <div style={{ flex: 1, marginLeft: 12 }}>
                                            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                                                {item.product.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                SL: {item.quantity} x {formatPrice(item.product.discount || item.product.price)}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#ff4d4f' }}>
                                            {formatPrice((item.product.discount || item.product.price) * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Divider />

                            {/* Tính tổng */}
                            <div style={{ fontSize: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span>Tạm tính ({selectedProducts.length} sản phẩm):</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span>Phí vận chuyển:</span>
                                    <span>{formatPrice(30000)}</span>
                                </div>
                                <Divider />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600, color: '#ff4d4f' }}>
                                    <span>Tổng cộng:</span>
                                    <span>{formatPrice(totalAmount + 30000)}</span>
                                </div>
                            </div>

                            {paymentMethod === 'banking' && (
                                <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
                                    <Text strong>Thông tin chuyển khoản:</Text>
                                    <div style={{ fontSize: 12, marginTop: 8 }}>
                                        <div>STK: 1234567890</div>
                                        <div>Ngân hàng: Vietcombank</div>
                                        <div>Chủ TK: SHOP ELECTRONICS</div>
                                    </div>
                                </div>
                            )}
                        </WrapperSummary>
                    </Col>
                </Row>
            </WrapperContent>
        </WrapperContainer>
    )
}

export default CheckoutPage