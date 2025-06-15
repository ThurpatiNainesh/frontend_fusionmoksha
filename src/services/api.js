import axios from 'axios';

const API_URL = 'https://fusionmokshabackend-production.up.railway.app/api';

// Auth API
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Products API
export const fetchProduct = async (productId) => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const fetchProducts = async (page = 1, limit = 6) => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const fetchTopProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/top`);
        return response.data;
    } catch (error) {
        console.error('Error fetching top products:', error);
        throw error.response?.data || error.message;
    }
};

// Set auth token for authenticated requests
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};
