import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_URL from '../../config/api';

// Thunks
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/products`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails', async (id, { rejectWithValue }) => {
  try {
    // Local static catalogue items use numeric IDs, not MongoDB ObjectIds.
    // Prevent backend crashes by skipping invalid IDs and letting the page render the fallback product.
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return null;
    }

    const { data } = await axios.get(`${API_URL}/api/products/${id}`);
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
