// File: frontend/src/pages/MajestyLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export default function MajestyLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    console.log('🔍 Attempting Majesty login with:', {
      username: formData.username,
      password: formData.password ? '***' : 'empty',
      API_URL: `${API_BASE_URL}/api/majesty/login`
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/majesty/login`, formData);
      console.log('Majesty login successful:', response.data);

      if (response.data?.token && response.data?.majesty) {
        // Store majesty token and data
        localStorage.setItem('majesty_token', response.data.token);
        localStorage.setItem('majesty', JSON.stringify(response.data.majesty));
        
        
        alert(`Welcome ${response.data.majesty.full_name || response.data.majesty.username}, Owner of My Gig Guide!`);
        
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        setErrors({
          server: 'Invalid response from the server. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Majesty login error:', error.response?.data);
      setErrors({
        server: error.response?.data?.message || 'Login failed. Please check your credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-yellow-400 p-4 rounded-full">
            <FaCrown className="h-12 w-12 text-purple-900" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Majesty Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Owner Portal - My Gig Guide
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/10 backdrop-blur-lg py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-white/20">
          {errors.server && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-md text-sm border border-red-500/30">
              {errors.server}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white/90`}
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-300">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white/90`}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Signing in...' : 'Enter Majesty Portal'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-300 hover:text-white underline"
            >
              Back to Regular Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
