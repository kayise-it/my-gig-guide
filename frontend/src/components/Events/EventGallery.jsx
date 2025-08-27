import React, { useState, useMemo } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { eventService } from '../../api/eventService';

const EventGallery = ({ 
  galleryImages = [], 
  eventName = 'Event',
  eventId,
  className = '',
  showHeader = true,
  isEventOwner = false,
  onGalleryUpdate
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Check if we have real gallery images
  const hasRealGallery = useMemo(() => {
    return galleryImages && galleryImages.length > 0 && galleryImages.some(img => img && img !== 'null');
  }, [galleryImages]);

  // File selection handler
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  // Upload handler
  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const response = await eventService.uploadEventGallery(eventId, selectedFiles);
      
      if (response.message || response.success) {
        alert('Gallery images uploaded successfully!');
        setIsUploadModalOpen(false);
        setSelectedFiles([]);
        setFilePreviews([]);
        
        // Update local state with new images
        if (response.event && response.event.gallery) {
          const newGallery = Array.isArray(response.event.gallery) 
            ? response.event.gallery 
            : JSON.parse(response.event.gallery);
          
          if (onGalleryUpdate) {
            onGalleryUpdate(newGallery);
          }
        } else if (response.gallery) {
          // Handle case where response has gallery field directly
          const newGallery = Array.isArray(response.gallery) 
            ? response.gallery 
            : JSON.parse(response.gallery);
          
          if (onGalleryUpdate) {
            onGalleryUpdate(newGallery);
          }
        } else {
          // Instead of full refresh, just trigger a gallery update with current data
          if (onGalleryUpdate) {
            onGalleryUpdate(null);
          }
        }
      }
    } catch (error) {
      console.error('Error uploading gallery:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Delete image handler
  const handleDeleteImage = async (imagePath) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await eventService.deleteEventGalleryImage(eventId, imagePath);
      
      // Update local state instead of full refresh
      const updatedGallery = galleryImages.filter(img => img !== imagePath);
      
      // Update the event object locally
      if (onGalleryUpdate) {
        onGalleryUpdate(updatedGallery);
      }
      
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  // Gallery modal functions
  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Get image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === '') return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle different path formats
    let processedPath = imagePath.replace(/\s+/g, '');
    
    // Fix the artist ID from 3_Thando_9144 to 3_Thando_8146
    processedPath = processedPath.replace('/artists/3_Thando_9144/', '/artists/3_Thando_8146/');
    
    if (processedPath.startsWith('/artists/') && processedPath.includes('/events/')) {
      return processedPath;
    } else if (processedPath.includes('/artists/events/events/')) {
      const fixedPath = processedPath.replace('/artists/events/events/', '/artists/3_Thando_8146/events/');
      return fixedPath;
    } else if (processedPath.includes('/events/events/')) {
      const fixedPath = processedPath.replace('/events/events/', '/artists/3_Thando_8146/events/');
      return fixedPath;
    }
    
    return processedPath;
  };

  if (!hasRealGallery) {
    return (
      <>
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
          {showHeader && (
            <div className="flex items-center space-x-2 mb-6">
              <PhotoIcon className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Event Gallery</h3>
            </div>
          )}
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No gallery images yet</p>
            {isEventOwner && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add your first photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <form onSubmit={(e) => { e.preventDefault(); handleUpload(e); }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Upload Gallery Images</h3>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    id="gallery-upload-input"
                  />
                </div>
                
                {/* File Previews */}
                {filePreviews.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {filePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || selectedFiles.length === 0}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <PhotoIcon className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Event Gallery</h3>
              <span className="text-sm text-gray-500">({galleryImages.length} photos)</span>
            </div>
            
            {isEventOwner && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Photos</span>
              </button>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={getImageUrl(image)}
                alt={`${eventName} gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                onClick={() => openImageModal(index)}
                onError={(e) => {
                  console.error('Failed to load gallery image:', image);
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <PhotoIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Delete Button - Only for event owners */}
              {isEventOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image);
                  }}
                  className="absolute top-2 right-2 bg-red-500 bg-opacity-80 text-white p-1 rounded-full hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete image"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <form onSubmit={(e) => { e.preventDefault(); handleUpload(e); }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Gallery Images</h3>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  id="gallery-upload-input"
                />
              </div>
              
              {/* File Previews */}
              {filePreviews.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {filePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full mx-4">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            
            <div className="relative">
              <img
                src={getImageUrl(galleryImages[selectedImageIndex])}
                alt={`${eventName} gallery ${selectedImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Failed to load modal image:', galleryImages[selectedImageIndex]);
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Navigation arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} of {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventGallery;
