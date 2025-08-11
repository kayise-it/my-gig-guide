import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const GalleryDisplay = ({ userId, userType = 'artists', refreshKey = 0 }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletingImage, setDeletingImage] = useState(null);

  // Function to convert relative paths to absolute URLs
  const convertToAbsoluteUrl = (relativePath) => {
    if (!relativePath) return '';
    
    console.log('Converting path:', relativePath);
    
    // If it's already an absolute URL (starts with http), return as is
    if (relativePath.startsWith('http')) {
      console.log('Already absolute URL:', relativePath);
      return relativePath;
    }
    
    // If it's a relative path, convert to absolute URL
    if (relativePath.startsWith('../frontend/public/')) {
      // Remove the ../frontend/public/ prefix and make it a web URL
      const convertedPath = relativePath.replace('../frontend/public/', '/');
      console.log('Converted from relative:', relativePath, 'to:', convertedPath);
      return convertedPath;
    }
    
    // If it starts with /, it's already a web path
    if (relativePath.startsWith('/')) {
      console.log('Already web path:', relativePath);
      return relativePath;
    }
    
    // Default case: assume it's a relative path
    const defaultPath = `/${relativePath}`;
    console.log('Default conversion:', relativePath, 'to:', defaultPath);
    return defaultPath;
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        console.log('Fetching gallery for user:', userId, 'userType:', userType);
        
        const response = await axios.get(`/api/${userType}/${userId}`);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.gallery) {
          try {
            const galleryArray = JSON.parse(response.data.gallery);
            console.log('Parsed gallery array:', galleryArray);
            // Convert all paths to absolute URLs
            const convertedGallery = galleryArray.map(convertToAbsoluteUrl);
            console.log('Converted gallery:', convertedGallery);
            setGallery(convertedGallery);
          } catch (e) {
            console.error('Error parsing gallery JSON:', e);
            setGallery([]);
          }
        } else {
          console.log('No gallery data found in response');
          setGallery([]);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        console.error('Error details:', err.response?.data);
        console.error('Error status:', err.response?.status);
        setError(`Failed to load gallery: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchGallery();
    }
  }, [userId, userType, refreshKey]);

  // Delete gallery image function
  const handleDeleteImage = async (imagePath) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setDeletingImage(imagePath);
      
      // Convert the display path back to the original database path format
      let originalPath = imagePath;
      if (imagePath.startsWith('/')) {
        // Convert /artists/... back to ../frontend/public/artists/...
        originalPath = `../frontend/public${imagePath}`;
      }
      
      console.log('Deleting image with original path:', originalPath);
      
      const response = await axios.delete(`/api/${userType}/galleryDelete/${userId}`, {
        data: { imagePath: originalPath }
      });

      console.log('Image deleted successfully:', response.data);
      
      // Remove the image from local state
      setGallery(prevGallery => prevGallery.filter(img => img !== imagePath));
      
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setDeletingImage(null);
    }
  };

  // Lightbox component with navigation
  const Lightbox = ({ image, onClose }) => {
    if (!image) return null;

    const currentIndex = gallery.findIndex(img => img === image);
    const totalImages = gallery.length;

    const goToPrevious = () => {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
      setSelectedImage(gallery[prevIndex]);
    };

    const goToNext = () => {
      const nextIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
      setSelectedImage(gallery[nextIndex]);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative max-w-4xl max-h-full p-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            title="Close (Esc)"
          >
            ×
          </button>

          {/* Previous button */}
          {totalImages > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
              title="Previous (←)"
            >
              ‹
            </button>
          )}

          {/* Next button */}
          {totalImages > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
              title="Next (→)"
            >
              ›
            </button>
          )}

          {/* Image counter */}
          {totalImages > 1 && (
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {totalImages}
            </div>
          )}

          {/* Main image */}
          <img
            src={image}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Keyboard navigation hint */}
          {totalImages > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              Use ← → arrow keys to navigate
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (gallery.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500 py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>No gallery images uploaded yet</p>
          <p className="text-sm mt-2">Click "Add Sample Gallery" to see demo images</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Gallery ({gallery.length} images)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gallery.map((imagePath, index) => (
          <div key={index} className="relative group aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer">
            <img
              src={imagePath}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Image failed to load:', imagePath);
                console.error('Error details:', e);
                // Try to load with a timestamp to bypass cache
                const timestamp = new Date().getTime();
                const newSrc = `${imagePath}?t=${timestamp}`;
                console.log('Trying with timestamp:', newSrc);
                e.target.src = newSrc;
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', imagePath);
              }}
              onClick={() => setSelectedImage(imagePath)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded-full transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(imagePath);
                  }}
                  title="View image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded-full transition-opacity duration-200 ${
                    deletingImage === imagePath 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (deletingImage !== imagePath) {
                      handleDeleteImage(imagePath);
                    }
                  }}
                  disabled={deletingImage === imagePath}
                  title={deletingImage === imagePath ? "Deleting..." : "Delete image"}
                >
                  {deletingImage === imagePath ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default GalleryDisplay;
