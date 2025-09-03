import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export const useArtistData = (userId) => {
  const [artistData, setArtistData] = useState({
    id: 0,
    userId: 0,
    stage_name: '',
    real_name: '',
    genre: '',
    bio: '',
    phone_number: '',
    instagram: '',
    facebook: '',
    twitter: '',
    profile_picture: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/artists/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Artist data fetched successfully:', response.data);
      setArtistData(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch artist data:', error);
      setError(error.response?.data?.message || 'Failed to fetch artist data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateArtistData = useCallback((updates) => {
    setArtistData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const updateProfilePicture = useCallback((newProfilePicturePath) => {
    updateArtistData({ profile_picture: newProfilePicturePath });
  }, [updateArtistData]);

  useEffect(() => {
    fetchArtistData();
  }, [fetchArtistData]);

  return {
    artistData,
    loading,
    error,
    setError,
    fetchArtistData,
    updateArtistData,
    updateProfilePicture
  };
};
