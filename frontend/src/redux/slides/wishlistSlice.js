import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    wishlistItems: [],
}

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const product = action.payload
            const exists = state.wishlistItems.find(item => item._id === product._id)
            
            if (!exists) {
                state.wishlistItems.push(product)
                localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems))
            }
        },
        removeFromWishlist: (state, action) => {
            const productId = action.payload
            state.wishlistItems = state.wishlistItems.filter(item => item._id !== productId)
            localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems))
        },
        clearWishlist: (state) => {
            state.wishlistItems = []
            localStorage.removeItem('wishlist')
        },
        loadWishlist: (state) => {
            const saved = localStorage.getItem('wishlist')
            if (saved) {
                state.wishlistItems = JSON.parse(saved)
            }
        }
    },
})

export const { addToWishlist, removeFromWishlist, clearWishlist, loadWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
