import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';

const VenueCard = ({ venue, who }) => {
  return (
    <Link 
      to={`/${who}/venues/${venue.id}`}
      className="group block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      {/* Image with gradient overlay */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
            <MapPinIcon className="h-12 w-12 text-indigo-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
        
        {/* Rating badge */}
        {venue.rating && (
          <div className="absolute top-3 left-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-xs font-medium">{venue.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Venue info */}
      <div className="p-4 bg-white">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate">{venue.name}</h3>
          {venue.price && (
            <span className="text-sm font-medium text-gray-900">
              R{venue.price}/hr
            </span>
          )}
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPinIcon className="flex-shrink-0 h-4 w-4 mr-1" />
          <span className="truncate">{venue.location || 'Location not specified'}</span>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          {venue.capacity && (
            <span className="flex items-center">
              <UsersIcon className="h-3.5 w-3.5 mr-1" />
              {venue.capacity} max
            </span>
          )}
          
          {venue.events_count && (
            <span className="flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {venue.events_count} events
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;