import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import searchReducer from './searchSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  },
});

export const RootState = store.getState();
export const AppDispatch = store.dispatch;
