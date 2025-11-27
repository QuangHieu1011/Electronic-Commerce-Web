import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from '@reduxjs/toolkit'

import productReducer from './slides/productSlide'
import userReducer from './slides/userSlide'
import cartReducer from './slides/cartSlice'
import orderReducer from './slides/orderSlice'
import comparisonReducer from './slides/comparisonSlice'
import wishlistReducer from './slides/wishlistSlice'
import recentlyViewedReducer from './slides/recentlyViewedSlice'

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'] // Chỉ persist cart, không persist user, product và order để tránh conflict giữa admin/user
}

// Combine reducers
const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  cart: cartReducer,
  order: orderReducer,
  comparison: comparisonReducer,
  wishlist: wishlistReducer,
  recentlyViewed: recentlyViewedReducer
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/FLUSH', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PERSIST', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
})

export const persistor = persistStore(store)