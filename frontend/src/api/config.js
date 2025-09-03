// src/api/config.js

// App base path for client-side routing (empty means root). Override with VITE_APP_BASE_PATH if needed.
export const APP_BASE_PATH = (import.meta.env.VITE_APP_BASE_PATH ?? '').replace(/\/$/, '');

// API base URL (host + optional port), defaults to current origin. Override with VITE_API_BASE_URL.
const envApiBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (envApiBase ? envApiBase : window.location.origin).replace(/\/$/, '');

console.log('API_BASE_URL set to:', API_BASE_URL);

export default API_BASE_URL;
