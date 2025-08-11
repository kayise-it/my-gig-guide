// src/api/config.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

console.log('API_BASE_URL set to:', API_BASE_URL);

export default API_BASE_URL;

