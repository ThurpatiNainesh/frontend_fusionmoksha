import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, setAuthToken } from '../services/api';

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
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser({ email, password });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, phone }, { rejectWithValue }) => {
    try {
      const response = await registerUser({ name, email, password, phone });
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify({
        id: action.payload.user.id,
        name: action.payload.user.name,
        email: action.payload.user.email,
        role: action.payload.user.role
      }));
      setAuthToken(action.payload.token);
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
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify({
        id: action.payload.data._id,
        name: action.payload.data.name,
        email: action.payload.data.email,
        role: action.payload.data.role
      }));
      setAuthToken(action.payload.token);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Registration failed';
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
