//backend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api/config';


export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure login from useAuth

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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
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

    // Debug: Log what we're sending
    console.log('🔍 Attempting login with:', {
      username: formData.username,
      password: formData.password ? '***' : 'empty',
      API_URL: `${API_BASE_URL}/api/auth/login`
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      console.log('Login successful:', response.data);

      if (response.data?.token && response.data?.user) {
        // Use the login function from context
        try {
          login(response.data.token, response.data.user);
        } catch (loginError) {
          console.error('Context login failed:', loginError);
        }
        console.log('User object structure:', {
          id: response.data.user?.id,
          role: response.data.user?.role,
          username: response.data.user?.username
        });
        alert(`Welcome ${response.data.user.username}, your role is ${response.data.user.role}`);

        // Redirect based on role
        const roleRoutes = {
          1: '/admin',
          3: '/artists/dashboard',
          4: '/organiser/dashboard'
        };

        const route = roleRoutes[response.data.user?.role] || '/';
        console.log('Redirecting to:', route);
        console.log('User data:', response.data.user?.role);
        navigate(route);

      } else {
        setErrors({
          server: 'Invalid response from the server. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      console.error('🔍 Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      setErrors({
        server: error.response?.data?.message || 'Login failed. Please check your credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      console.log('🔍 Starting Facebook login...');
      
      // Check if Facebook SDK is available
      if (!window.FB) {
        console.error('Facebook SDK not loaded');
        alert('Facebook login is not available. Please try again.');
        return;
      }

      // Initialize Facebook login
      window.FB.login(async (response) => {
        if (response.authResponse) {
          console.log('✅ Facebook login successful:', response.authResponse);
          
          try {
            // Send access token to your backend
            const backendResponse = await axios.post(`${API_BASE_URL}/api/social-auth/facebook`, {
              accessToken: response.authResponse.accessToken
            });

            console.log('✅ Backend response:', backendResponse.data);

            if (backendResponse.data?.token && backendResponse.data?.user) {
              // Login user
              login(backendResponse.data.token, backendResponse.data.user);
              
              alert(`Welcome ${backendResponse.data.user.name || backendResponse.data.user.username}!`);
              
              // Redirect based on role
              const roleRoutes = {
                1: '/admin',
                3: '/artists/dashboard',
                4: '/organiser/dashboard'
              };

              const route = roleRoutes[backendResponse.data.user?.role] || '/';
              navigate(route);
            }
          } catch (error) {
            console.error('❌ Backend Facebook auth error:', error.response?.data);
            setErrors({
              server: error.response?.data?.message || 'Facebook login failed. Please try again.'
            });
          }
        } else {
          console.log('❌ Facebook login cancelled or failed');
          setErrors({
            server: 'Facebook login was cancelled or failed. Please try again.'
          });
        }
      }, {
        scope: 'email,public_profile'
      });

    } catch (error) {
      console.error('❌ Facebook login error:', error);
      setErrors({
        server: 'Facebook login failed. Please try again.'
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('🔍 Starting Google login...');
      alert('Google login coming soon!');
    } catch (error) {
      console.error('❌ Google login error:', error);
      setErrors({
        server: 'Google login failed. Please try again.'
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.server && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errors.server}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Social Login (Optional) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}