import React, { useState, useEffect } from 'react';
import GlobalProfileUploader from './GlobalProfileUploader';
import GalleryDisplay from './GalleryDisplay';
import axios from '../api/axios';

const GalleryTest = () => {
  const [userId, setUserId] = useState(1); // Replace with actual user ID
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  // Function to add sample gallery images
  const addSampleGallery = async () => {
    try {
      const response = await axios.post(`/api/artists/test/add-sample-gallery/${userId}`);
      console.log('Sample gallery added:', response.data);
      // Refresh artist data
      const artistResponse = await axios.get(`/api/artists/${userId}`);
      setArtistData(artistResponse.data);
    } catch (error) {
      console.error('Error adding sample gallery:', error);
    }
  };

  // Fetch artist data to get the correct folder structure
  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        console.log('Fetching artist data for userId:', userId);
        const response = await axios.get(`/api/artists/${userId}`);
        setArtistData(response.data);
        console.log('Artist data:', response.data);
      } catch (error) {
        console.error('Error fetching artist data:', error);
        console.error('Error response:', error.response?.data);
        // Use default data if fetch fails
        setArtistData({
          id: userId,
          userId: userId,
          settings: JSON.stringify({
            path: '/artists/',
            folder_name: '3_testartist_1234'
          })
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [userId]);

  // Example usage for gallery upload
  const galleryProps = {
    userType: 3, // Artist role
    userId: userId,
    username: artistData?.stage_name || 'testartist',
    whoWhere: 'artists',
    onUploadSuccess: () => setGalleryRefreshKey(prev => prev + 1)
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg h-96"></div>
            <div className="bg-gray-50 p-6 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gallery Upload Test</h1>
      
      {/* Artist Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold mb-2">Artist Information</h2>
            <p><strong>ID:</strong> {artistData?.id || userId}</p>
            <p><strong>Stage Name:</strong> {artistData?.stage_name || 'Test Artist'}</p>
            <p><strong>Folder:</strong> {artistData?.settings ? JSON.parse(artistData.settings).folder_name : '3_testartist_1234'}</p>
            <p><strong>Gallery Count:</strong> {artistData?.gallery ? JSON.parse(artistData.gallery).length : 0} images</p>
          </div>
          <button
            onClick={addSampleGallery}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Add Sample Gallery
          </button>
          <button
            onClick={() => {
              console.log('Testing gallery fetch...');
              // Force refresh the gallery display
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm ml-2"
          >
            Test Gallery Fetch
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload Gallery Images</h2>
          <GlobalProfileUploader {...galleryProps} />
        </div>

        {/* Display Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gallery Display</h2>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
          <GalleryDisplay userId={userId} userType="artists" refreshKey={galleryRefreshKey} />
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Upload some images using the upload section</li>
          <li>Check the display section to see uploaded images</li>
          <li>Click "Refresh" to reload the gallery display</li>
          <li>Images will be stored in: <code className="bg-gray-200 px-1 rounded">frontend/public/artists/[folder_name]/gallery/</code></li>
        </ol>
      </div>
    </div>
  );
};

export default GalleryTest;
