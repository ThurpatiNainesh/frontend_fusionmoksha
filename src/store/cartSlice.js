import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://fusionmokshabackend-production.up.railway.app/api/cart';
const GUEST_CART_KEY = 'fusionmoksha_guest_cart';
const AUTH_USER_CART_KEY = 'fusionmoksha_auth_cart';

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

// Helper function to save authenticated user's cart in localStorage
const saveAuthUserCart = (cartItems) => {
  try {
    localStorage.setItem(AUTH_USER_CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving authenticated user cart:', error);
  }
};

// Helper function to transform API cart data into a hashed format for efficient lookup
const transformCartDataForStorage = (cartItems) => {
  if (!Array.isArray(cartItems)) return [];
  
  return cartItems.map(item => {
    // Extract the product ID from the productId object or use directly if it's a string
    const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
    
    return {
      productId: productId,
      weight: item.weight,
      quantity: item.quantity,
      // Keep additional data that might be needed for display
      price: item.price,
      image: item.image || (item.productId?.mainImage || ''),
      name: item.productId?.name || '',
      _id: item._id
    };
  });
};

// Helper function to initialize cart from backend API response
export const initializeCartFromBackend = createAsyncThunk(
  'cart/initializeCartFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      // Set up authentication if user is logged in
      setupAxiosAuth();
      
      // Fetch cart data from backend
      const response = await axios.get(API_URL);
      const cartItems = response.data;
      
      // Transform and save to localStorage for efficient lookup
      if (Array.isArray(cartItems)) {
        const transformedCart = transformCartDataForStorage(cartItems);
        localStorage.setItem(AUTH_USER_CART_KEY, JSON.stringify(transformedCart));
        console.log('Cart initialized from backend, transformed and saved to localStorage');
      }
      
      return cartItems; // Return original data for Redux store
    } catch (error) {
      console.error('Error initializing cart from backend:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Helper function to get authenticated user's cart from localStorage
const getAuthUserCart = () => {
  try {
    const authUserCartJSON = localStorage.getItem(AUTH_USER_CART_KEY);
    return authUserCartJSON ? JSON.parse(authUserCartJSON) : [];
  } catch (error) {
    console.error('Error getting authenticated user cart:', error);
    return [];
  }
};

// Async thunks
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const isAuthenticated = auth.isAuthenticated;
      
      // Set up authentication if user is logged in
      setupAxiosAuth();
      
      // For both authenticated and guest users, fetch from API
      // The backend API handles both cases with the optionalAuth middleware
      const response = await axios.get('https://fusionmokshabackend-production.up.railway.app/api/cart');
      const cartItems = response.data;
      
      // Transform and store cart data in localStorage for real-time access
      if (Array.isArray(cartItems)) {
        const transformedCart = transformCartDataForStorage(cartItems);
        if (isAuthenticated) {
          localStorage.setItem(AUTH_USER_CART_KEY, JSON.stringify(transformedCart));
        } else {
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(transformedCart));
        }
        console.log('Cart data fetched, transformed and stored in localStorage');
      }
      
      return cartItems;
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
      const response = await axios.post('https://fusionmokshabackend-production.up.railway.app/api/cart', { productId, weight, quantity });
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
        const cartResponse = await axios.get('https://fusionmokshabackend-production.up.railway.app/api/cart');
        const currentItem = cartResponse.data.find(item => item._id === itemId);
        
        if (currentItem && currentItem.quantity === 1) {
          // If quantity would become 0, remove the item
          await dispatch(removeFromCart(itemId));
          return { _id: itemId, removed: true };
        }
      }
      
      // Otherwise, update the quantity
      const response = await axios.put(`https://fusionmokshabackend-production.up.railway.app/api/cart/${itemId}`, { change });
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
      await axios.delete(`https://fusionmokshabackend-production.up.railway.app/api/cart/${itemId}`);
      return itemId; // Return the ID of the removed item
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Merge guest cart with user cart after login
// Update cart quantity API thunk
export const updateCartQuantityApi = createAsyncThunk(
  'cart/updateCartQuantityApi',
  async ({ productId, weight, action, quantity }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      const isAuthenticated = auth.isAuthenticated;
      const cartKey = isAuthenticated ? AUTH_USER_CART_KEY : GUEST_CART_KEY;
      
      // First, update localStorage for immediate UI feedback
      try {
        const cartJSON = localStorage.getItem(cartKey);
        if (cartJSON) {
          let cart = JSON.parse(cartJSON);
          
          // Find the item in the cart
          const itemIndex = cart.findIndex(item => {
            return item.productId === productId && 
                   item.weight?.value === weight.value && 
                   item.weight?.unit === weight.unit;
          });
          
          let newQuantity;
          if (itemIndex !== -1) {
            // Item exists, update quantity
            if (action === 'set') {
              newQuantity = quantity;
            } else if (action === 'increment') {
              newQuantity = cart[itemIndex].quantity + (quantity || 1);
            } else if (action === 'decrement') {
              newQuantity = Math.max(0, cart[itemIndex].quantity - (quantity || 1));
            }
            
            if (newQuantity > 0) {
              cart[itemIndex].quantity = newQuantity;
            } else {
              // Remove item if quantity is 0
              cart = cart.filter((_, index) => index !== itemIndex);
            }
          } else if (action !== 'decrement') {
            // Item doesn't exist and we're not trying to decrement
            // Add new item
            cart.push({
              productId,
              weight,
              quantity: quantity || 1
            });
          }
          
          // Save updated cart to localStorage
          localStorage.setItem(cartKey, JSON.stringify(cart));
        }
      } catch (localStorageError) {
        console.error('Error updating localStorage cart:', localStorageError);
      }
      
      // Set up authentication if user is logged in
      setupAxiosAuth();
      
      // For both authenticated and guest users, use the API
      // The backend API handles both cases with the optionalAuth middleware
      const response = await axios.post('https://fusionmokshabackend-production.up.railway.app/api/cart/update-quantity', {
        productId,
        weight,
        action,
        quantity // Pass the exact quantity if provided
      });
      
      // After successful update, get the latest cart data from API
      try {
        const cartResponse = await axios.get('https://fusionmokshabackend-production.up.railway.app/api/cart');
        const cartItems = cartResponse.data;
        
        // Transform and update localStorage with fresh data from API
        if (Array.isArray(cartItems)) {
          const transformedCart = transformCartDataForStorage(cartItems);
          localStorage.setItem(cartKey, JSON.stringify(transformedCart));
        }
        
        // Update Redux store
        dispatch({ type: 'cart/fetchCartItems/fulfilled', payload: cartItems });
      } catch (fetchError) {
        console.error('Error fetching cart after update:', fetchError);
      }
      
      return {
        success: true,
        productId,
        weight,
        action,
        quantity // Include the exact quantity in the response
      };
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.message || 'Failed to update cart',
        productId,
        weight
      });
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  'cart/mergeGuestCart',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Get guest cart from localStorage
      const guestCartJSON = localStorage.getItem(GUEST_CART_KEY);
      if (!guestCartJSON) {
        return { success: true, message: 'No guest cart to merge' };
      }
      
      const guestCart = JSON.parse(guestCartJSON);
      if (!guestCart || !Array.isArray(guestCart) || guestCart.length === 0) {
        localStorage.removeItem(GUEST_CART_KEY);
        return { success: true, message: 'No guest cart items to merge' };
      }
      
      setupAxiosAuth();
      const response = await axios.post(`https://fusionmokshabackend-production.up.railway.app/api/cart/merge`, { guestCart });
      
      // Clear guest cart after successful merge
      localStorage.removeItem(GUEST_CART_KEY);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Helper functions for guest cart
export const getGuestCart = () => {
  try {
    const guestCartJSON = localStorage.getItem(GUEST_CART_KEY);
    return guestCartJSON ? JSON.parse(guestCartJSON) : [];
  } catch (error) {
    console.error('Error getting guest cart:', error);
    return [];
  }
};

export const saveGuestCart = (cartItems) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
};

