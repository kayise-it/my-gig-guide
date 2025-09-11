//File path: frontend/src/pages/Artists/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  PencilIcon, 
  MusicalNoteIcon, 
  LinkIcon, 
  UserIcon, 
  PhoneIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  GlobeAltIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import PageHeader from '../../components/Includes/PageHeader';
import DashboardBreadCrumb from '../../components/Includes/DashboardBreadCrumb';
import { Link } from 'react-router-dom';
import ArtistProfileCard from '../../components/Artist/ArtistProfileCard';
import ArtistQuickActions from '../../components/Artist/ArtistQuickActions';
import ArtistUpcomingEvents from '../../components/Artist/ArtistUpcomingEvents';
import ArtistVenuesSection from '../../components/Artist/ArtistVenuesSection';
import ArtistPreviousEvents from '../../components/Artist/ArtistPreviousEvents';
import ArtistViewProfile from '../../components/Artist/ArtistViewProfile';
import ArtistEditForm from '../../components/Artist/ArtistEditForm';
import GallerySection from '../../components/Artist/GallerySection';
import { useProfilePicture } from '../../hooks/useProfilePicture';
import { useArtistData } from '../../hooks/useArtistData';
import { useArtistGallery } from '../../hooks/useArtistGallery';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

export default function ArtistDashboard() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [artistSettings, setArtistSettings] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const navigate = useNavigate();

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  // Custom hooks for data management
  const { artistData, loading, error, setError, updateProfilePicture } = useArtistData(userId);
  const { uploadProfilePicture, isUploading, uploadError, uploadSuccess: profileUploadSuccess } = useProfilePicture(userId, artistSettings);
  const { gallery, fetchGallery, deleteGalleryImage } = useArtistGallery(userId);

  // Additional state variables still needed
  const [artistVenues, setArtistVenues] = useState([]);
  const [artistEvents, setArtistEvents] = useState([]);
  const [artistActiveEvents, setArtistActiveEvents] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', id: 0 });
  const [progress, setProgress] = useState(0);
  const [editForm, setEditForm] = useState(null);

  const handleSaveModalProfilePicture = async (file) => {
    try {
      const result = await uploadProfilePicture(file);
      if (result.success) {
        // Update the artist data with the new profile picture
        updateProfilePicture(result.profile_picture);
        setIsProfileModalOpen(false);
        console.log('✅ Profile picture updated successfully in UI');
        // Show toast for profile picture update
        setToast({ visible: true, message: 'Profile picture updated successfully!', id: Date.now() });
      }
    } catch (error) {
      console.error("❌ Failed to upload from modal:", error);
    }
  };

  const handleGalleryUploadSuccess = () => {
    fetchGallery();
  };
  // Initialize form state when entering edit mode
  useEffect(() => {
    if (editMode) {
      setEditForm({
        stage_name: artistData?.stage_name || '',
        real_name: artistData?.real_name || '',
        genre: artistData?.genre || '',
        phone_number: artistData?.phone_number || '',
        bio: artistData?.bio || '',
        instagram: artistData?.instagram || '',
        twitter: artistData?.twitter || '',
        facebook: artistData?.facebook || '',
      });
    } else {
      setEditForm(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleFileSelection = (files) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    
    // Generate previews
    const previews = [];
    fileArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews[index] = {
          file,
          url: e.target.result,
          name: file.name,
          size: file.size
        };
        
        // Update previews when all are loaded
        if (previews.length === fileArray.length && previews.every(p => p)) {
          setFilePreviews([...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setUploadingImages(true);
    try {
      const formData = new FormData();
      
      // Add each file to FormData
      selectedFiles.forEach(file => {
        formData.append('gallery_images', file);
      });

      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.post(
        `${API_BASE_URL}/api/artists/uploadGalleryImages/${user.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for FormData - let browser set it automatically
          }
        }
      );

      if (response.status === 200) {
        // Refresh gallery immediately
        await fetchGallery();
        
        closeUploadModal();
        
        // Show success feedback
        setUploadSuccess(true);
        setToast({ visible: true, message: 'Gallery images uploaded successfully!', id: Date.now() });
        console.log('Gallery images uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  // Animate toast progress bar and auto-hide
  React.useEffect(() => {
    if (!toast.visible) return;
    // Start from full then shrink to zero
    setProgress(100);
    const start = setTimeout(() => setProgress(0), 50);
    const hide = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3050);
    return () => {
      clearTimeout(start);
      clearTimeout(hide);
    };
  }, [toast.id, toast.visible]);

  const removePreviewImage = (indexToRemove) => {
    const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    const newPreviews = filePreviews.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFiles([]);
    setFilePreviews([]);
    setUploadSuccess(false);
  };

  const handleDeleteImage = async (imagePath) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.delete(
        `${API_BASE_URL}/api/artists/galleryDelete/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { imagePath }
        }
      );

      if (response.status === 200) {
        await fetchGallery(); // Refresh gallery
        console.log('Image deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  // Fetch additional data (events, venues, gallery) when userId changes
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const token = localStorage.getItem('token'); // or wherever your token is stored
        if (!userId) return;

        const [eventsRes, activeEventsRes, venuesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/artists/events_by_artist/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/events_active_by_artist/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/venues_by_artist/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setArtistEvents(eventsRes.data);
        setArtistActiveEvents(activeEventsRes.data);
        setArtistVenues(venuesRes.data);
        
        // Fetch gallery
        await fetchGallery();
      } catch (error) {
        console.error('Error fetching additional artist data:', error);
      }
    };

    fetchAdditionalData();
  }, [userId, fetchGallery]);

  // Handle artist settings when artist data changes
  useEffect(() => {
    if (artistData && artistData.settings) {
      try {
        const parsedSettings = typeof artistData.settings === 'string'
          ? JSON.parse(artistData.settings)
          : artistData.settings;
        setArtistSettings(parsedSettings);
      } catch (error) {
        console.error("Failed to parse artist settings:", error);
      }
    }
  }, [artistData]);

  // Gallery refresh is now handled by the useArtistGallery hook


  function formatDateToDDMMYYYY(dateInput) {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //uploadProfilePic We have set up a directory structure for uploading profile pictures. The folder path is “uploads/artist/{id}_{name}”, where {id} is the artist’s unique ID, and {name} is the artist’s name. Uploaded images are stored in this directory.
  // Profile picture upload is now handled by useProfilePicture hook

  // Input change handling is now managed by the useArtistData hook
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/artists/edit/${userId}`,
        editForm || artistData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setEditMode(false);
        console.log('✅ Artist data updated successfully');
      }
    } catch (error) {
      console.error('❌ Error updating artist data:', error);
      setError('Failed to update profile');
    }
  };
  const breadcrumbs = [
    { label: 'Dashboard', path: '/artists/dashboard' },
    { label: artistData?.stage_name, path: '/artists/dashboard/profile' },
  ];

  const profilePicture = artistData.profile_picture
    ? artistData.profile_picture.replace(/^(\.\.\/frontend)/, '')
    : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader HeaderName="Artist Dashboard" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader HeaderName="Artist Dashboard" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {toast.visible && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg w-full max-w-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {toast.message}
              </p>
            </div>
          </div>
          <div className="mt-3 h-1 w-full bg-green-200/60 rounded overflow-hidden">
            <div
              key={toast.id}
              className="h-full bg-green-500"
              style={{ width: `${progress}%`, transition: 'width 3s linear' }}
            />
          </div>
        </div>
      )}
      
      <PageHeader HeaderName="Artist Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ArtistProfileCard
              artistData={artistData}
              editMode={editMode}
              onEditToggle={() => setEditMode(!editMode)}
              isProfileModalOpen={isProfileModalOpen}
              onProfileModalClose={() => setIsProfileModalOpen(false)}
              onProfileModalOpen={() => setIsProfileModalOpen(true)}
              artistSettings={artistSettings}
              onSaveProfilePicture={handleSaveModalProfilePicture}
            />

            {/* Profile Details Section */}
            {editMode ? (
              <ArtistEditForm
                artistData={editForm || {
                  stage_name: '', real_name: '', genre: '', phone_number: '', bio: '', instagram: '', twitter: '', facebook: ''
                }}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={() => setEditMode(false)}
              />
            ) : (
              <ArtistViewProfile artistData={artistData} />
            )}
            <ArtistVenuesSection venues={artistVenues} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ArtistQuickActions artistId={artistData?.userId} />
            
            {/* Compact Gallery Section */}
            <GallerySection
              gallery={gallery}
              onAddPhotos={() => setIsUploadModalOpen(true)}
              onImageClick={(index) => {
                setSelectedGalleryImage(index);
                setIsGalleryModalOpen(true);
              }}
              onDeleteImage={handleDeleteImage}
              onViewAll={() => setIsGalleryModalOpen(true)}
            />

            <ArtistUpcomingEvents events={artistActiveEvents} />

            <ArtistPreviousEvents events={artistEvents} />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload Photos</h3>
              <button
                onClick={closeUploadModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={uploadingImages}
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filePreviews.length === 0 ? (
                /* File Selection Area */
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelection(e.target.files)}
                    className="hidden"
                    id="gallery-upload"
                    disabled={uploadingImages}
                  />
                  <label htmlFor="gallery-upload" className="cursor-pointer">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-indigo-600">Click to select photos</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                  </label>
                </div>
              ) : (
                /* File Previews */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Selected Photos ({filePreviews.length})
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedFiles([]);
                        setFilePreviews([]);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                      disabled={uploadingImages}
                    >
                      Clear all
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removePreviewImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          disabled={uploadingImages}
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                        
                        {/* File info */}
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 truncate" title={preview.name}>
                            {preview.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(preview.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add more files button */}
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-indigo-300 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files);
                        const allFiles = [...selectedFiles, ...newFiles];
                        handleFileSelection(allFiles);
                      }}
                      className="hidden"
                      id="gallery-upload-more"
                      disabled={uploadingImages}
                    />
                    <label htmlFor="gallery-upload-more" className="cursor-pointer">
                      <PlusIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Add more photos</p>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {filePreviews.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  {uploadingImages ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span className="text-sm text-gray-600">Uploading {filePreviews.length} photos...</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Ready to upload {filePreviews.length} photo{filePreviews.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={closeUploadModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={uploadingImages}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImageUpload}
                      disabled={uploadingImages || filePreviews.length === 0}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {uploadingImages ? 'Uploading...' : 'Upload Photos'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && gallery.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            
            {/* Close Button */}
            <button
              onClick={() => setIsGalleryModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedGalleryImage((prev) => (prev - 1 + gallery.length) % gallery.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedGalleryImage((prev) => (prev + 1) % gallery.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ArrowLeftIcon className="h-6 w-6 transform rotate-180" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={(gallery[selectedGalleryImage]?.url || '').startsWith('http') ? gallery[selectedGalleryImage]?.url : `${API_BASE_URL}${gallery[selectedGalleryImage]?.url || ''}`}
              alt={`Gallery ${selectedGalleryImage + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Counter */}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                {selectedGalleryImage + 1} / {gallery.length}
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={() => {
                handleDeleteImage(gallery[selectedGalleryImage]?.originalPath);
                setIsGalleryModalOpen(false);
              }}
              className="absolute bottom-4 right-4 bg-red-500 bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

}