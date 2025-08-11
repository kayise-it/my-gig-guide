// src/api/artistService.js
import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}`;

export const artistService = {
  createArtist: async (artistData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/artist/createArtist`, artistData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create artist');
    }
  },

  getArtist: async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/api/artists/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fe23tch artist');
    }
  },

  updateArtist: async (artistId, artistData) => {
    try {
      const response = await axios.put(`${API_URL}/api/artists/edit/${artistId}`, artistData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update 4444artist');
    }
  },
  
  updateEventArtist: async (artistId, artistData) => {
    try {
      const response = await axios.put(`${API_URL}/api/artists/event/updateArtist/${artistId}`, artistData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update artist');
    }
  }
};