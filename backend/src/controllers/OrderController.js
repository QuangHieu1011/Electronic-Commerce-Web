const Order = require('../models/OrderProduct')

const createOrder = async (req, res) => {
    try {
        const orderData = req.body
        const userId = req.user?.id

        console.log('=== CREATE ORDER REQUEST ===')
        console.log('User ID:', userId)
        console.log('Order data:', orderData)

        // Tạo order với user ID
        const newOrderData = {
            ...orderData,
            user: userId,
            userInfo: {
                id: userId,
                name: orderData.userInfo?.name,
                email: orderData.userInfo?.email
            }
        }

        const order = new Order(newOrderData)
        const savedOrder = await order.save()

        console.log('Created order:', savedOrder)

        return res.status(200).json({
            status: 'OK',
            message: 'Đặt hàng thành công',
            data: savedOrder
        })
    } catch (e) {
        console.error('Create order error:', e)
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi tạo đơn hàng',
            error: e.message
        })
    }
}

const getAllOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.id
        const orders = await Order.find({
            user: userId,
            isDeletedByUser: false
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            status: 'OK',
            message: 'Lấy danh sách đơn hàng thành công',
            data: orders
        })
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi lấy đơn hàng',
            error: e.message
        })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 })

        return res.status(200).json({
            status: 'OK',
            message: 'Lấy danh sách tất cả đơn hàng thành công',
            data: orders
        })
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi lấy danh sách đơn hàng',
            error: e.message
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id
        const { orderStatus } = req.body

        console.log('=== UPDATE ORDER STATUS REQUEST ===')
        console.log('Order ID:', orderId)
        console.log('New Status:', orderStatus)
        console.log('User:', req.user)

        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        )

        console.log('Updated order:', order)

        if (!order) {
            console.log('Order not found')
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy đơn hàng'
            })
        }

        // Emit socket event for real-time update
        const io = req.app.get('io')
        if (io) {
            io.emit('orderStatusUpdate', {
                orderId: order._id,
                newStatus: orderStatus,
                order: order
            })
            console.log('Socket event emitted: orderStatusUpdate')
        }

        console.log('Update successful')
        return res.status(200).json({
            status: 'OK',
            message: 'Cập nhật trạng thái đơn hàng thành công',
            data: order
        })
    } catch (e) {
        console.error('Update order status error:', e)
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi cập nhật trạng thái',
            error: e.message
        })
    }
}

const updatePaymentStatus = async (req, res) => {
    try {
        const orderId = req.params.id
        const { paymentStatus } = req.body

        console.log('=== UPDATE PAYMENT STATUS REQUEST ===')
        console.log('Order ID:', orderId)
        console.log('New Payment Status:', paymentStatus)
        console.log('User:', req.user)

        const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy đơn hàng'
            })
        }

        // Emit socket event for real-time update
        const io = req.app.get('io')
        if (io) {
            io.emit('paymentStatusUpdate', {
                orderId: order._id,
                paymentStatus: paymentStatus,
                order: order
            })
            console.log('Socket event emitted: paymentStatusUpdate')
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Cập nhật trạng thái thanh toán thành công',
            data: order
        })
    } catch (e) {
        console.error('Update payment status error:', e)
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi cập nhật thanh toán',
            error: e.message
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        const userId = req.user?.id

        // Tìm đơn hàng và kiểm tra quyền
        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy đơn hàng'
            })
        }

        // Kiểm tra quyền hủy đơn
        if (order.user.toString() !== userId && !req.user?.isAdmin) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Không có quyền hủy đơn hàng này'
            })
        }

        // Kiểm tra trạng thái đơn hàng - không cho phép hủy nếu đã xác nhận
        if (order.orderStatus === 'confirmed' || order.orderStatus === 'shipping' || order.orderStatus === 'delivered') {
            return res.status(400).json({
                status: 'ERR',
                message: 'Không thể hủy đơn hàng đã được xác nhận hoặc đang giao'
            })
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: 'cancelled' },
            { new: true }
        )

        return res.status(200).json({
            status: 'OK',
            message: 'Hủy đơn hàng thành công',
            data: updatedOrder
        })
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi hủy đơn hàng',
            error: e.message
        })
    }
}

const hideOrderFromUser = async (req, res) => {
    try {
        const orderId = req.params.id
        const userId = req.user?.id

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy đơn hàng'
            })
        }

        // Chỉ user sở hữu đơn hàng mới có thể ẩn
        if (order.user.toString() !== userId) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Không có quyền thao tác với đơn hàng này'
            })
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { isDeletedByUser: true },
            { new: true }
        )

        return res.status(200).json({
            status: 'OK',
            message: 'Ẩn đơn hàng thành công',
            data: updatedOrder
        })
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi ẩn đơn hàng',
            error: e.message
        })
    }
}

const restoreOrderForUser = async (req, res) => {
    try {
        const orderId = req.params.id

        console.log('=== RESTORE ORDER REQUEST ===')
        console.log('Order ID:', orderId)
        console.log('Admin User:', req.user)

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy đơn hàng'
            })
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { isDeletedByUser: false },
            { new: true }
        )

        console.log('Restored order:', updatedOrder)

        return res.status(200).json({
            status: 'OK',
            message: 'Khôi phục đơn hàng thành công',
            data: updatedOrder
        })
    } catch (e) {
        console.error('Restore order error:', e)
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi khôi phục đơn hàng',
            error: e.message
        })
    }
}

const reorderItems = async (req, res) => {
    try {
        const orderId = req.params.id
        const userId = req.user?.id

        console.log('=== REORDER REQUEST ===')
        console.log('Order ID:', orderId)
        console.log('User ID:', userId)

        // Tìm đơn hàng gốc
        const originalOrder = await Order.findById(orderId)

        if (!originalOrder) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Không tìm thấy đơn hàng gốc'
            })
        }

        // Kiểm tra quyền truy cập
        if (originalOrder.user.toString() !== userId) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Không có quyền truy cập đơn hàng này'
            })
        }

        // Tạo đơn hàng mới dựa trên đơn hàng cũ
        const newOrderData = {
            orderItems: originalOrder.orderItems,
            shippingInfo: originalOrder.shippingInfo,
            userInfo: originalOrder.userInfo,
            paymentMethod: originalOrder.paymentMethod,
            totalAmount: originalOrder.totalAmount,
            user: userId,
            orderStatus: 'pending',
            paymentStatus: 'unpaid',
            isDeletedByUser: false
        }

        const newOrder = new Order(newOrderData)
        const savedOrder = await newOrder.save()

        console.log('Created reorder:', savedOrder)

        return res.status(200).json({
            status: 'OK',
            message: 'Đặt lại đơn hàng thành công',
            data: savedOrder
        })
    } catch (e) {
        console.error('Reorder error:', e)
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi đặt lại đơn hàng',
            error: e.message
        })
    }
}

module.exports = {
    createOrder,
    getAllOrdersByUser,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    hideOrderFromUser,
    restoreOrderForUser,
    reorderItems
}
