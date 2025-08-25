import axios from 'axios';
import API_BASE_URL from '../api/config';

const token = localStorage.getItem('token');

const ratingService = {
  // Create or update a rating
  createOrUpdateRating: async (ratingData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ratings`,
        ratingData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Rating creation error:', error);
      throw error;
    }
  },

  // Get average rating for an item
  getAverageRating: async (rateableType, rateableId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ratings/average/${rateableType}/${rateableId}`
      );
      return response.data;
    } catch (error) {
      console.error('Get average rating error:', error);
      // Return default values if error
      return { avgRating: 0, totalRatings: 0 };
    }
  },

  // Get user's rating for an item
  getUserRating: async (rateableType, rateableId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ratings/user/${rateableType}/${rateableId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get user rating error:', error);
      return { rating: null };
    }
  },

  // Get all ratings for an item
  getItemRatings: async (rateableType, rateableId, page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ratings/${rateableType}/${rateableId}`,
        {
          params: { page, limit }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get item ratings error:', error);
      return {
        ratings: [],
        totalRatings: 0,
        averageRating: { avgRating: 0, totalRatings: 0 },
        currentPage: 1,
        totalPages: 0
      };
    }
  },

  // Delete user's rating
  deleteRating: async (rateableType, rateableId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/ratings/${rateableType}/${rateableId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Delete rating error:', error);
      throw error;
    }
  },

  // Get user's all ratings
  getUserRatings: async (page = 1, limit = 10, type = null) => {
    try {
      const params = { page, limit };
      if (type) params.type = type;

      const response = await axios.get(
        `${API_BASE_URL}/ratings/user/ratings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get user ratings error:', error);
      return {
        ratings: [],
        totalRatings: 0,
        currentPage: 1,
        totalPages: 0
      };
    }
  }
};

export default ratingService;


