import React, { useState, useEffect, useCallback } from 'react'
import {
    WrapperContainer,
    WrapperHeader,
    WrapperProductInfo,
    WrapperProductImage,
    WrapperProductDetails,
    WrapperEmpty
} from './style'
import { Button, Tag, Popconfirm, Image, Input, Select, Spin } from 'antd'
import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    TruckOutlined,
    DeleteOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { cancelOrder, syncOrdersFromAPI, clearOrders, updateOrderStatus, updatePaymentStatus } from '../../redux/slides/orderSlice'
import { updateAccessToken } from '../../redux/slides/userSlide'
import { message } from 'antd'
import * as OrderService from '../../service/OrderService'
import socketService from '../../service/SocketService'

const { Option } = Select

const OrderTrackingPage = () => {
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchText, setSearchText] = useState('')
    const [loading, setLoading] = useState(true) // Bắt đầu với loading true

    const orders = useSelector((state) => state.order.orders)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    // Calculate discounted price
    const calculateDiscountedPrice = (product) => {
        if (product.discount && product.discount > 0) {
            return product.price * (1 - product.discount / 100)
        }
        return product.price
    }

    // Load orders function
    const loadUserOrders = useCallback(async () => {
        if (user?.access_token && (user?.id || user?._id)) {
            try {
                setLoading(true)
                console.log('Loading user orders...')
                // Clear existing orders để tránh conflict với admin orders
                dispatch(clearOrders())
                const response = await OrderService.getAllOrdersByUser(user.id || user._id, user.access_token)

                // Nếu có token mới từ refresh, update Redux
                if (response.newAccessToken) {
                    console.log('Updating access token in Redux...')
                    dispatch(updateAccessToken(response.newAccessToken))
                }

                if (response.status === 'OK') {
                    console.log('=== ORDERS LOADED ===')
                    console.log('Orders count:', response.data?.length)
                    console.log('Orders data:', response.data)
                    dispatch(syncOrdersFromAPI(response.data))
                } else {
                    console.log('Failed to load orders:', response)
                }
            } catch (error) {
                console.error('Error loading orders:', error)
            } finally {
                setTimeout(() => setLoading(false), 100)
            }
        } else {
            setLoading(false)
        }
    }, [user?.access_token, user?.id, user?._id, dispatch])

    // Kiểm tra đăng nhập và load orders
    useEffect(() => {
        // Kiểm tra nếu chưa đăng nhập thì chuyển về trang đăng nhập
        if (!user?.access_token) {
            message.warning('Vui lòng đăng nhập để xem đơn hàng!')
            navigate('/sign-in', {
                state: {
                    from: '/order-tracking'
                }
            })
            return
        }

        loadUserOrders()
    }, [user?.access_token, navigate, loadUserOrders])

    // Auto refresh khi có order mới từ checkout và khi vào lại trang
    useEffect(() => {
        // Force reload khi có state từ navigation
        if (location.state?.forceReload && location.state?.newOrderId) {
            console.log('Force reloading orders for new order:', location.state.newOrderId)
            setTimeout(() => {
                loadUserOrders()
            }, 500)

            // Clear state để tránh reload nhiều lần
            navigate('/order-tracking', { replace: true })
            return
        }

        // Auto refresh mỗi khi vào trang (để catch orders mới)
        const timer = setTimeout(() => {
            if (user?.access_token) {
                loadUserOrders()
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [location.state, loadUserOrders, navigate, user?.access_token])

    // Force reload when tab becomes visible (for multi-tab support)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && user?.access_token && !user?.isAdmin) {
                loadUserOrders()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [loadUserOrders, user?.access_token, user?.isAdmin])

    // Socket.IO real-time synchronization - Listen for order updates from admin
    useEffect(() => {
        // Connect to socket
        socketService.connect()

        const handleOrderStatusUpdate = (data) => {
            console.log('User received socket order status update:', data)
            dispatch(updateOrderStatus({
                orderId: data.orderId,
                status: data.newStatus
            }))
        }

        const handlePaymentStatusUpdate = (data) => {
            console.log('User received socket payment status update:', data)
            dispatch(updatePaymentStatus({
                orderId: data.orderId,
                paymentStatus: data.paymentStatus
            }))
        }

        // Listen for socket events
        socketService.on('orderStatusUpdate', handleOrderStatusUpdate)
        socketService.on('paymentStatusUpdate', handlePaymentStatusUpdate)

        return () => {
            socketService.off('orderStatusUpdate', handleOrderStatusUpdate)
            socketService.off('paymentStatusUpdate', handlePaymentStatusUpdate)
        }
    }, [dispatch])

    // Filter orders for current user only (exclude hidden orders)
    const userOrders = orders.filter(order => {
        // Chỉ hiện đơn hàng chưa bị user ẩn
        if (order.isDeletedByUser) {
            return false
        }

        // If user is logged in, show orders for this user
        if (user?.id || user?._id) {
            return order.userId === user.id || order.userId === user._id
        }
        // If not logged in, show guest orders (fallback)
        return order.userId === 'guest'
    })

    // Format price function
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Get order status color and text
    const getOrderStatusInfo = (status) => {
        const statusMap = {
            'pending': { color: 'orange', text: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
            'paid': { color: 'green', text: 'Đã thanh toán', icon: <CheckCircleOutlined /> },
            'confirmed': { color: 'blue', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
            'shipping': { color: 'cyan', text: 'Đang giao hàng', icon: <TruckOutlined /> },
            'delivered': { color: 'green', text: 'Đã giao hàng', icon: <CheckCircleOutlined /> },
            'cancelled': { color: 'red', text: 'Đã hủy', icon: <DeleteOutlined /> }
        }
        return statusMap[status] || statusMap['pending']
    }

    // Handle cancel order
    const handleCancelOrder = async (orderId) => {
        try {
            if (user?.access_token) {
                const response = await OrderService.cancelOrder(orderId, user.access_token)
                if (response.status === 'OK') {
                    dispatch(cancelOrder({ orderId }))
                    message.success('Đã hủy đơn hàng!')
                }
            } else {
                // Fallback to local update
                dispatch(cancelOrder({ orderId }))
                message.success('Đã hủy đơn hàng (local)!')
            }
        } catch (error) {
            console.error('Error cancelling order:', error)
            message.error('Lỗi khi hủy đơn hàng: ' + (error.response?.data?.message || error.message))
        }
    }

    // Handle reorder - navigate to checkout with order items
    const handleReorder = (orderId) => {
        try {
            if (!user?.access_token) {
                message.error('Vui lòng đăng nhập để đặt lại đơn hàng!')
                return
            }

            // Tìm đơn hàng cần mua lại
            const orderToReorder = userOrders.find(order => order._id === orderId)

            if (!orderToReorder) {
                message.error('Không tìm thấy đơn hàng!')
                return
            }

            // Chuẩn bị dữ liệu cho checkout
            const selectedProducts = orderToReorder.orderItems.map(item => ({
                product: item.product,
                quantity: item.quantity || item.amount,
                selected: true
            }))

            const totalAmount = orderToReorder.totalAmount - 30000 // Bỏ phí ship cũ

            // Chuyển đến trang checkout với dữ liệu
            navigate('/checkout', {
                state: {
                    selectedProducts,
                    totalAmount,
                    isReorder: true,
                    originalOrderId: orderId
                }
            })

            message.success('Chuyển đến trang thanh toán!')
        } catch (error) {
            console.error('Error preparing reorder:', error)
            message.error('Lỗi khi chuẩn bị đặt lại đơn hàng!')
        }
    }

    // Users can only cancel pending orders, not change status
    // Status changes are handled by admin in separate page

    // Filter user orders based on status and search
    const filteredOrders = userOrders.filter(order => {
        const matchStatus = filterStatus === 'all' || order.orderStatus === filterStatus
        const matchSearch = searchText === '' ||
            order._id.toLowerCase().includes(searchText.toLowerCase()) ||
            order.orderItems.some(item =>
                item.product.name.toLowerCase().includes(searchText.toLowerCase())
            )
        return matchStatus && matchSearch
    })

    return (
        <WrapperContainer>
            <WrapperHeader>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                >
                    Về trang chủ
                </Button>
                <h2>Theo dõi đơn hàng của tôi</h2>
                {(!user?.id && !user?._id) && (
                    <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#fff9' }}>
                        ⚠️ Vui lòng đăng nhập để xem đầy đủ đơn hàng
                    </div>
                )}
            </WrapperHeader>

            <Spin spinning={loading} tip="Đang tải đơn hàng..." size="large">

                {/* Filter and Search */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Input
                            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ minWidth: 300 }}
                        />

                        <Select
                            value={filterStatus}
                            onChange={setFilterStatus}
                            style={{ minWidth: 150 }}
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="pending">Chờ xác nhận</Option>
                            <Option value="paid">Đã thanh toán</Option>
                            <Option value="confirmed">Đã xác nhận</Option>
                            <Option value="shipping">Đang giao hàng</Option>
                            <Option value="delivered">Đã giao hàng</Option>
                            <Option value="cancelled">Đã hủy</Option>
                        </Select>

                        <div style={{ marginLeft: 'auto', color: '#666' }}>
                            Tổng cộng: <strong>{filteredOrders.length}</strong> đơn hàng của bạn
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <WrapperEmpty>
                        <div className="empty-title">
                            {userOrders.length === 0 ? 'Bạn chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng'}
                        </div>
                        <div className="empty-description">
                            {userOrders.length === 0 ? 'Hãy mua sắm và đặt hàng để theo dõi đơn hàng' : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
                        </div>
                        <Button className="shopping-btn" type="primary" onClick={() => navigate('/')}>
                            {userOrders.length === 0 ? 'Bắt đầu mua sắm' : 'Về trang chủ'}
                        </Button>
                    </WrapperEmpty>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredOrders.map((order) => {
                            const statusInfo = getOrderStatusInfo(order.orderStatus)
                            return (
                                <WrapperProductInfo key={order._id}>
                                    <div className="product-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                        {/* Order Header */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '16px',
                                            paddingBottom: '12px',
                                            borderBottom: '2px solid #f0f0f0'
                                        }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                    <strong style={{ fontSize: '16px' }}>Đơn hàng #{order._id.slice(-8).toUpperCase()}</strong>
                                                    <Tag color={statusInfo.color} icon={statusInfo.icon} style={{ fontSize: '12px' }}>
                                                        {statusInfo.text}
                                                    </Tag>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    <div>Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                                                    {order.shippingInfo?.fullName && (
                                                        <div>Người nhận: {order.shippingInfo.fullName} - {order.shippingInfo.phone}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {/* Users can only cancel pending orders (not paid orders) */}
                                                {order.orderStatus === 'pending' && (
                                                    <Popconfirm
                                                        title="Bạn có chắc muốn hủy đơn hàng này?"
                                                        onConfirm={() => handleCancelOrder(order._id)}
                                                        okText="Có"
                                                        cancelText="Không"
                                                        okButtonProps={{ danger: true, type: 'primary' }}
                                                    >
                                                        <Button size="small" danger>
                                                            Hủy đơn
                                                        </Button>
                                                    </Popconfirm>
                                                )}

                                                {/* Allow reorder for completed orders */}
                                                {order.orderStatus === 'delivered' && (
                                                    <Button
                                                        size="small"
                                                        type="primary"
                                                        onClick={() => handleReorder(order._id)}
                                                    >
                                                        Mua lại
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Shipping Info */}
                                        {order.shippingInfo && (
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '12px',
                                                borderRadius: '6px',
                                                marginBottom: '16px',
                                                fontSize: '13px'
                                            }}>
                                                <strong>Địa chỉ giao hàng:</strong>
                                                <div>{order.shippingInfo.address}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.province}</div>
                                                {order.shippingInfo.note && <div>Ghi chú: {order.shippingInfo.note}</div>}
                                            </div>
                                        )}

                                        {/* Order Items */}
                                        <div style={{ marginBottom: '16px' }}>
                                            {order.orderItems.map((item, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    marginBottom: index < order.orderItems.length - 1 ? '12px' : '0',
                                                    padding: '8px',
                                                    background: '#fafafa',
                                                    borderRadius: '6px'
                                                }}>
                                                    <WrapperProductImage>
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            width={60}
                                                            height={60}
                                                            preview={false}
                                                        />
                                                    </WrapperProductImage>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="product-name" style={{ fontSize: '14px', marginBottom: '4px' }}>
                                                            {item.product.name}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                                            SL: {item.quantity} x {formatPrice(calculateDiscountedPrice(item.product))}
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: '#ff4d4f',
                                                        minWidth: '100px',
                                                        textAlign: 'right'
                                                    }}>
                                                        {formatPrice(calculateDiscountedPrice(item.product) * item.quantity)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Total and Payment */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: '12px',
                                            borderTop: '2px solid #f0f0f0'
                                        }}>
                                            <div style={{ fontSize: '13px', color: '#666' }}>
                                                <div>Phương thức: {
                                                    order.paymentMethod === 'cod' ? 'COD' :
                                                        order.paymentMethod === 'paypal' ? 'PayPal' :
                                                            order.paymentMethod === 'banking' ? 'Chuyển khoản' :
                                                                'Thẻ tín dụng'
                                                }</div>
                                                <div>Trạng thái thanh toán:
                                                    <Tag color={order.orderStatus === 'paid' || order.paymentStatus === 'paid' ? 'green' : 'orange'} style={{ marginLeft: '8px' }}>
                                                        {order.orderStatus === 'paid' || order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                    </Tag>
                                                </div>
                                                {order.paymentInfo?.transactionId && (
                                                    <div style={{ marginTop: '4px' }}>
                                                        Transaction ID:
                                                        <code style={{ marginLeft: '4px', fontSize: '11px', backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '2px' }}>
                                                            {order.paymentInfo.transactionId}
                                                        </code>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#ff4d4f' }}>
                                                    Tổng tiền: {formatPrice(order.totalAmount)}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    (Đã bao gồm phí vận chuyển)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </WrapperProductInfo>
                            )
                        })}
                    </div>
                )}
            </Spin>
        </WrapperContainer>
    )
}

export default OrderTrackingPage