// frontend/src/services/notificationService.js
import axios from 'axios';
import API_BASE_URL from '../api/config';

const API_URL = `${API_BASE_URL}`;

export const notificationService = {
  // Send venue booking notification to venue owner
  notifyVenueOwner: async (notificationData) => {
    try {
      const response = await axios.post(`${API_URL}/api/notifications/venue-booking`, {
        venueId: notificationData.venue.id,
        venueName: notificationData.venue.name,
        ownerId: notificationData.owner.id,
        ownerType: notificationData.owner.type,
        ownerEmail: notificationData.owner.email,
        requesterName: notificationData.requester.name,
        requesterType: notificationData.requester.type,
        requesterId: notificationData.requester.id,
        message: `${notificationData.requester.name} would like to book your venue "${notificationData.venue.name}" for an event.`
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send venue owner notification:', error);
      throw new Error(error.response?.data?.message || 'Failed to send notification');
    }
  },

  // Create an in-app notification
  createInAppNotification: async (notification) => {
    try {
      const response = await axios.post(`${API_URL}/api/notifications`, notification, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw new Error(error.response?.data?.message || 'Failed to create notification');
    }
  },

  // Get user notifications
  getUserNotifications: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(`${API_URL}/api/notifications/${notificationId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark as read');
    }
  }
};
