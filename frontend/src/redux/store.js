import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from '@reduxjs/toolkit'

import productReducer from './slides/productSlide'
import userReducer from './slides/userSlide'
import cartReducer from './slides/cartSlice'
import orderReducer from './slides/orderSlice'

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'order'] // Chỉ persist cart và order, không persist user và product
}

// Combine reducers
const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  cart: cartReducer,
  order: orderReducer
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