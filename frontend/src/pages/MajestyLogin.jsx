// File: frontend/src/pages/MajestyLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export default function MajestyLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      console.log('🔍 Attempting Management login with:', {
        API_URL: `${API_BASE_URL}/api/majesty/login`
      });
      const response = await axios.post(`${API_BASE_URL}/api/majesty/login`, formData);
      console.log('Management login successful:', response.data);
      if (response.data?.token && response.data?.majesty) {
        // Store management token and data
        localStorage.setItem('management_token', response.data.token);
        localStorage.setItem('management', JSON.stringify(response.data.majesty));
        alert(`Welcome ${response.data.majesty.full_name || response.data.majesty.username}, Management Portal`);
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('Management login error:', error.response?.data);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Management Access</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded px-3 py-2" placeholder="Username" value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} />
          <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white rounded py-2">
            {isSubmitting ? 'Signing in...' : 'Enter Management Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
