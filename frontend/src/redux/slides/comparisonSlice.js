import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    comparisonItems: [], // Max 3 products
}

export const comparisonSlice = createSlice({
    name: 'comparison',
    initialState,
    reducers: {
        addToComparison: (state, action) => {
            const product = action.payload
            const exists = state.comparisonItems.find(item => item._id === product._id)
            
            if (!exists && state.comparisonItems.length < 3) {
                state.comparisonItems.push(product)
                // Save to localStorage
                localStorage.setItem('comparison', JSON.stringify(state.comparisonItems))
            }
        },
        removeFromComparison: (state, action) => {
            const productId = action.payload
            state.comparisonItems = state.comparisonItems.filter(item => item._id !== productId)
            // Update localStorage
            localStorage.setItem('comparison', JSON.stringify(state.comparisonItems))
        },
        clearComparison: (state) => {
            state.comparisonItems = []
            localStorage.removeItem('comparison')
        },
        loadComparison: (state) => {
            const saved = localStorage.getItem('comparison')
            if (saved) {
                state.comparisonItems = JSON.parse(saved)
            }
        }
    },
})

export const { addToComparison, removeFromComparison, clearComparison, loadComparison } = comparisonSlice.actions

export default comparisonSlice.reducer
