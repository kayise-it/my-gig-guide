// src/api/venueService.js
import axios from 'axios';
import API_BASE_URL from '../api/config';

const API_URL = `${API_BASE_URL}/api`;

export const venueService = {
  createVenue: async (venueData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/venue/createVenue`, venueData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create venue');
    }
  },

  getVenue: async (venueId) => {
    try {
      const response = await axios.get(`${API_URL}/venue/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fe23tch venue');
    }
  },

  updateVenue: async (venueId, venueData) => {
    try {
      const response = await axios.put(`${API_URL}/venue/updateVenue/${venueId}`, venueData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update venue');
    }
  },
  updateEventVenue: async (venueId, venueData) => {
    try {
      const response = await axios.put(`${API_URL}/artists/event/updateVenue/${venueId}`, venueData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update venue');
    }
  }
};