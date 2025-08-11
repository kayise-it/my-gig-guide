import axios from './axios';

const favoriteService = {
  // Add a favorite (supports artist, event, venue, organiser)
  addFavorite: async (type, itemId) => {
    try {
      const response = await axios.post('/api/favorites', { 
        type, 
        itemId 
      });
      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  // Remove a favorite (supports artist, event, venue, organiser)
  removeFavorite: async (type, itemId) => {
    try {
      const response = await axios.delete('/api/favorites', {
        data: { type, itemId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  // Check if an item is favorited
  checkFavorite: async (type, itemId) => {
    try {
      const response = await axios.get('/api/favorites/check', {
        params: { type, itemId }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      throw error;
    }
  },

  // Get favorites by type (artist, event, venue, organiser)
  getFavoritesByType: async (type) => {
    try {
      const response = await axios.get(`/api/favorites/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error getting favorites by type:', error);
      throw error;
    }
  },

  // Get all user's favorites (all types)
  getAllFavorites: async () => {
    try {
      const response = await axios.get('/api/favorites');
      return response.data;
    } catch (error) {
      console.error('Error getting all favorites:', error);
      throw error;
    }
  },

  // Legacy methods for backward compatibility
  addOrganiserFavorite: async (organiserId) => {
    return favoriteService.addFavorite('organiser', organiserId);
  },

  removeOrganiserFavorite: async (organiserId) => {
    return favoriteService.removeFavorite('organiser', organiserId);
  },

  checkOrganiserFavorite: async (organiserId) => {
    return favoriteService.checkFavorite('organiser', organiserId);
  }
};

export default favoriteService;
