import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, UsersIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const EnhancedVenueCard = ({ venue, className = '', showActions = true, showStats = true }) => {
    const imageUrl = React.useMemo(() => {
        if (!venue.main_picture) return null;
        return venue.main_picture.startsWith('http') 
            ? venue.main_picture 
            : `http://localhost:5173${venue.main_picture}`;
    }, [venue.main_picture]);

    return (
        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-all duration-300 ${className}`}>
            {/* Image Section */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-purple-50 to-blue-50">
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
                        <div className="p-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                            <BuildingOfficeIcon className="h-12 w-12 text-white" />
                        </div>
                    </div>
                )}

                {/* Rating Badge */}
                {venue.rating && (
                    <div className="absolute top-3 left-3 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1.5" />
                        <span className="text-sm font-semibold text-gray-900">{venue.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{venue.name}</h3>
                    {showActions && (
                        <Link
                            to={`/venue/${venue.id}`}
                            className="bg-purple-100 text-purple-600 hover:bg-purple-200 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300"
                        >
                            View Details
                        </Link>
                    )}
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm truncate">{venue.address || 'Location not specified'}</span>
                </div>

                {showStats && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        {venue.capacity && (
                            <div className="flex items-center text-gray-600">
                                <UsersIcon className="h-4 w-4 text-purple-500 mr-1.5" />
                                <span className="text-sm">{venue.capacity} max</span>
                            </div>
                        )}
                        
                        {venue.events_count !== undefined && (
                            <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-4 w-4 text-purple-500 mr-1.5" />
                                <span className="text-sm">{venue.events_count} events</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedVenueCard;
