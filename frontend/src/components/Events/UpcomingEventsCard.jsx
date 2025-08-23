import { useState } from 'react';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../api/config';

export default function UpcomingEventsCard({ event, onLike, onFavorite, isLiked, isFavorited }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  // Helper function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === '') return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Convert relative file system paths to web URLs
    let cleanPath = imagePath;
    if (cleanPath.startsWith('../frontend/public/')) {
      // Remove the ../frontend/public/ prefix and make it a web URL
      cleanPath = cleanPath.replace('../frontend/public/', '/');
    }
    
    // If it starts with /, it's already a web path
    if (cleanPath.startsWith('/')) {
      return cleanPath;
    }
    
    // Default case: assume it's a relative path and add leading slash
    return `/${cleanPath}`;
  };

  const imageUrl = getImageUrl(event.poster);
  
  // Format date
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Calculate days until event
  const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageError && imageUrl ? (
          <img 
            src={imageUrl} 
            alt={event.name}
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
                <CalendarDaysIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-xs text-gray-500 font-medium">No Image</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {/* Days Until Badge */}
          {daysUntil > 0 && (
            <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>{daysUntil} days</span>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
            {event.price && event.price > 0 ? `R${event.price}` : 'FREE'}
          </div>
        </div>

        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center space-x-1">
              <SparklesIcon className="h-3 w-3" />
              <span>{event.category}</span>
            </div>
          </div>
        )}

        {/* Bottom Info Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-2'
        }`}>
          <div className="text-white">
            <h3 className="font-bold text-sm mb-2 line-clamp-2">{event.name}</h3>
            <div className="flex items-center justify-between text-xs opacity-90">
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="h-3 w-3" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-3 w-3" />
                <span>{event.time}</span>
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
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.name}</h3>
              <p className="text-sm opacity-90 mb-4">
                {event.description ? event.description.substring(0, 100) + '...' : 'Join us for an amazing event!'}
              </p>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span className="text-sm">{eventDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-sm">{event.time}</span>
                </div>
              </div>
              <Link
                to={`/events/${event.id}`}
                className="inline-flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                <span>View Event</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 line-clamp-1">{event.name}</h3>
          <div className="text-sm text-gray-500">
            {event.price && event.price > 0 ? `R${event.price}` : 'FREE'}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <CalendarDaysIcon className="h-3 w-3" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3" />
              <span>{event.time}</span>
            </div>
          </div>
          {event.venue && (
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-3 w-3" />
              <span className="truncate max-w-20">{event.venue.name}</span>
            </div>
          )}
        </div>
        
        {event.category && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              <SparklesIcon className="h-3 w-3 mr-1" />
              {event.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
