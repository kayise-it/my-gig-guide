import React from 'react';
import { MapPinIcon, UsersIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const VenueCardV2 = ({ venue, showActions = true, showStats = true, className = '' }) => {
    if (!venue) return null;

    // Construct the correct image URL
    const imageUrl = React.useMemo(() => {
        if (!venue.main_picture) return null;
        return venue.main_picture.startsWith('http') 
                    ? venue.main_picture
        : venue.main_picture;
    }, [venue.main_picture]);

    return (
        <div className={`group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 ${className}`}>
            {/* Image Container with Full Height */}
            <div className="relative h-96 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={venue.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            console.error('Failed to load venue image:', imageUrl);
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                            <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No venue photo</p>
                        </div>
                    </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                {/* Text Overlay - Always Visible */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="space-y-3">
                        {/* Venue Name */}
                        <h3 className="text-2xl font-bold tracking-tight group-hover:text-purple-200 transition-colors duration-300">
                            {venue.name}
                        </h3>
                        
                        {/* Address */}
                        <div className="flex items-center space-x-2 text-sm text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
                            <MapPinIcon className="h-4 w-4 text-purple-300" />
                            <span className="line-clamp-2">{venue.address}</span>
                        </div>
                        
                        {/* Capacity */}
                        {venue.capacity && (
                            <div className="flex items-center space-x-2 text-sm text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
                                <UsersIcon className="h-4 w-4 text-blue-300" />
                                <span>{venue.capacity} max capacity</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {showActions && (
                            <Link
                                to={`/venue/${venue.id}`}
                                className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                <EyeIcon className="h-5 w-5" />
                                <span>View Details</span>
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* Additional Content on Hover */}
                <div className="absolute top-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="space-y-3">
                        {/* Stats Row */}
                        {showStats && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm">
                                    {venue.rating && (
                                        <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-yellow-400">★</span>
                                            <span>{venue.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    {venue.review_count && (
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                            {venue.review_count} reviews
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Description */}
                        {venue.description && (
                            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg">
                                <p className="text-sm line-clamp-3 text-gray-200">
                                    {venue.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueCardV2;
