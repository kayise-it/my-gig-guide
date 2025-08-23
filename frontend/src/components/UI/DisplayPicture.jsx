import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../api/config';

const DisplayPicture = ({ 
  imagePath, 
  alt = 'Image', 
  fallbackIcon = PhotoIcon,
  fallbackText = 'No Image',
  className = '',
  containerClassName = '',
  size = 'medium', // 'small', 'medium', 'large', 'custom'
  onClick,
  showOverlay = false,
  overlayText,
  id,
  ...props 
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
    custom: ''
  };
  // Get the correct image URL
  const getImageUrl = (path) => {
    if (!path || path === 'null' || path === '') return null;
    
    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // Remove "../frontend/public" if present
    let cleanPath = path;
    if (cleanPath.startsWith('../frontend/public')) {
      cleanPath = cleanPath.replace('../frontend/public', '');
    }
    
    // If it starts with a slash, it's a relative path
    if (cleanPath.startsWith('/')) {
      return `${API_BASE_URL}${cleanPath}`;
    }
    
    // Otherwise, assume it's a relative path and add the base URL
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const imageUrl = getImageUrl(imagePath);
  const IconComponent = fallbackIcon;

  const handleImageError = (e) => {
    console.error('Failed to load image:', imagePath);
    e.target.style.display = 'none';
  };

  const handleImageLoad = (e) => {
    e.target.style.display = 'block';
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${containerClassName} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      id={id}
      {...props}
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={alt}
            className={`w-full h-full object-cover rounded-xl shadow-lg border-2 border-purple-100 ${className}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          
          {/* Overlay for hover effects or additional info */}
          {showOverlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl uu"></div>
          )}
          
          {/* Custom overlay text */}
          {overlayText && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded text-center">
              {overlayText}
            </div>
          )}
        </>
      ) : (
        <div className={`w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center rounded-xl shadow-lg border-2 border-purple-100 ${className}`}>
          <div className="text-center">
            <IconComponent className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-600 font-medium text-sm">{fallbackText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPicture;
