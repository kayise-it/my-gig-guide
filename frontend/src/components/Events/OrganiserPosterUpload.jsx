//File location: frontend/src/components/Events/OrganiserPosterUpload.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const OrganiserPosterUpload = ({ onSave, orgFolder, userType = 'organisers' }) => {
  const [organiser, setOrganiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Get user ID from localStorage
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/${userType}/${userId}`);
        const userData = response.data;

        if (userData) {
          setOrganiser(userData);
          //If poster exists in gallery, use the first one as preview
          if (userData.gallery && Array.isArray(userData.gallery) && userData.gallery.length > 0) {
            const settings = userData.settings ? JSON.parse(userData.settings) : {};
            const basePath = settings.path || `/${userType.slice(0, -1)}/`; // Remove 's' from end
            const folderName = settings.folder_name || '';
            const posterUrl = `${basePath}${folderName}/${userData.gallery[0]}`;
            setPreviewUrl(posterUrl);
          }
        }
      } catch (err) {
        setError(`Failed to fetch ${userType.slice(0, -1)} data`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, userType]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

const handleUpload = async () => {
  if (!selectedFile || !organiser) return;

  setIsUploading(true);
  setUploadProgress(0);

  const formData = new FormData();
  formData.append('poster', selectedFile);
  formData.append('orgFolder', orgFolder);
  formData.append('setting_name', 'Event Poster'); // optional

  try {
    const response = await axios.post(`${API_BASE_URL}/api/${userType}/upload-poster`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      },
    });

    const uploadedFileName = response.data.fileName;
    setFileName(uploadedFileName);

    // Call parent with file name
    if (onSave) {
      onSave(uploadedFileName); // ✅ send to parent
    }

    // Update organiser gallery
    const currentGallery = Array.isArray(organiser.gallery) ? organiser.gallery : [];
    const updatedGallery = [...currentGallery, response.data.posterFilename];
    setOrganiser({
      ...organiser,
      gallery: updatedGallery,
      updatedAt: new Date().toISOString(),
    });

    // Reset UI state
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  } catch (err) {
    setError('Failed to upload poster');
    console.error(err);
    setIsUploading(false);
  }
};

    const handleRemovePoster = async (posterIndex) => {
    if (!organiser?.gallery || !Array.isArray(organiser.gallery) || organiser.gallery.length <= posterIndex) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/${userType}/remove-poster`, {
        data: {
          userId: organiser.id,
          posterFilename: organiser.gallery[posterIndex]
        }
      });

      // Update the organiser data
      const updatedGallery = [...organiser.gallery];
      updatedGallery.splice(posterIndex, 1);
      setOrganiser({
        ...organiser,
        gallery: updatedGallery,
        updatedAt: new Date().toISOString(),
      });

      // Clear preview if we removed the currently shown poster
      if (previewUrl.includes(organiser.gallery[posterIndex])) {
        setPreviewUrl('');
      }
    } catch (err) {
      setError('Failed to remove poster');
      console.error(err);
    }
  };


  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (!organiser) return <div className="text-center py-4 text-red-500">No organiser found</div>;

  return (
    <div className="">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {uploadSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Poster uploaded successfully!
        </div>
      )}

      <div className="mb-6">
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Organiser Poster"
              className="max-w-full h-auto max-h-96 rounded-lg shadow-md mb-4"
            />
            <div className="flex space-x-3">
              <label className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition">
                Change Poster
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => handleRemovePoster(0)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Remove Poster
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>      
      {selectedFile && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`w-full py-2 px-4 rounded text-white font-medium ${isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition`}
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Poster'}
          </button>
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Gallery display if multiple posters are allowed */}
      {organiser.gallery && Array.isArray(organiser.gallery) && organiser.gallery.length > 1 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Poster Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {organiser.gallery.map((poster, index) => {
              const settings = organiser.settings ? JSON.parse(organiser.settings) : {};
              const basePath = settings.path || '/organiser/';
              const folderName = settings.folder_name || '';
              const posterUrl = `${basePath}${folderName}/${poster}`;

              return (
                <div key={index} className="relative group">
                  <img
                    src={posterUrl}
                    alt={`Poster ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemovePoster(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganiserPosterUpload;