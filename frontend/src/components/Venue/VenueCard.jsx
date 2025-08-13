import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';

const VenueCard = ({ venue, who }) => {
  // Determine the correct route based on who
  const getVenueRoute = () => {
    if (who === 'artists') {
      return `/artists/dashboard/venue/${venue.id}`;
    } else if (who === 'organiser') {
      return `/organiser/dashboard/venues/${venue.id}`;
    } else {
      return `/venue/${venue.id}`; // public venue route
    }
  };

  return (
    <Link 
      to={getVenueRoute()}
      className="group block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      {/* Image with gradient overlay */}
      <div 
        className="relative aspect-[4/3] bg-gray-100 transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: venue.main_picture 
            ? `url(${venue.main_picture})` 
            : 'linear-gradient(135deg, rgb(238 242 255) 0%, rgb(250 245 255) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {!venue.main_picture && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <MapPinIcon className="h-8 w-8 text-white" />
            </div>
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
          <MapPinIcon className="flex-shrink-0 h-4 w-4 mr-1 text-purple-500" />
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