import { useState } from 'react';
import { 
  HeartIcon, 
  StarIcon, 
  MapPinIcon, 
  UsersIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../../api/config';

export default function ArtistCard({ artist, onLike, onFavorite, isLiked, isFavorited }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);
  
  const handleCardClick = () => {
    window.location.href = `/Artists/${artist.id}`;
  };

  // Get the correct image URL from profile_picture or image_url
  const getImageUrl = (artist) => {
    const imagePath = artist.profile_picture || artist.image_url;
    if (!imagePath || imagePath === 'null' || imagePath === '') return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove "../frontend/public" if present and add API base URL
    let cleanPath = imagePath;
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

  const imageUrl = getImageUrl(artist);

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageError && imageUrl ? (
          <img 
            src={imageUrl} 
            alt={artist.stage_name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">
                  {artist.stage_name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">No Image</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Top Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(artist.id);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-sm"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.(artist.id);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-sm"
          >
            {isFavorited ? (
              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Popularity Badge */}
        <div className="absolute top-3 left-3">
          <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Live</span>
          </div>
        </div>

        {/* Always Visible Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="text-white">
            <h3 className="font-bold text-sm mb-2 line-clamp-1">{artist.stage_name}</h3>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                {artist.genre || artist.artist_type}
              </span>
              <div className="flex items-center space-x-1 text-xs opacity-90">
                <UsersIcon className="h-3 w-3" />
                <span>1.2k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Content Overlay */}
        <div className={`absolute inset-0 bg-black/60 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">{artist.stage_name}</h3>
              <p className="text-sm opacity-90 mb-4 line-clamp-3">
                {artist.bio || 'Professional artist with amazing performances'}
              </p>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">Available</span>
                </div>
              </div>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <PlayIcon className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>


    </div>
  );
}
