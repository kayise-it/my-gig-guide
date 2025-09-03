import React from 'react';
import { PhotoIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';

const GallerySection = ({ 
  gallery = [], 
  onAddPhotos, 
  onImageClick, 
  onDeleteImage 
}) => {
  const hasImages = Array.isArray(gallery) && gallery.length > 0;
  const displayImages = hasImages ? gallery.slice(0, 6) : [];
  const getUrl = (img) => encodeURI(typeof img === 'string' ? img : (img?.url || ''));
  const getOriginalPath = (img) => (typeof img === 'string' ? img : (img?.originalPath || img?.url || ''));
  const remainingCount = hasImages ? Math.max(0, gallery.length - 6) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6" id="artist-gallery-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4" id="artist-gallery-header">
        <div className="flex items-center space-x-2">
          <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Gallery</h3>
          {hasImages && (
            <span className="text-xs sm:text-sm text-gray-500">({gallery.length})</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddPhotos}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Photos</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {hasImages ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3" id="artist-gallery-grid">
          {displayImages.map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100" id={`artist-gallery-item-${index+1}`}>
              <img
                src={getUrl(image)}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                onClick={() => onImageClick(index)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <PhotoIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteImage(getOriginalPath(image));
                }}
                className="absolute top-1 right-1 bg-red-500 bg-opacity-80 text-white p-1 rounded-full hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                title="Delete image"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Show remaining count overlay on last image */}
          {remainingCount > 0 && (
            <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100" id="artist-gallery-more-tile">
              <img
                src={displayImages[5] ? getUrl(displayImages[5]) : ''}
                alt="Gallery"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                onClick={() => onImageClick(5)}
              />
              
              {/* Overlay with count */}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-lg font-semibold">+{remainingCount}</div>
                  <div className="text-white text-xs">more photos</div>
                </div>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (displayImages[5]) onDeleteImage(getOriginalPath(displayImages[5]));
                }}
                className="absolute top-1 right-1 bg-red-500 bg-opacity-80 text-white p-1 rounded-full hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                title="Delete image"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h4 className="text-sm font-medium text-gray-900 mb-2">No photos yet</h4>
          <p className="text-sm text-gray-500 mb-4">
            Start building your gallery by uploading some photos
          </p>
          <button
            onClick={onAddPhotos}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Upload Photos</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
