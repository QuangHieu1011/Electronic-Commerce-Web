import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    recentlyViewed: [], // Max 10 products
}

export const recentlyViewedSlice = createSlice({
    name: 'recentlyViewed',
    initialState,
    reducers: {
        addToRecentlyViewed: (state, action) => {
            const product = action.payload
            
            // Remove if already exists
            state.recentlyViewed = state.recentlyViewed.filter(item => item._id !== product._id)
            
            // Add to beginning
            state.recentlyViewed.unshift(product)
            
            // Keep only last 10
            if (state.recentlyViewed.length > 10) {
                state.recentlyViewed = state.recentlyViewed.slice(0, 10)
            }
            
            // Save to localStorage
            localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed))
        },
        clearRecentlyViewed: (state) => {
            state.recentlyViewed = []
            localStorage.removeItem('recentlyViewed')
        },
        loadRecentlyViewed: (state) => {
            const saved = localStorage.getItem('recentlyViewed')
            if (saved) {
                state.recentlyViewed = JSON.parse(saved)
            }
        }
    },
})

export const { addToRecentlyViewed, clearRecentlyViewed, loadRecentlyViewed } = recentlyViewedSlice.actions

export default recentlyViewedSlice.reducer
