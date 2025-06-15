import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, searchProducts, fetchProduct, fetchTopProducts } from '../services/api';

const initialState = {
  products: [],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    category: '',
    priceRange: { min: 0, max: 10000 },
    rating: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
};

export const getProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetchProducts(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetchProduct(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTopProducts = createAsyncThunk(
  'products/fetchTop',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTopProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    // Get Products
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = {
        currentPage: action.payload.page,
        totalPages: action.payload.pages,
        totalItems: action.payload.total,
        itemsPerPage: action.payload.limit
      };
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch products';
    });

    // Get Top Products
    builder.addCase(getTopProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTopProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.topProducts = action.payload;
    });
    builder.addCase(getTopProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch top products';
    });

    // Get Single Product
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch product details';
    });
  },
});

export const { setSearchQuery, setFilters, setPagination, clearFilters } = productSlice.actions;
export default productSlice.reducer;
