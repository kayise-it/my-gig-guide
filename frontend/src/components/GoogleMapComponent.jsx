import React from 'react';
import { MapPinIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const GoogleMapComponent = ({ venue, className = "" }) => {
    // Generate Google Maps URL for embedding
    const getGoogleMapsEmbedUrl = (address) => {
        if (!address) return null;
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}&zoom=15&maptype=roadmap`;
    };

    // Generate Google Maps directions URL
    const getDirectionsUrl = (address) => {
        if (!address) return null;
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    };

    const embedUrl = getGoogleMapsEmbedUrl(venue?.address);
    const directionsUrl = getDirectionsUrl(venue?.address);

    if (!venue || !venue.address) {
        return (
            <div className={`bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8 text-center ${className}`}>
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Location TBA</h3>
                <p className="text-gray-600">Venue details will be announced soon</p>
            </div>
        );
    }

    // For now, we'll show a styled placeholder since we need a Google Maps API key
    // You can replace this with the actual Google Maps embed when you have the API key
    return (
        <div className={`bg-white border border-blue-200 rounded-2xl shadow-lg overflow-hidden ${className}`}>
            {/* Map Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <h3 className="text-xl font-bold flex items-center">
                    <MapPinIcon className="h-6 w-6 mr-2" />
                    Event Location Map
                </h3>
            </div>
            
            {/* Map Container */}
            <div className="relative h-80">
                {/* 
                    Replace this section with actual Google Maps when you have API key:
                    
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map showing ${venue.name}`}
                    ></iframe>
                */}
                
                {/* Styled Map Placeholder */}
                <div className="relative h-full bg-gradient-to-br from-blue-100 via-purple-50 to-blue-100 overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 opacity-20">
                            <div className="grid grid-cols-12 grid-rows-8 h-full">
                                {Array.from({ length: 96 }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="border border-blue-300/50 hover:bg-blue-200/30 transition-all duration-300"
                                        style={{
                                            animationDelay: `${i * 0.1}s`
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Center Pin and Venue Info */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200/50 max-w-sm mx-4">
                            {/* Animated Pin */}
                            <div className="relative mb-4">
                                <div className="absolute -inset-6 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative">
                                    <MapPinIcon className="h-16 w-16 text-red-500 mx-auto drop-shadow-lg animate-bounce" />
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                                </div>
                            </div>
                            
                            {/* Venue Details */}
                            <h4 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h4>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{venue.address}</p>
                            
                            {/* Google Maps Integration Notice */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
                                📍 Interactive Map Ready
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-4">
                                Add your Google Maps API key to enable interactive map
                            </p>
                            
                            {/* Directions Button */}
                            {directionsUrl && (
                                <a
                                    href={directionsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md text-sm"
                                >
                                    <MapPinIcon className="h-4 w-4 mr-2" />
                                    <span>Get Directions</span>
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
                                </a>
                            )}
                        </div>
                    </div>
                    
                    {/* Corner Decorative Elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg"></div>
                </div>
            </div>
            
            {/* Map Footer with Quick Actions */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-t border-purple-100">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">📍 Pinned Location</span>
                    </div>
                    <div className="flex space-x-2">
                        {directionsUrl && (
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 text-purple-700 px-3 py-1 rounded-full transition-all duration-300 hover:scale-105"
                            >
                                Directions
                            </a>
                        )}
                        <button className="text-xs bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-blue-700 px-3 py-1 rounded-full transition-all duration-300 hover:scale-105">
                            Share Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleMapComponent;
