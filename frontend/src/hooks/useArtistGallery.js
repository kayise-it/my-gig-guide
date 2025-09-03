import { useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export const useArtistGallery = (userId) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/artists/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Gallery data fetched successfully:', response.data.gallery);

      if (response.data.gallery && response.data.gallery.trim() !== '') {
        try {
          const galleryImages = JSON.parse(response.data.gallery);
          const formattedGallery = galleryImages.map(img => {
            let url = img;
            if (img.startsWith('../frontend/public/')) {
              url = img.replace('../frontend/public/', '/');
            } else if (img.startsWith('/artists/')) {
              url = img;
            } else if (!img.startsWith('http')) {
              url = `/${img}`;
            }

            return {
              url: url,
              originalPath: img
            };
          });

          setGallery(formattedGallery);
        } catch (parseError) {
          console.error('❌ Error parsing gallery JSON:', parseError);
          setGallery([]);
        }
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch gallery:', error);
      setError(error.response?.data?.message || 'Failed to fetch gallery');
      setGallery([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteGalleryImage = useCallback(async (imagePath) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/artists/galleryDelete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { imagePath }
      });

      console.log('✅ Gallery image deleted successfully');
      await fetchGallery(); // Refresh gallery after deletion
    } catch (error) {
      console.error('❌ Failed to delete gallery image:', error);
      throw error;
    }
  }, [userId, fetchGallery]);

  return {
    gallery,
    loading,
    error,
    fetchGallery,
    deleteGalleryImage
  };
};
