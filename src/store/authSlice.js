import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, setAuthToken } from '../services/api';
import { initializeCartFromBackend, mergeGuestCart } from './cartSlice';

// Load token from localStorage if exists
const token = localStorage.getItem('token');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
  isAuthenticated: !!token,
  user: user,
  token: token,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await loginUser({ email, password });
      
      // Set token in localStorage and axios headers
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role
      }));
      setAuthToken(response.token);
      
      // Initialize cart from backend after successful login
      try {
        await dispatch(initializeCartFromBackend()).unwrap();
        
        // Check if we need to merge guest cart
        const guestCartJSON = localStorage.getItem('fusionmoksha_guest_cart');
        if (guestCartJSON) {
          const guestCart = JSON.parse(guestCartJSON);
          if (guestCart && guestCart.length > 0) {
            await dispatch(mergeGuestCart()).unwrap();
          }
        }
      } catch (cartError) {
        console.error('Error initializing cart after login:', cartError);
        // Continue with login even if cart initialization fails
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, phone }, { rejectWithValue, dispatch }) => {
    try {
      const response = await registerUser({ name, email, password, phone });
      
      // Set token in localStorage and axios headers
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
      setAuthToken(response.token);
      
      // Initialize cart from backend after successful registration
      try {
        await dispatch(initializeCartFromBackend()).unwrap();
        
        // Check if we need to merge guest cart
        const guestCartJSON = localStorage.getItem('fusionmoksha_guest_cart');
        if (guestCartJSON) {
          const guestCart = JSON.parse(guestCartJSON);
          if (guestCart && guestCart.length > 0) {
            await dispatch(mergeGuestCart()).unwrap();
          }
        }
      } catch (cartError) {
        console.error('Error initializing cart after registration:', cartError);
        // Continue with registration even if cart initialization fails
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      
      // Clear authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear authenticated user's cart from localStorage
      localStorage.removeItem('fusionmoksha_auth_cart');
      
      // Reset auth token in axios headers
      setAuthToken(null);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Note: localStorage and cart initialization are now handled in the thunk itself
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Login failed';
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.data;
      state.token = action.payload.token;
      // Note: localStorage and cart initialization are now handled in the thunk itself
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Registration failed';
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
