import React, { useState, useEffect, useCallback } from 'react'
import {
    WrapperContainer,
    WrapperHeader,
    WrapperProductInfo,
    WrapperProductImage,
    WrapperEmpty,
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
    EditOutlined,
    DollarOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import socketService from '../../service/SocketService'
import { updateOrderStatus, updatePaymentStatus, cancelOrder, deleteOrderPermanently, syncOrdersFromAPI, restoreOrderForUser, clearOrders } from '../../redux/slides/orderSlice'
import { message } from 'antd'
import * as OrderService from '../../service/OrderService'

const { Option } = Select

const AdminOrderManagement = () => {
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
                message.error('Lỗi khi tải danh sách đơn hàng')
            } finally {
                setTimeout(() => setLoading(false), 100)
            }
        } else {
            setLoading(false)
        }
    }, [user?.access_token, user?.isAdmin, dispatch])

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

    // Format price function
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Get order status info
    const getOrderStatusInfo = (status) => {
        const statusMap = {
            'pending': { color: 'orange', text: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
            'confirmed': { color: 'blue', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
            'shipping': { color: 'cyan', text: 'Đang giao hàng', icon: <TruckOutlined /> },
            'delivered': { color: 'green', text: 'Đã giao hàng', icon: <CheckCircleOutlined /> },
            'cancelled': { color: 'red', text: 'Đã hủy', icon: <DeleteOutlined /> }
        }
        return statusMap[status] || statusMap['pending']
    }

    // Handle update order status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            console.log('Updating order status:', { orderId, newStatus, token: user?.access_token })

            if (!user?.access_token) {
                message.error('Không có quyền truy cập. Vui lòng đăng nhập lại!')
                return
            }

            if (!user?.isAdmin) {
                message.error('Chỉ admin mới có quyền cập nhật trạng thái đơn hàng!')
                return
            }

            // Tìm trạng thái hiện tại để có thể revert nếu cần
            const currentOrder = orders.find(order => order._id === orderId)
            const oldStatus = currentOrder?.orderStatus

            // Optimistic update: Update UI ngay lập tức
            dispatch(updateOrderStatus({ orderId, status: newStatus }))
            message.success('Đã cập nhật trạng thái đơn hàng!')

            // Sau đó gọi API để sync với server
            const response = await OrderService.updateOrderStatus(orderId, newStatus, user.access_token)
            console.log('API response:', response)

            if (response?.status !== 'OK') {
                // Nếu API thất bại, revert lại trạng thái cũ
                if (oldStatus) {
                    dispatch(updateOrderStatus({ orderId, status: oldStatus }))
                }
                throw new Error(response?.message || 'Phản hồi API không hợp lệ')
            } else {
                // Broadcast update đến các tab khác bằng BroadcastChannel
                const channel = new BroadcastChannel('orderUpdates')
                channel.postMessage({
                    type: 'ORDER_STATUS_UPDATE',
                    orderId,
                    newStatus,
                    timestamp: Date.now()
                })
                channel.close()

                // Backup với localStorage cho browser cũ
                localStorage.setItem('orderUpdate', JSON.stringify({
                    type: 'ORDER_STATUS_UPDATE',
                    orderId,
                    newStatus,
                    timestamp: Date.now()
                }))
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định'
            message.error('Lỗi khi cập nhật trạng thái: ' + errorMessage)
        }
    }

    // Handle update payment status
    const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
        try {
            console.log('Updating payment status:', { orderId, paymentStatus, token: user?.access_token })

            if (!user?.access_token) {
                message.error('Không có quyền truy cập. Vui lòng đăng nhập lại!')
                return
            }

            if (!user?.isAdmin) {
                message.error('Chỉ admin mới có quyền cập nhật trạng thái thanh toán!')
                return
            }

            // Tìm trạng thái hiện tại để có thể revert nếu cần
            const currentOrder = orders.find(order => order._id === orderId)
            const oldPaymentStatus = currentOrder?.paymentStatus

            // Optimistic update: Update UI ngay lập tức
            dispatch(updatePaymentStatus({ orderId, paymentStatus }))
            message.success('Đã cập nhật trạng thái thanh toán!')

            // Sau đó gọi API để sync với server
            const response = await OrderService.updatePaymentStatus(orderId, paymentStatus, user.access_token)
            console.log('API response:', response)

            if (response?.status !== 'OK') {
                // Nếu API thất bại, revert lại trạng thái cũ
                if (oldPaymentStatus) {
                    dispatch(updatePaymentStatus({ orderId, paymentStatus: oldPaymentStatus }))
                }
                throw new Error(response?.message || 'Phản hồi API không hợp lệ')
            } else {
                // Broadcast update đến các tab khác bằng BroadcastChannel
                const channel = new BroadcastChannel('orderUpdates')
                channel.postMessage({
                    type: 'PAYMENT_STATUS_UPDATE',
                    orderId,
                    paymentStatus,
                    timestamp: Date.now()
                })
                channel.close()

                // Backup với localStorage cho browser cũ
                localStorage.setItem('orderUpdate', JSON.stringify({
                    type: 'PAYMENT_STATUS_UPDATE',
                    orderId,
                    paymentStatus,
                    timestamp: Date.now()
                }))
            }
        } catch (error) {
            console.error('Error updating payment status:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định'
            message.error('Lỗi khi cập nhật thanh toán: ' + errorMessage)
        }
    }

    // Handle restore order for user (admin only)
    const handleRestoreOrder = async (orderId) => {
        try {
            console.log('Restoring order:', { orderId, token: user?.access_token })

            if (!user?.access_token) {
                message.error('Không có quyền truy cập. Vui lòng đăng nhập lại!')
                return
            }

            if (!user?.isAdmin) {
                message.error('Chỉ admin mới có quyền khôi phục đơn hàng!')
                return
            }

            const response = await OrderService.restoreOrderForUser(orderId, user.access_token)
            console.log('API response:', response)

            if (response?.status === 'OK') {
                dispatch(restoreOrderForUser({ orderId }))
                message.success('Đã khôi phục đơn hàng cho user!')
                // Không cần reload, Redux đã update UI ngay lập tức
            } else {
                throw new Error(response?.message || 'Phản hồi API không hợp lệ')
            }
        } catch (error) {
            console.error('Error restoring order:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định'
            message.error('Lỗi khi khôi phục đơn hàng: ' + errorMessage)
        }
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

    // Handle permanent delete order (admin only)
    const handleDeleteOrder = (orderId) => {
        dispatch(deleteOrderPermanently({ orderId }))
        message.success('Đã xóa vĩnh viễn đơn hàng!')
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
            title: 'Mã đơn hàng',
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
            title: 'Khách hàng',
            key: 'customer',
            render: (record) => (
                <div>
                    <div>{record.shippingInfo?.fullName || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{record.shippingInfo?.phone}</div>
                </div>
            )
        },
        {
            title: 'Sản phẩm',
            key: 'products',
            render: (record) => (
                <div>
                    <div>{record.orderItems.length} sản phẩm</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {record.orderItems[0]?.product.name}
                        {record.orderItems.length > 1 && ` +${record.orderItems.length - 1} khác`}
                    </div>
                </div>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <strong style={{ color: '#ff4d4f' }}>{formatPrice(amount)}</strong>
        },
        {
            title: 'Trạng thái đơn hàng',
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
                                <Option value="pending">Chờ xác nhận</Option>
                                <Option value="confirmed">Đã xác nhận</Option>
                                <Option value="shipping">Đang giao</Option>
                                <Option value="delivered">Đã giao</Option>
                                <Option value="cancelled">Đã hủy</Option>
                            </Select>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Thanh toán',
            key: 'payment',
            render: (record) => (
                <div>
                    <Tag color={record.paymentStatus === 'paid' ? 'green' : 'orange'}>
                        {record.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Tag>
                    <div>
                        <Select
                            size="small"
                            value={record.paymentStatus}
                            onChange={(paymentStatus) => handleUpdatePaymentStatus(record._id, paymentStatus)}
                            style={{ width: 120, marginTop: 4 }}
                        >
                            <Option value="unpaid">Chưa thanh toán</Option>
                            <Option value="paid">Đã thanh toán</Option>
                            <Option value="refunded">Đã hoàn tiền</Option>
                        </Select>
                    </div>
                </div>
            )
        },
        {
            title: 'Trạng thái hiển thị',
            key: 'visibility',
            render: (record) => (
                <div>
                    <Tag color={record.isDeletedByUser ? 'red' : 'green'}>
                        {record.isDeletedByUser ? 'Đã ẩn bởi user' : 'Hiển thị với user'}
                    </Tag>
                    {record.isDeletedByUser && (
                        <div style={{ marginTop: 4 }}>
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => handleRestoreOrder(record._id)}
                                style={{ fontSize: 12, height: 24 }}
                            >
                                Khôi phục
                            </Button>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Thao tác',
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
                        Xem
                    </Button>
                    {record.orderStatus === 'cancelled' || record.orderStatus === 'delivered' ? (
                        <Popconfirm
                            title="Xóa đơn hàng này?"
                            onConfirm={() => handleDeleteOrder(record._id)}
                        >
                            <Button size="small" danger icon={<DeleteOutlined />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title="Hủy đơn hàng này?"
                            onConfirm={() => handleCancelOrder(record._id)}
                        >
                            <Button size="small" danger>
                                Hủy
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
                    Quay lại Admin
                </Button>
                <h2>Quản lý đơn hàng</h2>
            </WrapperHeader>

            <Spin spinning={loading} tip="Đang tải đơn hàng..." size="large">

                {/* Statistics */}
                <WrapperStats>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Tổng đơn hàng"
                                    value={stats.total}
                                    prefix={<ShoppingCartOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Chờ xác nhận"
                                    value={stats.pending}
                                    valueStyle={{ color: '#fa8c16' }}
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Đang giao hàng"
                                    value={stats.shipping}
                                    valueStyle={{ color: '#13c2c2' }}
                                    prefix={<TruckOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Hoàn thành"
                                    value={stats.delivered}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Chưa thanh toán"
                                    value={stats.unpaidOrders}
                                    valueStyle={{ color: '#ff4d4f' }}
                                    prefix={<DollarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Doanh thu"
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
                                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, tên sản phẩm..."
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
                                <Option value="all">Tất cả trạng thái</Option>
                                <Option value="pending">Chờ xác nhận</Option>
                                <Option value="confirmed">Đã xác nhận</Option>
                                <Option value="shipping">Đang giao hàng</Option>
                                <Option value="delivered">Đã giao hàng</Option>
                                <Option value="cancelled">Đã hủy</Option>
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                value={filterPayment}
                                onChange={setFilterPayment}
                                style={{ width: 150 }}
                            >
                                <Option value="all">Tất cả thanh toán</Option>
                                <Option value="unpaid">Chưa thanh toán</Option>
                                <Option value="paid">Đã thanh toán</Option>
                                <Option value="refunded">Đã hoàn tiền</Option>
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                value={filterHidden}
                                onChange={setFilterHidden}
                                style={{ width: 150 }}
                            >
                                <Option value="all">Tất cả đơn hàng</Option>
                                <Option value="visible">Hiển thị với user</Option>
                                <Option value="hidden">Đã ẩn bởi user</Option>
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
                            showTotal: (total) => `Tổng ${total} đơn hàng`
                        }}
                        scroll={{ x: 1200 }}
                    />
                </div>

                {/* Order Detail Modal */}
                <Modal
                    title={`Chi tiết đơn hàng #${selectedOrder?._id?.slice(-8).toUpperCase()}`}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    {selectedOrder && (
                        <div>
                            {/* Order Info */}
                            <Card title="Thông tin đơn hàng" style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <p><strong>Khách hàng:</strong> {selectedOrder.shippingInfo?.fullName}</p>
                                        <p><strong>Số điện thoại:</strong> {selectedOrder.shippingInfo?.phone}</p>
                                        <p><strong>Địa chỉ:</strong> {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.ward}, {selectedOrder.shippingInfo?.district}, {selectedOrder.shippingInfo?.province}</p>
                                        {selectedOrder.shippingInfo?.note && (
                                            <p><strong>Ghi chú:</strong> {selectedOrder.shippingInfo.note}</p>
                                        )}
                                    </Col>
                                    <Col span={12}>
                                        <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                                        <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod === 'cod' ? 'COD' : selectedOrder.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Thẻ tín dụng'}</p>
                                        <p><strong>Tổng tiền:</strong> <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{formatPrice(selectedOrder.totalAmount)}</span></p>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Order Items */}
                            <Card title="Sản phẩm">
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
                                                SL: {item.quantity} x {formatPrice(item.product.discount || item.product.price)}
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