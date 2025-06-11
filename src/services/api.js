import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchProducts = async (params) => {
    try {
        const response = await axios.get(`${API_URL}/products/search`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};
