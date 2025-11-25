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
    Typography,
    Tag,
    Modal
} from 'antd'
import {
    ArrowLeftOutlined,
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    CheckCircleOutlined,
    GiftOutlined,
    CloseCircleOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { createOrder } from '../../redux/slides/orderSlice'
import { removeFromCart } from '../../redux/slides/cartSlice'
import * as OrderService from '../../service/OrderService'
import BankingPaymentModal from '../../components/PaymentModal/BankingPaymentModal'
import CreditCardPaymentModal from '../../components/PaymentModal/CreditCardPaymentModal'
import VoucherModal from '../../components/PaymentModal/VoucherModal'
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
    const [showBankingModal, setShowBankingModal] = useState(false)
    const [showCreditModal, setShowCreditModal] = useState(false)
    const [showVoucherModal, setShowVoucherModal] = useState(false)
    const [appliedVoucher, setAppliedVoucher] = useState(null)
    const [shippingFee, setShippingFee] = useState(30000)

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

    // Tính phí ship theo tỉnh/thành
    useEffect(() => {
        const province = form.getFieldValue('province')
        if (province === 'Hồ Chí Minh' || province === 'Hà Nội') {
            setShippingFee(30000) // Nội thành
        } else if (province === 'Đà Nẵng' || province === 'Cần Thơ') {
            setShippingFee(50000) // Thành phố lớn
        } else {
            setShippingFee(70000) // Tỉnh xa
        }
    }, [form])

    // Tính tổng tiền sau khi áp voucher
    const calculateFinalAmount = useMemo(() => {
        let total = totalAmount + shippingFee

        if (appliedVoucher) {
            if (appliedVoucher.discountType === 'shipping') {
                // Giảm phí ship
                total = totalAmount + Math.max(0, shippingFee - appliedVoucher.appliedDiscount)
            } else {
                // Giảm tổng đơn hàng
                total = totalAmount + shippingFee - appliedVoucher.appliedDiscount
            }
        }

        return total
    }, [totalAmount, shippingFee, appliedVoucher])

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Xử lý áp dụng voucher
    const handleApplyVoucher = (voucher) => {
        setAppliedVoucher(voucher)
    }

    // Xóa voucher
    const handleRemoveVoucher = () => {
        setAppliedVoucher(null)
        message.info('Đã xóa voucher')
    }

    // Xử lý thanh toán thành công từ modal
    const handlePaymentSuccess = async (values) => {
        await processOrder(values)
    }

    // Xử lý khi hoàn tất đơn hàng
    const handleFinishOrder = async (values) => {
        // Nếu chọn banking hoặc credit card, hiển thị modal thanh toán
        if (paymentMethod === 'banking') {
            setShowBankingModal(true)
            return
        } else if (paymentMethod === 'credit') {
            setShowCreditModal(true)
            return
        }

        // COD - xử lý trực tiếp
        await processOrder(values)
    }

    // Xử lý đơn hàng
    const processOrder = async (values) => {
        setLoading(true)

        try {
            // Tạo đơn hàng
            const orderData = {
                orderItems: selectedProducts,
                userInfo: user,
                totalAmount: totalAmount,
                shippingFee: shippingFee,
                finalAmount: calculateFinalAmount,
                voucher: appliedVoucher ? {
                    code: appliedVoucher.code,
                    title: appliedVoucher.title,
                    discountType: appliedVoucher.discountType,
                    discountValue: appliedVoucher.discountValue,
                    appliedDiscount: appliedVoucher.appliedDiscount
                } : null,
                shippingInfo: {
                    fullName: values.fullName || form.getFieldValue('fullName'),
                    phone: values.phone || form.getFieldValue('phone'),
                    address: values.address || form.getFieldValue('address'),
                    ward: values.ward || form.getFieldValue('ward'),
                    district: values.district || form.getFieldValue('district'),
                    province: values.province || form.getFieldValue('province'),
                    note: values.note || form.getFieldValue('note') || ''
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
                    // Đóng modal nếu có
                    setShowBankingModal(false)
                    setShowCreditModal(false)

                    // Cũng lưu vào Redux để sync UI ngay lập tức
                    dispatch(createOrder(orderData))

                    // Xóa sản phẩm đã mua khỏi giỏ hàng
                    selectedProducts.forEach(item => {
                        dispatch(removeFromCart({ productId: item.product._id }))
                    })

                    // Hiển thị thông báo thành công
                    message.success({
                        content: `🎉 Đặt hàng thành công! Mã đơn hàng: #${response.data?._id?.slice(-8).toUpperCase()}`,
                        duration: 2,
                        onClose: () => {
                            // Chuyển hướng đến trang theo dõi đơn hàng
                            navigate('/order-tracking')
                        }
                    })
                    
                    // Chuyển hướng ngay lập tức sau 1 giây
                    setTimeout(() => {
                        navigate('/order-tracking')
                    }, 1000)
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
                                            <Select 
                                                placeholder="Chọn tỉnh/thành phố"
                                                onChange={(value) => {
                                                    if (value === 'Hồ Chí Minh' || value === 'Hà Nội') {
                                                        setShippingFee(30000)
                                                    } else if (value === 'Đà Nẵng' || value === 'Cần Thơ') {
                                                        setShippingFee(50000)
                                                    } else {
                                                        setShippingFee(70000)
                                                    }
                                                }}
                                            >
                                                <Option value="Hồ Chí Minh">TP. Hồ Chí Minh (30,000đ)</Option>
                                                <Option value="Hà Nội">Hà Nội (30,000đ)</Option>
                                                <Option value="Đà Nẵng">Đà Nẵng (50,000đ)</Option>
                                                <Option value="Cần Thơ">Cần Thơ (50,000đ)</Option>
                                                <Option value="Khác">Tỉnh khác (70,000đ)</Option>
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

                            {/* Mã giảm giá */}
                            <div style={{ marginBottom: 16 }}>
                                {appliedVoucher ? (
                                    <div style={{ 
                                        padding: 12, 
                                        background: '#fff7e6', 
                                        border: '1px solid #ffd591',
                                        borderRadius: 8,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <GiftOutlined style={{ color: '#fa8c16' }} />
                                                <span style={{ fontWeight: 600, fontSize: 13 }}>{appliedVoucher.title}</span>
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                Mã: {appliedVoucher.code} • Giảm {formatPrice(appliedVoucher.appliedDiscount)}
                                            </div>
                                        </div>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CloseCircleOutlined />}
                                            onClick={handleRemoveVoucher}
                                            danger
                                        />
                                    </div>
                                ) : (
                                    <Button
                                        block
                                        size="large"
                                        icon={<GiftOutlined />}
                                        onClick={() => setShowVoucherModal(true)}
                                        style={{
                                            borderStyle: 'dashed',
                                            borderColor: '#ff4d4f',
                                            color: '#ff4d4f'
                                        }}
                                    >
                                        Chọn hoặc nhập mã giảm giá
                                    </Button>
                                )}
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
                                    <span style={{ textDecoration: appliedVoucher?.discountType === 'shipping' ? 'line-through' : 'none', color: appliedVoucher?.discountType === 'shipping' ? '#999' : '#000' }}>
                                        {formatPrice(shippingFee)}
                                    </span>
                                </div>
                                {appliedVoucher?.discountType === 'shipping' && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ color: '#52c41a' }}>Phí ship sau giảm:</span>
                                        <span style={{ color: '#52c41a', fontWeight: 600 }}>
                                            {formatPrice(Math.max(0, shippingFee - appliedVoucher.appliedDiscount))}
                                        </span>
                                    </div>
                                )}
                                {appliedVoucher && appliedVoucher.discountType !== 'shipping' && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ color: '#52c41a' }}>Giảm giá:</span>
                                        <span style={{ color: '#52c41a', fontWeight: 600 }}>
                                            - {formatPrice(appliedVoucher.appliedDiscount)}
                                        </span>
                                    </div>
                                )}
                                <Divider />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600, color: '#ff4d4f' }}>
                                    <span>Tổng cộng:</span>
                                    <span>{formatPrice(calculateFinalAmount)}</span>
                                </div>
                                {appliedVoucher && (
                                    <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8, textAlign: 'right' }}>
                                        Bạn đã tiết kiệm {formatPrice(appliedVoucher.appliedDiscount)}! 🎉
                                    </div>
                                )}
                            </div>
                        </WrapperSummary>
                    </Col>
                </Row>
            </WrapperContent>

            {/* Modals */}
            <BankingPaymentModal
                visible={showBankingModal}
                onClose={() => setShowBankingModal(false)}
                onSuccess={handlePaymentSuccess}
                orderData={{ totalAmount: calculateFinalAmount }}
            />

            <CreditCardPaymentModal
                visible={showCreditModal}
                onClose={() => setShowCreditModal(false)}
                onSuccess={handlePaymentSuccess}
                orderData={{ totalAmount: calculateFinalAmount }}
            />

            <VoucherModal
                visible={showVoucherModal}
                onClose={() => setShowVoucherModal(false)}
                onApply={handleApplyVoucher}
                totalAmount={totalAmount}
            />
        </WrapperContainer>
    )
}

export default CheckoutPage