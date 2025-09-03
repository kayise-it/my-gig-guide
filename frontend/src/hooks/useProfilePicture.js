import { useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export const useProfilePicture = (userId, artistSettings) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadProfilePicture = useCallback(async (imageFile) => {
    if (!imageFile || !userId) {
      throw new Error('Missing required parameters');
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('profile_picture', imageFile);

      const response = await axios.put(
        `${API_BASE_URL}/api/artists/uploadprofilepicture/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Profile picture upload successful:', response.data);

      if (response.status === 200) {
        setUploadSuccess(true);
        return {
          success: true,
          profile_picture: response.data.profile_picture,
          message: response.data.message
        };
      } else {
        throw new Error('Upload failed with non-200 status');
      }
    } catch (error) {
      console.error('❌ Profile picture upload failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      setUploadError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [userId]);

  const resetUploadState = useCallback(() => {
    setUploadError(null);
    setUploadSuccess(false);
  }, []);

  return {
    uploadProfilePicture,
    isUploading,
    uploadError,
    uploadSuccess,
    resetUploadState
  };
};
