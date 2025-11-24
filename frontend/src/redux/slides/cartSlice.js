import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems: [], // [{product, quantity}]
    totalQuantity: 0,
    totalAmount: 0,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload
            const existingItem = state.cartItems.find(item => item.product._id === product._id)

            if (existingItem) {
                existingItem.quantity += quantity
            } else {
                state.cartItems.push({ product, quantity })
            }

            // Cập nhật tổng số lượng và tổng tiền
            state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
            state.totalAmount = state.cartItems.reduce((total, item) => {
                const price = item.product.discount || item.product.price
                return total + (price * item.quantity)
            }, 0)
        },

        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload
            const item = state.cartItems.find(item => item.product._id === productId)

            if (item && quantity > 0) {
                item.quantity = quantity
            }

            // Cập nhật tổng số lượng và tổng tiền
            state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
            state.totalAmount = state.cartItems.reduce((total, item) => {
                const price = item.product.discount || item.product.price
                return total + (price * item.quantity)
            }, 0)
        },

        removeFromCart: (state, action) => {
            const { productId } = action.payload
            state.cartItems = state.cartItems.filter(item => item.product._id !== productId)

            // Cập nhật tổng số lượng và tổng tiền
            state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0)
            state.totalAmount = state.cartItems.reduce((total, item) => {
                const price = item.product.discount || item.product.price
                return total + (price * item.quantity)
            }, 0)
        },

        clearCart: (state) => {
            state.cartItems = []
            state.totalQuantity = 0
            state.totalAmount = 0
        }
    },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions

export default cartSlice.reducer