export const addToGuestCart = (item) => {
  const guestCart = getGuestCart();
  
  // Check if item already exists in cart
  const existingItemIndex = guestCart.findIndex(
    (cartItem) => 
      cartItem.productId === item.productId && 
      cartItem.weight.value === item.weight.value &&
      cartItem.weight.unit === item.weight.unit
  );
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    guestCart[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item to cart
    guestCart.push(item);
  }
  
  saveGuestCart(guestCart);
  return guestCart;
};

export const removeFromGuestCart = (itemId) => {
  const guestCart = getGuestCart();
  const updatedCart = guestCart.filter(item => item._id !== itemId);
  saveGuestCart(updatedCart);
  return updatedCart;
};

export const updateGuestCartItemQuantity = (itemId, change) => {
  const guestCart = getGuestCart();
  const itemIndex = guestCart.findIndex(item => item._id === itemId);
  
  if (itemIndex !== -1) {
    const newQuantity = guestCart[itemIndex].quantity + change;
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0 or negative
      return removeFromGuestCart(itemId);
    } else {
      // Update quantity
      guestCart[itemIndex].quantity = newQuantity;
      saveGuestCart(guestCart);
    }
  }
  
  return guestCart;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    isGuest: !localStorage.getItem('token'), // Track if user is guest
    total: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    lastSyncTime: null, // Track when we last synced with the backend
    updatingItems: {}, // Track items being updated
    productCache: {}, // Cache for product details
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.updatingItems = {};
      
      // Clear guest cart if user is guest
      if (state.isGuest) {
        localStorage.removeItem(GUEST_CART_KEY);
      }
    },
    
    setIsGuest: (state, action) => {
      state.isGuest = action.payload;
    },
    
    loadGuestCart: (state) => {
      if (state.isGuest) {
        const guestCart = getGuestCart();
        state.items = guestCart;
      }
    },
    
    addItemToGuestCart: (state, action) => {
      if (state.isGuest) {
        const guestCart = addToGuestCart(action.payload);
        state.items = guestCart;
        state.success = true;
      }
    },
    
    removeItemFromGuestCart: (state, action) => {
      if (state.isGuest) {
        const guestCart = removeFromGuestCart(action.payload);
        state.items = guestCart;
      }
    },
    
    updateGuestItemQuantity: (state, action) => {
      if (state.isGuest) {
        const { itemId, change } = action.payload;
        const guestCart = updateGuestCartItemQuantity(itemId, change);
        state.items = guestCart;
      }
    },
    
    // Update a guest cart item with product details
    fetchProductDetails: (state, action) => {
      const { itemId, productDetails } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === itemId);
      
      if (itemIndex !== -1) {
        // Update the item with product details
        state.items[itemIndex] = {
          ...state.items[itemIndex],
          ...productDetails
        };
        
        // Update the item in localStorage
        if (state.isGuest) {
          const guestCart = getGuestCart();
          const guestItemIndex = guestCart.findIndex(item => item._id === itemId);
          
          if (guestItemIndex !== -1) {
            guestCart[guestItemIndex] = {
              ...guestCart[guestItemIndex],
              ...productDetails
            };
            saveGuestCart(guestCart);
          }
        }
        
        // Add to product cache
        state.productCache = {
          ...state.productCache,
          [state.items[itemIndex].productId]: productDetails
        };
      }
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
    // Update cart quantity API
    builder.addCase(updateCartQuantityApi.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartQuantityApi.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.error = null;
      
      // Clear the optimistic update flag
      if (action.payload.optimisticUpdateId) {
        const itemToUpdate = state.items.find(item => 
          item.optimisticUpdateId === action.payload.optimisticUpdateId
        );
        if (itemToUpdate) {
          itemToUpdate.updating = false;
          delete itemToUpdate.optimisticUpdateId;
        }
      }
      
      if (action.payload.success) {
        // If we have an explicit quantity value, use it directly
        if (action.payload.quantity !== undefined) {
          // Find the item in the cart with matching productId and weight
          const itemIndex = state.items.findIndex(item => {
            const itemProductId = item.product?._id || item.product || item.productId;
            return itemProductId === action.payload.productId &&
              item.weight?.value === action.payload.weight?.value && 
              item.weight?.unit === action.payload.weight?.unit;
          });
          
          if (itemIndex !== -1) {
            // Update the quantity with the exact value we specified
            state.items[itemIndex].quantity = action.payload.quantity;
            
            // If quantity is 0, remove the item from the cart
            if (action.payload.quantity === 0) {
              state.items = state.items.filter((_, index) => index !== itemIndex);
            }
          }
        }
        // For authenticated users, the API returns the updated cartQuantity
        else if (action.payload.cartQuantity !== undefined) {
          // Find the item in the cart with matching productId and weight
          const itemIndex = state.items.findIndex(item => {
            const itemProductId = item.product?._id || item.product || item.productId;
            return itemProductId === action.payload.productId &&
              item.weight?.value === action.payload.weight?.value && 
              item.weight?.unit === action.payload.weight?.unit;
          });
          
          if (itemIndex !== -1) {
            // Update the quantity with the exact value from the backend
            state.items[itemIndex].quantity = action.payload.cartQuantity;
            
            // If quantity is 0, remove the item from the cart
            if (action.payload.cartQuantity === 0) {
              state.items = state.items.filter((_, index) => index !== itemIndex);
            }
          } else if (action.payload.cartQuantity > 0) {
            // If the item doesn't exist in the cart but has a quantity > 0,
            // we'll need to fetch the full cart to get the complete item details
            // This is handled by the fetchCartItems thunk which will be called after this
          }
        } 
        // For guest users, handle the cart state locally
        else if (state.isGuest) {
          const { productId, weight, action: cartAction } = action.payload;
          const itemId = `${productId}-${weight.value}-${weight.unit}`;
          
          // Find the item in the guest cart
          const itemIndex = state.items.findIndex(item => item._id === itemId);
          
          if (itemIndex !== -1) {
            // Update the quantity based on the action
            if (cartAction === 'increment') {
              state.items[itemIndex].quantity += 1;
            } else if (cartAction === 'decrement') {
              state.items[itemIndex].quantity -= 1;
              
              // Remove the item if quantity reaches 0
              if (state.items[itemIndex].quantity <= 0) {
                state.items = state.items.filter((_, index) => index !== itemIndex);
              }
            }
            
            // Update localStorage
            saveGuestCart(state.items);
          }
        }
        
        // Update the lastSyncTime to track when we last got data from the backend
        state.lastSyncTime = Date.now();
      }
    });
    builder.addCase(updateCartQuantityApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Initialize cart from backend
    builder.addCase(initializeCartFromBackend.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(initializeCartFromBackend.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      
      // Update Redux state with cart items from backend
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
      }
      
      // Set as authenticated user
      state.isGuest = false;
    });
    builder.addCase(initializeCartFromBackend.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Merge guest cart
    builder.addCase(mergeGuestCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(mergeGuestCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      
      // If the API returns updated cart items, update the state
      if (action.payload.cart && Array.isArray(action.payload.cart)) {
        state.items = action.payload.cart;
      }
      
      // Clear guest cart status
      state.isGuest = false;
    });
    builder.addCase(mergeGuestCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
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
  revertItemQuantity,
  setIsGuest,
  loadGuestCart,
  addItemToGuestCart,
  removeItemFromGuestCart,
  updateGuestItemQuantity,
  fetchProductDetails
} = cartSlice.actions;
export default cartSlice.reducer;
