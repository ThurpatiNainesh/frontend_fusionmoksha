import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fusionmokshabackend-production.up.railway.app/api/cart';

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

// Set up axios defaults
const setupAxiosAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data?.message || error.message;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An error occurred';
  }
};

// Async thunks
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      setupAxiosAuth();
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, weight, quantity }, { rejectWithValue }) => {
    try {
      setupAxiosAuth();
      const response = await axios.post(API_URL, { productId, weight, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ itemId, change }, { rejectWithValue, dispatch }) => {
    try {
      setupAxiosAuth();
      
      // If change is -1, we need to check current quantity first
      if (change === -1) {
        // Get current cart items to find the current quantity
        const cartResponse = await axios.get(API_URL);
        const currentItem = cartResponse.data.find(item => item._id === itemId);
        
        if (currentItem && currentItem.quantity === 1) {
          // If quantity would become 0, remove the item
          await dispatch(removeFromCart(itemId));
          return { _id: itemId, removed: true };
        }
      }
      
      // Otherwise, update the quantity
      const response = await axios.put(`${API_URL}/${itemId}`, { change });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      setupAxiosAuth();
      await axios.delete(`${API_URL}/${itemId}`);
      return itemId; // Return the ID of the removed item
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: false,
    updatingItems: {}, // Track which items are being updated
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.updatingItems = {};
    },
    resetCartStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    // Optimistically update quantity in the UI
    updateItemQuantityOptimistic: (state, action) => {
      const { itemId, change } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === itemId);
      
      if (itemIndex !== -1) {
        // Store the current quantity before updating
        if (!state.updatingItems[itemId]) {
          state.updatingItems[itemId] = {
            originalQuantity: state.items[itemIndex].quantity,
            isUpdating: true
          };
        }
        
        // Update the quantity optimistically
        state.items[itemIndex].quantity += change;
      }
    },
    // Revert optimistic update if API call fails
    revertItemQuantity: (state, action) => {
      const { itemId } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === itemId);
      
      if (itemIndex !== -1 && state.updatingItems[itemId]) {
        // Revert to the original quantity
        state.items[itemIndex].quantity = state.updatingItems[itemId].originalQuantity;
        delete state.updatingItems[itemId];
      }
    },
    // Clear the updating flag after successful API call
    completeItemUpdate: (state, action) => {
      const { itemId } = action.payload;
      if (state.updatingItems[itemId]) {
        delete state.updatingItems[itemId];
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch cart items
    builder.addCase(fetchCartItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCartItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add to cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      
      // Check if item already exists in cart with same product ID and weight
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.productId === action.payload.productId && 
          item.weight.value === action.payload.weight.value &&
          item.weight.unit === action.payload.weight.unit
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // Add new item to cart
        state.items.push(action.payload);
      }
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Update cart item quantity
    builder.addCase(updateCartItemQuantity.pending, (state, action) => {
      const { itemId } = action.meta.arg;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const updatedItem = action.payload;
      const index = state.items.findIndex(item => item._id === updatedItem._id);
      
      if (index !== -1) {
        // Only update the item if it's still in the cart
        state.items[index] = updatedItem;
      }
      
      // Clear the updating flag for this item
      if (state.updatingItems[updatedItem._id]) {
        delete state.updatingItems[updatedItem._id];
      }
    });
    builder.addCase(updateCartItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update cart item';
      
      // Revert the optimistic update
      const { itemId } = action.meta.arg;
      if (state.updatingItems[itemId]) {
        const itemIndex = state.items.findIndex(item => item._id === itemId);
        if (itemIndex !== -1) {
          state.items[itemIndex].quantity = state.updatingItems[itemId].originalQuantity;
          delete state.updatingItems[itemId];
        }
      }
    });

    // Remove from cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.items = state.items.filter(item => item._id !== action.payload);
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { 
  clearCart, 
  resetCartStatus, 
  updateItemQuantityOptimistic, 
  revertItemQuantity 
} = cartSlice.actions;
export default cartSlice.reducer;
