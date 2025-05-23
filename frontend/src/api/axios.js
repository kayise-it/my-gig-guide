//file: src/api/axios.js
import axios from 'axios';

// Determine the base URL based on the environment
const baseURL ='http://localhost:8000/api';

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

// Add request interceptor (optional: Add auth token if available)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Request Error: ', error);
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;