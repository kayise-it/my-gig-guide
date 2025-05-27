// src/api/config.js

const API_BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:8000'
  : 'https://my-gig-guide-backend.onrender.com'; // Replace with your live backend URL

export default API_BASE_URL;