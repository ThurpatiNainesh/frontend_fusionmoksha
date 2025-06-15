import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import searchReducer from './searchSlice.js';
import productReducer from './productSlice.js';
import cartReducer from './cartSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    products: productReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const RootState = store.getState();
export const AppDispatch = store.dispatch;
