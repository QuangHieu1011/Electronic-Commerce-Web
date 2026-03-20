import React, { useState, useEffect, useCallback } from 'react'
import {
    WrapperContainer,
    WrapperHeader,
    WrapperStats
} from './style'
import {
    Button,
    Tag,
    Space,
    Popconfirm,
    Image,
    Input,
    Select,
    Table,
    Modal,
    Card,
    Row,
    Col,
    Statistic,
    Spin
} from 'antd'
import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    TruckOutlined,
    DeleteOutlined,
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    // EditOutlined (không sử dụng)
    DollarOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import socketService from '../../service/SocketService'
import { updateOrderStatus, updatePaymentStatus, cancelOrder, deleteOrderPermanently, syncOrdersFromAPI, restoreOrderForUser, clearOrders } from '../../redux/slides/orderSlice'
import { message } from 'antd'
import * as OrderService from '../../service/OrderService'
import { formatPrice } from '../../utils'
import { useLanguage } from '../../context/LanguageContext'

const { Option } = Select

const AdminOrderManagement = () => {
    const { t, language } = useLanguage()
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPayment, setFilterPayment] = useState('all')
    const [filterHidden, setFilterHidden] = useState('all')
    const [searchText, setSearchText] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true) // Bắt đầu với loading true

    const orders = useSelector((state) => state.order.orders)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Load orders function
    const loadOrders = useCallback(async () => {
        if (user?.access_token && user?.isAdmin) {
            try {
                setLoading(true)
                console.log('Loading admin orders...')
                // Clear existing orders để tránh conflict với user orders
                dispatch(clearOrders())
                const response = await OrderService.getAllOrders(user.access_token)
                if (response.status === 'OK') {
                    console.log('Admin orders loaded:', response.data?.length)
                    dispatch(syncOrdersFromAPI(response.data))
                }
            } catch (error) {
                console.error('Error loading admin orders:', error)
                message.error(t('adminOrders.loadError'))
            } finally {
                setTimeout(() => setLoading(false), 100)
            }
        } else {
            setLoading(false)
        }
    }, [user?.access_token, user?.isAdmin, dispatch, t])

    // Load all orders for admin
    useEffect(() => {
        loadOrders()
    }, [user, loadOrders])

    // Force reload when tab becomes visible (for multi-tab support)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && user?.isAdmin) {
                loadOrders()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [loadOrders, user?.isAdmin])

    // Socket.IO real-time synchronization across browsers
    useEffect(() => {
        // Connect to socket
        socketService.connect()

        const handleOrderStatusUpdate = (data) => {
            console.log('Admin received socket order status update:', data)
            dispatch(updateOrderStatus({
                orderId: data.orderId,
                status: data.newStatus
            }))
        }

        const handlePaymentStatusUpdate = (data) => {
            console.log('Admin received socket payment status update:', data)
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

    // Get order status info
    const getOrderStatusInfo = (status) => {
        const statusMap = {
            'pending': { color: 'orange', text: t('adminOrders.pending'), icon: <ClockCircleOutlined /> },
            'confirmed': { color: 'blue', text: t('orderTracking.confirmed'), icon: <CheckCircleOutlined /> },
            'shipping': { color: 'cyan', text: t('adminOrders.shipping'), icon: <TruckOutlined /> },
            'delivered': { color: 'green', text: t('orderTracking.delivered'), icon: <CheckCircleOutlined /> },
            'cancelled': { color: 'red', text: t('orderTracking.cancelled'), icon: <DeleteOutlined /> }
        }
        return statusMap[status] || statusMap['pending']
    }

    // Handle update order status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            console.log('Updating order status:', { orderId, newStatus, token: user?.access_token })

            if (!user?.access_token) {
                message.error(t('adminOrders.noAccess'))
                return
            }

            if (!user?.isAdmin) {
                message.error(t('adminOrders.adminOnlyOrder'))
                return
            }

            // Capture the current status so UI can be reverted on API failure.
            const currentOrder = orders.find(order => order._id === orderId)
            const oldStatus = currentOrder?.orderStatus

            // Optimistic update for faster feedback.
            dispatch(updateOrderStatus({ orderId, status: newStatus }))
            message.success(t('adminOrders.orderStatusUpdated'))

            // Then sync with server.
            const response = await OrderService.updateOrderStatus(orderId, newStatus, user.access_token)
            console.log('API response:', response)

            if (response?.status !== 'OK') {
                // Revert UI if API fails.
                if (oldStatus) {
                    dispatch(updateOrderStatus({ orderId, status: oldStatus }))
                }
                throw new Error(response?.message || t('adminOrders.invalidApiResponse'))
            } else {
                // Broadcast update to other tabs.
                const channel = new BroadcastChannel('orderUpdates')
                channel.postMessage({
                    type: 'ORDER_STATUS_UPDATE',
                    orderId,
                    newStatus,
                    timestamp: Date.now()
                })
                channel.close()

                // Backup for older browsers.
                localStorage.setItem('orderUpdate', JSON.stringify({
                    type: 'ORDER_STATUS_UPDATE',
                    orderId,
                    newStatus,
                    timestamp: Date.now()
                }))
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            const errorMessage = error.response?.data?.message || error.message || t('adminOrders.unknownError')
            message.error(`${t('adminOrders.statusUpdateError')} ${errorMessage}`)
        }
    }

    // Handle update payment status
    const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
        try {
            console.log('Updating payment status:', { orderId, paymentStatus, token: user?.access_token })

            if (!user?.access_token) {
                message.error(t('adminOrders.noAccess'))
                return
            }

            if (!user?.isAdmin) {
                message.error(t('adminOrders.adminOnlyPayment'))
                return
            }

            // Capture the current status so UI can be reverted on API failure.
            const currentOrder = orders.find(order => order._id === orderId)
            const oldPaymentStatus = currentOrder?.paymentStatus

            // Optimistic update for faster feedback.
            dispatch(updatePaymentStatus({ orderId, paymentStatus }))
            message.success(t('adminOrders.paymentStatusUpdated'))

            // Then sync with server.
            const response = await OrderService.updatePaymentStatus(orderId, paymentStatus, user.access_token)
            console.log('API response:', response)

            if (response?.status !== 'OK') {
                // Revert UI if API fails.
                if (oldPaymentStatus) {
                    dispatch(updatePaymentStatus({ orderId, paymentStatus: oldPaymentStatus }))
                }
                throw new Error(response?.message || t('adminOrders.invalidApiResponse'))
            } else {
                // Broadcast update to other tabs.
                const channel = new BroadcastChannel('orderUpdates')
                channel.postMessage({
                    type: 'PAYMENT_STATUS_UPDATE',
                    orderId,
                    paymentStatus,
                    timestamp: Date.now()
                })
                channel.close()

                // Backup for older browsers.
                localStorage.setItem('orderUpdate', JSON.stringify({
                    type: 'PAYMENT_STATUS_UPDATE',
                    orderId,
                    paymentStatus,
                    timestamp: Date.now()
                }))
            }
        } catch (error) {
            console.error('Error updating payment status:', error)
            const errorMessage = error.response?.data?.message || error.message || t('adminOrders.unknownError')
            message.error(`${t('adminOrders.paymentUpdateError')} ${errorMessage}`)
        }
    }

    // Handle restore order for user (admin only)
    const handleRestoreOrder = async (orderId) => {
        try {
            console.log('Restoring order:', { orderId, token: user?.access_token })

            if (!user?.access_token) {
                message.error(t('adminOrders.noAccess'))
                return
            }

            if (!user?.isAdmin) {
                message.error(t('adminOrders.adminOnlyRestore'))
                return
            }

            const response = await OrderService.restoreOrderForUser(orderId, user.access_token)
            console.log('API response:', response)

            if (response?.status === 'OK') {
                dispatch(restoreOrderForUser({ orderId }))
                message.success(t('adminOrders.restoreSuccess'))
                // No reload needed, Redux state already updates UI.
            } else {
                throw new Error(response?.message || t('adminOrders.invalidApiResponse'))
            }
        } catch (error) {
            console.error('Error restoring order:', error)
            const errorMessage = error.response?.data?.message || error.message || t('adminOrders.unknownError')
            message.error(`${t('adminOrders.restoreError')} ${errorMessage}`)
        }
    }

    // Handle cancel order
    const handleCancelOrder = async (orderId) => {
        try {
            if (user?.access_token) {
                const response = await OrderService.cancelOrder(orderId, user.access_token)
                if (response.status === 'OK') {
                    dispatch(cancelOrder({ orderId }))
                    message.success(t('adminOrders.cancelSuccess'))
                }
            } else {
                // Fallback to local update
                dispatch(cancelOrder({ orderId }))
                message.success(t('adminOrders.cancelLocalSuccess'))
            }
        } catch (error) {
            console.error('Error cancelling order:', error)
            message.error(`${t('adminOrders.cancelError')} ${error.response?.data?.message || error.message}`)
        }
    }

    // Handle permanent delete order (admin only)
    const handleDeleteOrder = (orderId) => {
        dispatch(deleteOrderPermanently({ orderId }))
        message.success(t('adminOrders.deletePermanentSuccess'))
        setModalVisible(false)
    }

    // Filter orders (Admin thấy tất cả đơn hàng, kể cả đã bị user ẩn)
    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'all' || order.orderStatus === filterStatus
        const matchPayment = filterPayment === 'all' || order.paymentStatus === filterPayment
        const matchHidden = filterHidden === 'all' ||
            (filterHidden === 'hidden' && order.isDeletedByUser) ||
            (filterHidden === 'visible' && !order.isDeletedByUser)
        const matchSearch = searchText === '' ||
            order._id.toLowerCase().includes(searchText.toLowerCase()) ||
            order.shippingInfo?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.orderItems.some(item =>
                item.product.name.toLowerCase().includes(searchText.toLowerCase())
            )
        return matchStatus && matchPayment && matchHidden && matchSearch
    })

    // Statistics
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.orderStatus === 'pending').length,
        confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
        shipping: orders.filter(o => o.orderStatus === 'shipping').length,
        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
        cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
        totalRevenue: orders.filter(o => o.orderStatus === 'delivered').reduce((sum, order) => sum + order.totalAmount, 0),
        unpaidOrders: orders.filter(o => o.paymentStatus === 'unpaid').length
    }

    // Table columns
    const columns = [
        {
            title: t('adminOrders.orderCode'),
            dataIndex: '_id',
            key: '_id',
            render: (id) => (
                <Button type="link" onClick={() => {
                    setSelectedOrder(orders.find(o => o._id === id))
                    setModalVisible(true)
                }}>
                    #{id.slice(-8).toUpperCase()}
                </Button>
            )
        },
        {
            title: t('adminOrders.customer'),
            key: 'customer',
            render: (record) => (
                <div>
                    <div>{record.shippingInfo?.fullName || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{record.shippingInfo?.phone}</div>
                </div>
            )
        },
        {
            title: t('adminOrders.products'),
            key: 'products',
            render: (record) => (
                <div>
                    <div>{record.orderItems.length} {t('adminOrders.products').toLowerCase()}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {record.orderItems[0]?.product.name}
                        {record.orderItems.length > 1 && ` +${record.orderItems.length - 1} ${t('adminOrders.others')}`}
                    </div>
                </div>
            )
        },
        {
            title: t('adminOrders.total'),
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <strong style={{ color: '#ff4d4f' }}>{formatPrice(amount)}</strong>
        },
        {
            title: t('adminOrders.orderStatus'),
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status, record) => {
                const statusInfo = getOrderStatusInfo(status)
                return (
                    <div>
                        <Tag color={statusInfo.color} icon={statusInfo.icon}>
                            {statusInfo.text}
                        </Tag>
                        <div>
                            <Select
                                size="small"
                                value={status}
                                onChange={(newStatus) => handleUpdateOrderStatus(record._id, newStatus)}
                                style={{ width: 120, marginTop: 4 }}
                            >
                                <Option value="pending">{t('adminOrders.pending')}</Option>
                                <Option value="confirmed">{t('orderTracking.confirmed')}</Option>
                                <Option value="shipping">{t('adminOrders.shipping')}</Option>
                                <Option value="delivered">{t('orderTracking.delivered')}</Option>
                                <Option value="cancelled">{t('orderTracking.cancelled')}</Option>
                            </Select>
                        </div>
                    </div>
                )
            }
        },
        {
            title: t('adminOrders.payment'),
            key: 'payment',
            render: (record) => (
                <div>
                    <Tag color={record.paymentStatus === 'paid' ? 'green' : 'orange'}>
                        {record.paymentStatus === 'paid' ? t('orderTracking.paid') : t('adminOrders.unpaid')}
                    </Tag>
                    <div>
                        <Select
                            size="small"
                            value={record.paymentStatus}
                            onChange={(paymentStatus) => handleUpdatePaymentStatus(record._id, paymentStatus)}
                            style={{ width: 120, marginTop: 4 }}
                        >
                            <Option value="unpaid">{t('adminOrders.unpaid')}</Option>
                            <Option value="paid">{t('orderTracking.paid')}</Option>
                            <Option value="refunded">{t('adminOrders.refunded')}</Option>
                        </Select>
                    </div>
                </div>
            )
        },
        {
            title: t('adminOrders.visibility'),
            key: 'visibility',
            render: (record) => (
                <div>
                    <Tag color={record.isDeletedByUser ? 'red' : 'green'}>
                        {record.isDeletedByUser ? t('adminOrders.hiddenByUser') : t('adminOrders.visibleToUser')}
                    </Tag>
                    {record.isDeletedByUser && (
                        <div style={{ marginTop: 4 }}>
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => handleRestoreOrder(record._id)}
                                style={{ fontSize: 12, height: 24 }}
                            >
                                {t('adminOrders.restore')}
                            </Button>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: t('adminOrders.orderDate'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
        },
        {
            title: t('adminOrders.actions'),
            key: 'actions',
            render: (record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedOrder(record)
                            setModalVisible(true)
                        }}
                    >
                        {t('adminOrders.view')}
                    </Button>
                    {record.orderStatus === 'cancelled' || record.orderStatus === 'delivered' ? (
                        <Popconfirm
                            title={t('adminOrders.deleteConfirm')}
                            onConfirm={() => handleDeleteOrder(record._id)}
                        >
                            <Button size="small" danger icon={<DeleteOutlined />}>
                                {t('adminOrders.delete')}
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title={t('adminOrders.cancelConfirm')}
                            onConfirm={() => handleCancelOrder(record._id)}
                        >
                            <Button size="small" danger>
                                {t('adminOrders.cancel')}
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            )
        }
    ]

    return (
        <WrapperContainer>
            <WrapperHeader>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/system/admin')}
                >
                    {t('adminOrders.backAdmin')}
                </Button>
                <h2>{t('adminOrders.title')}</h2>
            </WrapperHeader>

            <Spin spinning={loading} tip={t('adminOrders.loadingOrders')} size="large">

                {/* Statistics */}
                <WrapperStats>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title={t('adminOrders.totalOrders')}
                                    value={stats.total}
                                    prefix={<ShoppingCartOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title={t('adminOrders.pending')}
                                    value={stats.pending}
                                    valueStyle={{ color: '#fa8c16' }}
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title={t('adminOrders.shipping')}
                                    value={stats.shipping}
                                    valueStyle={{ color: '#13c2c2' }}
                                    prefix={<TruckOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title={t('adminOrders.completed')}
                                    value={stats.delivered}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title={t('adminOrders.unpaid')}
                                    value={stats.unpaidOrders}
                                    valueStyle={{ color: '#ff4d4f' }}
                                    prefix={<DollarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title={t('adminOrders.revenue')}
                                    value={stats.totalRevenue}
                                    formatter={(value) => formatPrice(value)}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<DollarOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </WrapperStats>

                {/* Filters */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <Row gutter={16} align="middle">
                        <Col flex="auto">
                            <Input
                                placeholder={t('adminOrders.searchPlaceholder')}
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Select
                                value={filterStatus}
                                onChange={setFilterStatus}
                                style={{ width: 150 }}
                                suffixIcon={<FilterOutlined />}
                            >
                                <Option value="all">{t('adminOrders.allStatuses')}</Option>
                                <Option value="pending">{t('adminOrders.pending')}</Option>
                                <Option value="confirmed">{t('orderTracking.confirmed')}</Option>
                                <Option value="shipping">{t('adminOrders.shipping')}</Option>
                                <Option value="delivered">{t('orderTracking.delivered')}</Option>
                                <Option value="cancelled">{t('orderTracking.cancelled')}</Option>
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                value={filterPayment}
                                onChange={setFilterPayment}
                                style={{ width: 150 }}
                            >
                                <Option value="all">{t('adminOrders.allPayments')}</Option>
                                <Option value="unpaid">{t('adminOrders.unpaid')}</Option>
                                <Option value="paid">{t('orderTracking.paid')}</Option>
                                <Option value="refunded">{t('adminOrders.refunded')}</Option>
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                value={filterHidden}
                                onChange={setFilterHidden}
                                style={{ width: 150 }}
                            >
                                <Option value="all">{t('adminOrders.allOrders')}</Option>
                                <Option value="visible">{t('adminOrders.visibleToUser')}</Option>
                                <Option value="hidden">{t('adminOrders.hiddenByUser')}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                {/* Orders Table */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Table
                        columns={columns}
                        dataSource={filteredOrders}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => t('adminOrders.totalWithCount', { count: total })
                        }}
                        scroll={{ x: 1200 }}
                    />
                </div>

                {/* Order Detail Modal */}
                <Modal
                    title={`${t('adminOrders.detailsTitle')} #${selectedOrder?._id?.slice(-8).toUpperCase()}`}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    {selectedOrder && (
                        <div>
                            {/* Order Info */}
                            <Card title={t('adminOrders.orderInfo')} style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <p><strong>{t('adminOrders.customerName')}</strong> {selectedOrder.shippingInfo?.fullName}</p>
                                        <p><strong>{t('adminOrders.phone')}</strong> {selectedOrder.shippingInfo?.phone}</p>
                                        <p><strong>{t('adminOrders.address')}</strong> {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.ward}, {selectedOrder.shippingInfo?.district}, {selectedOrder.shippingInfo?.province}</p>
                                        {selectedOrder.shippingInfo?.note && (
                                            <p><strong>{t('adminOrders.note')}</strong> {selectedOrder.shippingInfo.note}</p>
                                        )}
                                    </Col>
                                    <Col span={12}>
                                        <p><strong>{t('adminOrders.placedAt')}</strong> {new Date(selectedOrder.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}</p>
                                        <p><strong>{t('adminOrders.paymentMethod')}</strong> {selectedOrder.paymentMethod === 'cod' ? 'COD' : selectedOrder.paymentMethod === 'banking' ? t('adminOrders.bankTransfer') : t('adminOrders.creditCard')}</p>
                                        <p><strong>{t('adminOrders.totalAmount')}</strong> <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{formatPrice(selectedOrder.totalAmount)}</span></p>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Order Items */}
                            <Card title={t('adminOrders.items')}>
                                {selectedOrder.orderItems.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        marginBottom: 12,
                                        padding: 12,
                                        border: '1px solid #f0f0f0',
                                        borderRadius: 8
                                    }}>
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={60}
                                            height={60}
                                            style={{ borderRadius: 4 }}
                                            preview={false}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500, marginBottom: 4 }}>
                                                {item.product.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666' }}>
                                                {t('adminOrders.quantityShort')}: {item.quantity} x {formatPrice(item.product.discount || item.product.price)}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 600, color: '#ff4d4f' }}>
                                            {formatPrice((item.product.discount || item.product.price) * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    )}
                </Modal>
            </Spin>
        </WrapperContainer>
    )
}

export default AdminOrderManagement