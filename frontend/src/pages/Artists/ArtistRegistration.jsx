// src/pages/Artists/ArtistRegistration.jsx
import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function ArtistRegistration() {
  const [formData, setFormData] = useState({
    artistType: 'singer',
    stageName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/artists/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_type: formData.artistType,
          stage_name: formData.stageName,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          location: formData.location,
          bio: formData.bio,
          terms: formData.terms
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Artist registered successfully!');
        // Reset form or redirect
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 py-6 px-8 text-white">
          <h1 className="text-2xl font-bold">Artist Registration</h1>
          <p className="text-indigo-100 mt-1">Join our creative community and showcase your talent</p>
        </div>
        
        {/* Progress indicator */}
        <div className="px-8 pt-6">
          <div className="flex items-center">
            <div className="flex-1 border-t-2 border-indigo-500"></div>
            <div className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium">
              Step 1 of 2
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">Basic Information</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6">
          {/* Artist Type */}

          <div className="mb-6">
            
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Artist Type <span className="text-red-500">*</span>
            </label>
            <p className="text-red-600">Allow the artist to describe their type of art</p>
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['singer', 'band', 'poet', 'author'].map((type) => (
                <label 
                  key={type}
                  className={`flex items-center space-x-2 p-3 border rounded-lg hover:border-indigo-400 cursor-pointer ${
                    formData.artistType === type ? 'border-indigo-400 bg-indigo-50' : ''
                  }`}
                >
                  <input 
                    type="radio" 
                    name="artistType" 
                    value={type}
                    checked={formData.artistType === type}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-indigo-600" 
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div> */}
          </div>
          
          {/* Stage Name */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="stageName">
              Stage/Professional Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="stageName"
                name="stageName"
                value={formData.stageName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. The Midnight Singers"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">This is the name that will be displayed to the public</p>
          </div>
          
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Doe"
              />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your@email.com"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="location">
                Location (City/Region)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. New York, NY"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio */}
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="bio">
              Short Bio/Description
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tell us about yourself and your art..."
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">Max 250 characters. This will be displayed on your public profile.</p>
          </div>
          
          {/* Terms and Submit */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 font-medium"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="inline mr-2" /> Back
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
            >
              Save and Continue <FaArrowRight className="inline ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}