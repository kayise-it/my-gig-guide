// src/api/config.js

let API_BASE_URL = '';
if (import.meta.env.MODE === 'development') {
  API_BASE_URL = 'http://localhost:3001'; // Your local backend URL
} else {
  API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://62.72.18.206'; // Default to live
}

console.log('API_BASE_URL set to:', API_BASE_URL);

export default API_BASE_URL;

