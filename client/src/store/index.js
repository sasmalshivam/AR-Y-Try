import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice.js';
import cartReducer from './slices/cartSlice.js';
import authReducer from './slices/authSlice.js';

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

export default store;
