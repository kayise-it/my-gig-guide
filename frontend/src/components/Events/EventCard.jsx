import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../api/config';

const EventCard = ({ event, navigate }) => {
  /**
   * Cleans and normalizes a poster path for an event.
   * Accepts optional path correction rules as an array of {from, to} objects.
   * 
   * @param {string} posterPath - The original poster path.
   * @param {Array<{from: string|RegExp, to: string}>} [corrections=[]] - Optional path correction rules.
   * @returns {string|null} - The cleaned path or null if invalid.
   */
  const fixPosterUrl = (posterPath, corrections = []) => {
    if (!posterPath || posterPath === 'null' || posterPath === '') return null;

    let cleanPath = posterPath.replace(/\s+/g, '');

    // Apply custom correction rules if provided
    if (Array.isArray(corrections) && corrections.length > 0) {
      corrections.forEach(({ from, to }) => {
        cleanPath = cleanPath.replace(from, to);
      });
    }

    // Default corrections (can be overridden by passing your own corrections)
    const defaultCorrections = [
      { from: /\/api\/artists\//g, to: '/artists/' },
      { from: /\/events\/events\//g, to: '/events/' }
    ];
    defaultCorrections.forEach(({ from, to }) => {
      cleanPath = cleanPath.replace(from, to);
    });

    // Ensure path starts with a slash
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    return cleanPath;
  };

  const posterUrl = fixPosterUrl(event.poster);
  const eventDate = new Date(event.date);

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 group h-[350px]"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Image layer */}
      {posterUrl ? (
        <img
          src={posterUrl.startsWith('http') ? posterUrl : `${API_BASE_URL}${posterUrl}`}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            console.warn('Failed to load image:', posterUrl);
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(to bottom right, #6366f1, #8b5cf6, #ec4899)';
          }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
      )}

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* Top badges */}
        <div className="flex items-start justify-between">
          <div className={`px-2 py-1 rounded-md font-bold text-xs backdrop-blur-sm border ${
            event.price === 0 
              ? 'bg-emerald-500/90 text-white border-emerald-300/50' 
              : 'bg-purple-500/90 text-white border-purple-300/50'
          }`}>
            {event.price === 0 ? 'FREE' : `R${event.price}`}
          </div>

          {event.category && (
            <span className="bg-gray-900/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold border border-gray-700/50 capitalize">
              {event.category}
            </span>
          )}
        </div>

        {/* Bottom section with rating + text */}
        <div>
          {/* Rating */}
          <div className="mb-2 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i} 
                className={`h-3 w-3 ${i < event.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-xs text-gray-700 font-medium ml-0.5">{event.rating}.0</span>
          </div>

          {/* Title */}
          <h3 className="text-white text-lg md:text-xl font-bold leading-tight line-clamp-2 mb-1 group-hover:text-purple-200 transition-colors duration-300">
            {event.name}
          </h3>

          {/* Meta */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <CalendarIcon className="h-3.5 w-3.5 text-purple-300" />
              <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <ClockIcon className="h-3.5 w-3.5 text-blue-300" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <MapPinIcon className="h-3.5 w-3.5 text-pink-300" />
              <span className="truncate">{event.venue?.name || 'TBD'}</span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-white/80 font-medium">
              {event.attendees} attending
            </span>
            <span className="text-gray-800 text-xs font-semibold bg-white/90 hover:bg-white px-2.5 py-1 rounded-md backdrop-blur-sm transition-colors duration-300">
              View →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
