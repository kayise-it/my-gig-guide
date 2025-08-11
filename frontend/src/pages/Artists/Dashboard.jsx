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
import axios from 'axios';
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
import API_BASE_URL from '../../api/config';
import { artistService } from '../../api/artistService';

export default function ArtistDashboard() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [artistSettings, setArtistSettings] = useState({});
  const [state, setState] = useState({
    isProfileModalOpen: false,
    artistData: null,
    artistEvents: [],
    artistActiveEvents: [],
    artistVenues: [],
    loading: true,
    error: null,
    editMode: false
  });
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
  const [artistEvents, setArtistEvents] = useState([]);
  const [artistActiveEvents, setArtistActiveEvents] = useState([]);
  const [artistVenues, setArtistVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);
  const [gallery, setGallery] = useState([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const navigate = useNavigate();

  const handleSaveModalProfilePicture = async (file) => {
    try {
      await handleProfilePicUpload(file);
      setIsProfileModalOpen(false); // Close modal on successful upload
    } catch (error) {
      // Error is already logged by handleProfilePicUpload
      // You might want to show a notification to the user here
      console.error("Failed to upload from modal:", error);
    }
  };

  const handleGalleryUploadSuccess = () => {
    // Increment the refresh key to trigger GalleryDisplay to refetch data
    setGalleryRefreshKey(prev => prev + 1);
    fetchGallery();
  };

  // Gallery management functions
  const fetchGallery = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${API_BASE_URL}/api/artists/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.gallery) {
        const galleryImages = JSON.parse(response.data.gallery);
        setGallery(galleryImages.map(img => ({
          url: img.startsWith('../frontend/public/') ? img.replace('../frontend/public/', '/') : img,
          originalPath: img
        })));
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGallery([]);
    }
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
        await fetchGallery(); // Refresh gallery
        closeUploadModal();
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

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
  };

  const handleDeleteImage = async (imagePath) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.delete(
        `${API_BASE_URL}/api/artists/deleteGalleryImage/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { imagePath }
        }
      );

      if (response.status === 200) {
        await fetchGallery(); // Refresh gallery
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token'); // or wherever your token is stored
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not found');

        const [artistRes, eventsRes, activeEventsRes, venuesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/artists/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/events_by_artist/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/events_active_by_artist/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/artists/venues_by_artist/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const artist = artistRes.data;
        if (artist.settings) {
          try {
            const parsedSettings = typeof artist.settings === 'string'
              ? JSON.parse(artist.settings)
              : artist.settings;

            setArtistSettings(parsedSettings);
          } catch (error) {
            console.error("Failed to parse artist settings:", error);
          }
        }


        setArtistData(artist);
        setArtistEvents(eventsRes.data);
        setArtistActiveEvents(activeEventsRes.data);
        setArtistVenues(venuesRes.data);
        
        // Fetch gallery
        await fetchGallery();
      } catch (error) {
        console.error('Error fetching Artist data dashboard:', error);
        const serverMessage = error?.response?.data?.message || error.message || 'Unknown error';
        setError(`Failed to load data: ${serverMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  function formatDateToDDMMYYYY(dateInput) {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //uploadProfilePic We have set up a directory structure for uploading profile pictures. The folder path is “uploads/artist/{id}_{name}”, where {id} is the artist’s unique ID, and {name} is the artist’s name. Uploaded images are stored in this directory.
  const handleProfilePicUpload = async (imageFile) => {
    try {
      const formData = new FormData();

      formData.append("profile_picture", imageFile); // ✅ Use the actual file object
      formData.append("setting_name", artistSettings.setting_name);
      formData.append("path", artistSettings.path);
      formData.append("folder_name", artistSettings.folder_name);
      formData.append("propic", artistSettings.setting_name);

      const response = await axios.put(
        `${API_BASE_URL}/api/artists/uploadprofilepicture/${artistData.userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log("Upload response:", response.data);

      // ✅ Update artistData with new profile picture (this triggers re-render)
      if (response.status === 200) {
        setArtistData((prev) => ({
          ...prev,
          profile_picture: response.data.path
        }));
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;

      const response = artistService.updateArtist(userId, artistData);

      if (response.status === 200) {
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating artist data:', error);
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
                artistData={artistData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={() => setState(prev => ({ ...prev, editMode: false }))}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Add Photos
                  </button>
                </div>

                {gallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.slice(0, 6).map((image, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                          onClick={() => {
                            setSelectedGalleryImage(index);
                            setIsGalleryModalOpen(true);
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <PhotoIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No photos yet</p>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="mt-2 text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      Upload first photo
                    </button>
                  </div>
                )}
                
                {gallery.length > 6 && (
                  <button
                    onClick={() => setIsGalleryModalOpen(true)}
                    className="w-full mt-3 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View all {gallery.length} photos
                  </button>
                )}
              </div>
            </div>

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
              src={gallery[selectedGalleryImage]?.url}
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