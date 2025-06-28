// src/api/config.js

// For debugging - log the environment
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());

const API_BASE_URL = 'http://64.225.8.251:3300';

console.log('API_BASE_URL set to:', API_BASE_URL);

export default API_BASE_URL;