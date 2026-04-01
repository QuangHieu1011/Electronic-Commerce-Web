import React, { useState, useEffect, useCallback } from 'react'
import {
    WrapperContainer,
    WrapperHeader,
    WrapperProductInfo,
    WrapperProductImage,
    // WrapperProductDetails (không sử dụng)
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
import OrderTrackMap from '../../components/OrderTrackMap/OrderTrackMap'
import { formatPrice } from '../../utils'
import { useLanguage } from '../../context/LanguageContext'

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
    const { t, language } = useLanguage()

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
            message.warning(t('orderTracking.loginRequired'))
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

    // Get order status color and text
    const getOrderStatusInfo = (status) => {
        const statusMap = {
            'pending': { color: 'orange', text: t('orderTracking.pending'), icon: <ClockCircleOutlined /> },
            'paid': { color: 'green', text: t('orderTracking.paid'), icon: <CheckCircleOutlined /> },
            'confirmed': { color: 'blue', text: t('orderTracking.confirmed'), icon: <CheckCircleOutlined /> },
            'shipping': { color: 'cyan', text: t('orderTracking.shipping'), icon: <TruckOutlined /> },
            'delivered': { color: 'green', text: t('orderTracking.delivered'), icon: <CheckCircleOutlined /> },
            'cancelled': { color: 'red', text: t('orderTracking.cancelled'), icon: <DeleteOutlined /> }
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
                    message.success(t('orderTracking.cancelSuccess'))
                }
            } else {
                // Fallback to local update
                dispatch(cancelOrder({ orderId }))
                message.success(t('orderTracking.cancelLocalSuccess'))
            }
        } catch (error) {
            console.error('Error cancelling order:', error)
            message.error(`${t('orderTracking.cancelError')} ${error.response?.data?.message || error.message}`)
        }
    }

    // Handle reorder - navigate to checkout with order items
    const handleReorder = (orderId) => {
        try {
            if (!user?.access_token) {
                message.error(t('orderTracking.reorderLoginRequired'))
                return
            }

            // Tìm đơn hàng cần mua lại
            const orderToReorder = userOrders.find(order => order._id === orderId)

            if (!orderToReorder) {
                message.error(t('orderTracking.orderNotFound'))
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

            message.success(t('orderTracking.redirectCheckout'))
        } catch (error) {
            console.error('Error preparing reorder:', error)
            message.error(t('orderTracking.reorderPrepareError'))
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
                    {t('orderTracking.backHome')}
                </Button>
                <h2>{t('orderTracking.title')}</h2>
                {(!user?.id && !user?._id) && (
                    <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#fff9' }}>
                        {t('orderTracking.loginHint')}
                    </div>
                )}
            </WrapperHeader>

            <Spin spinning={loading} tip={t('orderTracking.loadingOrders')} size="large">

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
                            placeholder={t('orderTracking.searchPlaceholder')}
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
                            <Option value="all">{t('orderTracking.allStatuses')}</Option>
                            <Option value="pending">{t('orderTracking.pending')}</Option>
                            <Option value="paid">{t('orderTracking.paid')}</Option>
                            <Option value="confirmed">{t('orderTracking.confirmed')}</Option>
                            <Option value="shipping">{t('orderTracking.shipping')}</Option>
                            <Option value="delivered">{t('orderTracking.delivered')}</Option>
                            <Option value="cancelled">{t('orderTracking.cancelled')}</Option>
                        </Select>

                        <div style={{ marginLeft: 'auto', color: '#666' }}>
                            {t('orderTracking.totalOrders', { count: filteredOrders.length })}
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <WrapperEmpty>
                        <div className="empty-title">
                            {userOrders.length === 0 ? t('orderTracking.noOrders') : t('orderTracking.noResult')}
                        </div>
                        <div className="empty-description">
                            {userOrders.length === 0 ? t('orderTracking.noOrdersDesc') : t('orderTracking.noResultDesc')}
                        </div>
                        <Button className="shopping-btn" type="primary" onClick={() => navigate('/')}>
                            {userOrders.length === 0 ? t('orderTracking.startShopping') : t('orderTracking.backHome')}
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
                                                    <strong style={{ fontSize: '16px' }}>{t('orderTracking.orderLabel')} #{order._id.slice(-8).toUpperCase()}</strong>
                                                    <Tag color={statusInfo.color} icon={statusInfo.icon} style={{ fontSize: '12px' }}>
                                                        {statusInfo.text}
                                                    </Tag>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    <div>{t('orderTracking.placedAt')} {new Date(order.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}</div>
                                                    {order.shippingInfo?.fullName && (
                                                        <div>{t('orderTracking.receiver')} {order.shippingInfo.fullName} - {order.shippingInfo.phone}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {/* Users can only cancel pending orders (not paid orders) */}
                                                {order.orderStatus === 'pending' && (
                                                    <Popconfirm
                                                        title={t('orderTracking.cancelConfirm')}
                                                        onConfirm={() => handleCancelOrder(order._id)}
                                                        okText={t('orderTracking.yes')}
                                                        cancelText={t('orderTracking.no')}
                                                        okButtonProps={{ danger: true, type: 'primary' }}
                                                    >
                                                        <Button size="small" danger>
                                                            {t('adminOrders.cancel')}
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
                                                        {t('orderTracking.reorder')}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Tracking Map */}
                                        <OrderTrackMap 
                                            orderStatus={order.orderStatus}
                                            createdAt={order.createdAt}
                                        />

                                        {/* Shipping Info */}
                                        {order.shippingInfo && (
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '12px',
                                                borderRadius: '6px',
                                                marginBottom: '16px',
                                                fontSize: '13px'
                                            }}>
                                                <strong>{t('orderTracking.shippingAddress')}</strong>
                                                <div>{order.shippingInfo.address}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.province}</div>
                                                {order.shippingInfo.note && <div>{t('orderTracking.note')} {order.shippingInfo.note}</div>}
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
                                                            {t('adminOrders.quantityShort')}: {item.quantity} x {formatPrice(calculateDiscountedPrice(item.product))}
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
                                                <div>{t('orderTracking.paymentMethod')} {
                                                    order.paymentMethod === 'cod' ? t('orderTracking.cod') :
                                                        order.paymentMethod === 'paypal' ? 'PayPal' :
                                                            order.paymentMethod === 'banking' ? t('orderTracking.banking') :
                                                                t('orderTracking.card')
                                                }</div>
                                                <div>{t('orderTracking.paymentStatus')}
                                                    <Tag color={order.orderStatus === 'paid' || order.paymentStatus === 'paid' ? 'green' : 'orange'} style={{ marginLeft: '8px' }}>
                                                        {order.orderStatus === 'paid' || order.paymentStatus === 'paid' ? t('orderTracking.paid') : t('adminOrders.unpaid')}
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
                                                    {t('orderTracking.totalAmount')} {formatPrice(order.finalAmount ?? order.totalAmount)}
                                                </div>
                                                {order.voucher?.appliedDiscount > 0 && (
                                                    <div style={{ fontSize: '12px', color: '#1890ff' }}>
                                                        ({t('orderTracking.savedAmount')} {formatPrice(order.voucher.appliedDiscount)})
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    ({t('orderTracking.includeShippingFee')})
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