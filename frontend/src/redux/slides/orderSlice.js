import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orders: [], // Danh sách đơn hàng đã đặt
    orderHistory: [], // Lịch sử đơn hàng
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // Tạo đơn hàng mới từ cart
        createOrder: (state, action) => {
            const { orderItems, userInfo, totalAmount, shippingInfo, paymentMethod } = action.payload
            const newOrder = {
                _id: Date.now().toString(), // Tạm thời dùng timestamp làm ID
                orderItems: orderItems,
                userInfo: userInfo || {},
                userId: userInfo?.id || userInfo?._id || 'guest', // Thêm userId để filter
                shippingInfo: shippingInfo || {},
                totalAmount: totalAmount,
                paymentMethod: paymentMethod || 'cod',
                orderStatus: 'pending', // pending, confirmed, shipping, delivered, cancelled
                paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid', // unpaid, paid, refunded
                isDeletedByUser: false, // Thêm trường để đánh dấu user đã "xóa"
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            state.orders.push(newOrder)
        },

        // Cập nhật trạng thái đơn hàng
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload
            const order = state.orders.find(order => order._id === orderId)
            if (order) {
                order.orderStatus = status
                order.updatedAt = new Date().toISOString()
            }
        },

        // Cập nhật trạng thái thanh toán
        updatePaymentStatus: (state, action) => {
            const { orderId, paymentStatus } = action.payload
            const order = state.orders.find(order => order._id === orderId)
            if (order) {
                order.paymentStatus = paymentStatus
                order.updatedAt = new Date().toISOString()
            }
        },

        // Hủy đơn hàng
        cancelOrder: (state, action) => {
            const { orderId } = action.payload
            const order = state.orders.find(order => order._id === orderId)
            if (order) {
                order.orderStatus = 'cancelled'
                order.updatedAt = new Date().toISOString()
            }
        },

        // Ẩn đơn hàng khỏi user (không xóa thật)
        hideOrderFromUser: (state, action) => {
            const { orderId } = action.payload
            const order = state.orders.find(order => order._id === orderId)
            if (order) {
                order.isDeletedByUser = true
                order.updatedAt = new Date().toISOString()
            }
        },

        // Khôi phục đơn hàng cho user (admin only)
        restoreOrderForUser: (state, action) => {
            const { orderId } = action.payload
            const order = state.orders.find(order => order._id === orderId)
            if (order) {
                order.isDeletedByUser = false
                order.updatedAt = new Date().toISOString()
            }
        },

        // Xóa đơn hàng thật (chỉ dành cho admin)
        deleteOrderPermanently: (state, action) => {
            const { orderId } = action.payload
            state.orders = state.orders.filter(order => order._id !== orderId)
        },

        // Chuyển đơn hàng vào lịch sử
        moveToHistory: (state, action) => {
            const { orderId } = action.payload
            const orderIndex = state.orders.findIndex(order => order._id === orderId)
            if (orderIndex !== -1) {
                const order = state.orders[orderIndex]
                state.orderHistory.push(order)
                state.orders.splice(orderIndex, 1)
            }
        },

        // Xóa tất cả đơn hàng
        clearOrders: (state) => {
            state.orders = []
        },

        // Sync orders từ API
        syncOrdersFromAPI: (state, action) => {
            state.orders = action.payload
        }
    },
})

export const {
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    hideOrderFromUser,
    restoreOrderForUser,
    deleteOrderPermanently,
    moveToHistory,
    clearOrders,
    syncOrdersFromAPI
} = orderSlice.actions

export default orderSlice.reducer