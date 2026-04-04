import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cartItemsFromStorage,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      console.log('--- CART ADD LOG ---');
      console.log('Action payload:', item);
      console.log('Current cart items:', state.cartItems.map(i => i.product));
      
      const existItem = state.cartItems.find((x) => String(x.product) === String(item.product));

      if (existItem) {
        existItem.qty += item.qty;
        console.log('MATCHED! Updated existing item quantity:', existItem.qty);
      } else {
        state.cartItems = [...state.cartItems, item];
        console.log('NO MATCH! Added new item, total items now:', state.cartItems.length);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      console.log('Saved to localStorage successfully');
      console.log('--------------------');
    },
    updateCartQty: (state, action) => {
      const { product, qty } = action.payload;
      const existItem = state.cartItems.find((x) => x.product === product);
      if (existItem) {
        existItem.qty = qty;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
  },
});

export const { addToCart, updateCartQty, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
