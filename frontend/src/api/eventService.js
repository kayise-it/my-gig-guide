// src/api/eventService.js
import axios from 'axios';
import API_BASE_URL from '../api/config';
//import { get } from 'backend/routes/auth.routes';

const API_URL = `${API_BASE_URL}`;

export const eventService = {
  createEvent: async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}/api/events/create_event`, eventData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await axios.put(`${API_URL}/api/events/edit/${eventId}`, eventData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },
  updateEventEvent: async (eventId, eventData) => {
    try {
      const response = await axios.put(`${API_URL}/api/artists/event/updateEvent/${eventId}`, eventData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },
  getOrganisersEvents: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/events/by_organiser/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events by organiser');
    }
  },
  getEventsByOwner: async (ownerId, ownerType) => {
    try {
      const response = await axios.get(`${API_URL}/api/events/owner/${ownerType}/${ownerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events by owner');
    }
  },
  getEventsByOrganiser: async (organiserId) => {
    try {
      const response = await axios.get(`${API_URL}/api/events/owner/organiser/${organiserId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events by organiser');
    }
  },
  getEventsByArtist: async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/api/events/owner/artist/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events by artist');
    }
  },
  getEventById: async (eventId) => {
    try {
      const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event');
    }
  },
  deleteEvent: async (eventId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/events/delete/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },
  getAllEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all events');
    }
  }
};