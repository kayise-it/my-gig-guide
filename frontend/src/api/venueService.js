// src/api/venueService.js
import axios from 'axios';
import API_BASE_URL from '../api/config';
//import { get } from 'backend/routes/auth.routes';

const API_URL = `${API_BASE_URL}`;

export const venueService = {
  getVenues: async (params = {}, userInfo = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add user information for smart ordering
      if (userInfo.role) queryParams.append('user_role', userInfo.role);
      if (userInfo.id) queryParams.append('user_id', userInfo.id);
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await axios.get(`${API_URL}/api/venue?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venues');
    }
  },
  createVenue: async (venueData, isFormData = false) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      if (isFormData) headers['Content-Type'] = 'multipart/form-data';
      const response = await axios.post(`${API_URL}/api/venue/createVenue`, venueData, { headers });
      // Return the venue object directly for easier access
      return response.data.venue || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create venue');
    }
  },
  updateVenue: async (venueId, venueData, isFormData = false) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      if (isFormData) headers['Content-Type'] = 'multipart/form-data';
      const response = await axios.put(`${API_URL}/api/venue/updateVenue/${venueId}`, venueData, { headers });
      // Return the venue object directly for easier access
      return response.data.venue || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update venue');
    }
  },
  uploadVenueGallery: async (venueId, files) => {
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('venue_gallery', f));
      const response = await axios.put(`${API_URL}/api/venue/uploadGallery/${venueId}`, fd, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload venue gallery');
    }
  },
  deleteVenueGalleryImage: async (venueId, imagePath) => {
    try {
      const response = await axios.delete(`${API_URL}/api/venue/deleteGalleryImage/${venueId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        data: { imagePath }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete venue gallery image');
    }
  },
  updateEventVenue: async (venueId, venueData) => {
    try {
      const response = await axios.put(`${API_URL}/api/artists/event/updateVenue/${venueId}`, venueData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update venue');
    }
  },
  getVenue: async (venueId) => {
    try {
      const response = await axios.get(`${API_URL}/api/venue/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.venue;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venue');
    }
  },
  getOrganisersVenues: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/venue/getOrganisersVenues/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venues by organiser');
    }
  },
  getArtistVenues: async (userOrArtistId) => {
    try {
      const response = await axios.get(`${API_URL}/api/venue/getArtistVenues/${userOrArtistId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venues by artist');
    }
  },
  getVenueById: async (venueId) => {
    try {
      const response = await axios.get(`${API_URL}/api/venue/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venue');
    }
  },
  deleteVenue: async (venueId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/venue/delete/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete venue');
    }
  }

};