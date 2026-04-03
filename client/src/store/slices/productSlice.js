import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/products');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    productDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Fetch product details
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.productDetails = action.payload;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default productSlice.reducer;
