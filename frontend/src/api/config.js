// src/api/config.js
// ===========================================
// API CONFIGURATION
// ===========================================

let API_BASE_URL = '';

// Use only when we are working on localhost
if (import.meta.env.MODE === 'development') {
  API_BASE_URL = 'http://localhost:3001'; // Your local backend URL (matches backend port)
} else {
  // Use only when going live on VPS
  API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://62.72.18.206'; // Default to live
}

console.log('API_BASE_URL set to:', API_BASE_URL);
console.log('Environment mode:', import.meta.env.MODE);

export default API_BASE_URL;

