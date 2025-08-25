import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../api/config';

const EventCard = ({ event, navigate }) => {
  // Helper function to fix poster URLs
  const fixPosterUrl = (posterPath) => {
    if (!posterPath || posterPath === 'null' || posterPath === '') return null;
    
    let cleanPath = posterPath.replace(/\s+/g, '');
    
    // Fix common path issues
    cleanPath = cleanPath.replace('/artists/3_Thando_9144/', '/artists/3_Thando_8146/');
    cleanPath = cleanPath.replace('/events/event_poster/', '/events/1_kamal_lamb/event_poster/');
    
    // Remove API prefix if present
    cleanPath = cleanPath.replace('/api/artists/', '/artists/');
    
    // Fix double events path
    cleanPath = cleanPath.replace('/events/events/', '/events/');
    
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    return cleanPath;
  };

  const posterUrl = fixPosterUrl(event.poster);
  const eventDate = new Date(event.date);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-[350px] group"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Background Image */}
      <div className="relative h-56 overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl.startsWith('http') ? posterUrl : `${API_BASE_URL}${posterUrl}`}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              console.warn('Failed to load image:', posterUrl);
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(to bottom right, #6366f1, #8b5cf6, #ec4899)';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">No Image</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-2 left-2">
          <div className={`px-2 py-1 rounded-md font-bold text-xs backdrop-blur-sm border ${
            event.price === 0 
              ? 'bg-emerald-500/90 text-white border-emerald-300/50' 
              : 'bg-purple-500/90 text-white border-purple-300/50'
          }`}>
            {event.price === 0 ? 'FREE' : `R${event.price}`}
          </div>
        </div>

        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-2 right-2">
            <span className="bg-gray-800/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold border border-gray-600/50 capitalize">
              {event.category}
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i} 
                className={`h-2.5 w-2.5 ${i < event.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-xs text-gray-700 font-medium ml-0.5">{event.rating}.0</span>
          </div>
        </div>
      </div>

      {/* Event Details - Compact */}
      <div className="p-3 flex flex-col justify-between h-full">
        {/* Event Name */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-purple-600 transition-colors duration-300">
          {event.name}
        </h3>

        {/* Event Info - Compact */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <CalendarIcon className="h-3 w-3 text-purple-500" />
            <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <ClockIcon className="h-3 w-3 text-blue-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPinIcon className="h-3 w-3 text-pink-500" />
            <span className="truncate">{event.venue?.name || 'TBD'}</span>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">
            {event.attendees} attending
          </span>
          <button className="text-purple-600 hover:text-purple-800 font-semibold text-xs transition-colors duration-300">
            View →
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
