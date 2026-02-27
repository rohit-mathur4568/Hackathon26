// API Configuration
// In development: Vite proxy forwards /api to http://localhost:5000
// In production: Update API_BASE_URL to your production backend URL

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return fetch(url, options);
};

export default API_BASE_URL;
