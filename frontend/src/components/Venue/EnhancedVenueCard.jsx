import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, UsersIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const EnhancedVenueCard = ({ venue, className = '', showActions = true, showStats = true }) => {
    const imageUrl = React.useMemo(() => {
        if (!venue.main_picture) return null;
        return venue.main_picture.startsWith('http') 
                    ? venue.main_picture
        : venue.main_picture;
    }, [venue.main_picture]);

    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-all duration-300 ${className}`}>
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-50 to-blue-50">
                {imageUrl ? (
                    <>
                        <img 
                            src={imageUrl}
                            alt={venue.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent"></div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                        <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                            <BuildingOfficeIcon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                )}

                {/* Rating Badge */}
                {venue.rating && (
                    <div className="absolute top-2 left-2 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
                        <StarIcon className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs font-semibold text-gray-900">{venue.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{venue.name}</h3>
                    {showActions && (
                        <Link
                            to={`/venue/${venue.id}`}
                            className="bg-purple-100 text-purple-600 hover:bg-purple-200 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 flex-shrink-0 ml-2"
                        >
                            View
                        </Link>
                    )}
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 text-purple-500 mr-1.5" />
                    <span className="text-xs truncate">{venue.address || 'Location not specified'}</span>
                </div>

                {showStats && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        {venue.capacity && (
                            <div className="flex items-center text-gray-600">
                                <UsersIcon className="h-3 w-3 text-purple-500 mr-1" />
                                <span className="text-xs">{venue.capacity} max</span>
                            </div>
                        )}
                        
                        {venue.events_count !== undefined && (
                            <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-3 w-3 text-purple-500 mr-1" />
                                <span className="text-xs">{venue.events_count} events</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedVenueCard;
