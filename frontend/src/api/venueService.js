// src/api/venueService.js
import http from './http';
import API_BASE_URL from '../api/config';

const API_URL = `${API_BASE_URL}`;

export const venueService = {
  getVenues: async (params = {}, userInfo = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (userInfo.role) queryParams.append('user_role', userInfo.role);
      if (userInfo.id) queryParams.append('user_id', userInfo.id);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      // Use public endpoint for unauthenticated users, authenticated endpoint for authenticated users
      const endpoint = userInfo.role ? `/api/venue?${queryParams.toString()}` : `/api/venue/public?${queryParams.toString()}`;
      const response = await http.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venues');
    }
  },

  createVenue: async (venueData, isFormData = false) => {
    try {
      const headers = {};
      if (isFormData) headers['Content-Type'] = 'multipart/form-data';
      const response = await http.post(`/api/venue/createVenue`, venueData, { headers });
      return response.data.venue || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create venue');
    }
  },

  updateVenue: async (venueId, venueData, isFormData = false) => {
    try {
      const headers = {};
      if (isFormData) {
        delete headers['Content-Type'];
      }
      const response = await http.put(`/api/venue/updateVenue/${venueId}`, venueData, { headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update venue');
    }
  },

  uploadVenueGallery: async (venueId, files) => {
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('venue_gallery', f));
      const response = await http.put(`/api/venue/uploadGallery/${venueId}`, fd);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload venue gallery');
    }
  },

  deleteVenueGalleryImage: async (venueId, imagePath) => {
    try {
      const response = await http.delete(`/api/venue/deleteGalleryImage/${venueId}`, {
        data: { imagePath }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete venue gallery image');
    }
  },

  updateEventVenue: async (venueId, venueData) => {
    try {
      const response = await http.put(`/api/artists/event/updateVenue/${venueId}`, venueData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update venue');
    }
  },

  getVenue: async (venueId) => {
    try {
      const response = await http.get(`/api/venue/${venueId}`);
      return response.data.venue;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venue');
    }
  },

  getOrganisersVenues: async (userId) => {
    try {
      const response = await http.get(`/api/venue/getOrganisersVenues/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venues by organiser');
    }
  },

  getArtistVenues: async (userOrArtistId) => {
    try {
      const response = await http.get(`/api/venue/getArtistVenues/${userOrArtistId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venues by artist');
    }
  },

  getVenueById: async (venueId) => {
    try {
      const response = await http.get(`/api/venue/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venue');
    }
  },

  getVenueByIdPublic: async (venueId) => {
    try {
      const response = await http.get(`/api/venue/public/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venue');
    }
  },

  deleteVenue: async (venueId) => {
    try {
      const response = await http.delete(`/api/venue/delete/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete venue');
    }
  },

  getVenueEvents: async (venueId) => {
    try {
      const response = await http.get(`/api/events/venue/${venueId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching venue events:', error);
      return { success: true, events: [] };
    }
  }
};