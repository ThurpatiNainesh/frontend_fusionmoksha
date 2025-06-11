import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'relevance'
  }
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
      state.filters = initialState.filters;
    }
  }
});

export const { 
  setSearchQuery, 
  setSearchResults, 
  setLoading, 
  setError, 
  setFilters, 
  clearSearch 
} = searchSlice.actions;

export default searchSlice.reducer;
