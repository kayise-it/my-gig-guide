import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { MapPinIcon, CalendarDaysIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '16px',
};

// Static libraries array to prevent reloading
const libraries = ['places'];

function LiveEventsMap({ events = [] }) {
  const { isLoaded, loadError, apiKey } = useGoogleMaps();
  const [center, setCenter] = useState({ lat: -26.1550, lng: 28.0595 });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapError, setMapError] = useState(loadError);

  // Helper function to format event date
  const formatEventDate = (eventDate) => {
    try {
      const date = new Date(eventDate);
      if (isNaN(date.getTime())) return 'Date TBD';
      
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays < 7) return `In ${diffDays} days`;
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting event date:', error);
      return 'Date TBD';
    }
  };

  // Filter events that have venue coordinates (memoized to prevent infinite loops)
  const eventsWithCoordinates = useMemo(() => {
    try {
      return events.filter(event => 
        event && 
        event.venue && 
        event.venue.latitude && 
        event.venue.longitude &&
        !isNaN(parseFloat(event.venue.latitude)) && 
        !isNaN(parseFloat(event.venue.longitude))
      );
    } catch (error) {
      console.error('Error filtering events with coordinates:', error);
      return [];
    }
  }, [events]);

  // Calculate optimal zoom level (memoized)
  const optimalZoom = useMemo(() => {
    try {
      if (eventsWithCoordinates.length === 0) return 12;
      if (eventsWithCoordinates.length === 1) return 14;
      
      // Calculate the spread of venues
      const lats = eventsWithCoordinates.map(event => parseFloat(event.venue.latitude));
      const lngs = eventsWithCoordinates.map(event => parseFloat(event.venue.longitude));
      
      const latSpread = Math.max(...lats) - Math.min(...lats);
      const lngSpread = Math.max(...lngs) - Math.min(...lngs);
      const maxSpread = Math.max(latSpread, lngSpread);
      
      // Return zoom level based on spread
      if (maxSpread > 1) return 8;      // Very spread out
      if (maxSpread > 0.5) return 9;    // Spread out
      if (maxSpread > 0.1) return 10;   // Medium spread
      if (maxSpread > 0.05) return 11;  // Close together
      return 12;                        // Very close together
    } catch (error) {
      console.error('Error calculating optimal zoom:', error);
      return 12;
    }
  }, [eventsWithCoordinates]);

  // Calculate center based on venue locations
  useEffect(() => {
    try {
      if (eventsWithCoordinates.length > 0) {
        // Calculate average center of all venue locations
        const totalLat = eventsWithCoordinates.reduce((sum, event) => 
          sum + parseFloat(event.venue.latitude), 0
        );
        const totalLng = eventsWithCoordinates.reduce((sum, event) => 
          sum + parseFloat(event.venue.longitude), 0
        );
        
        const avgLat = totalLat / eventsWithCoordinates.length;
        const avgLng = totalLng / eventsWithCoordinates.length;
        
        setCenter({ lat: avgLat, lng: avgLng });
      } else {
        // If no events with coordinates, use a default location (Johannesburg)
        setCenter({ lat: -26.1550, lng: 28.0595 });
      }
    } catch (error) {
      console.error('Error calculating center:', error);
      setCenter({ lat: -26.1550, lng: 28.0595 });
    }
  }, [eventsWithCoordinates]);

  // Get user location only when user interacts with the map
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Don't set user location if geolocation fails
        }
      );
    }
  }, [userLocation]);

  const onLoad = useCallback(() => {
    setMapError(null);
  }, []);

  const onUnmount = useCallback(() => {
    // Cleanup if needed
  }, []);

  const onError = useCallback((error) => {
    console.error('Google Maps error:', error);
    setMapError('Failed to load map. Please check your internet connection.');
  }, []);

  // Check if API key is available
  const hasValidApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && apiKey !== 'YOUR_API_KEY_HERE';

  // Show error state if map failed to load
  if (mapError) {
    return (
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-sm border border-purple-100 relative bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">{mapError}</p>
          <button
            onClick={() => setMapError(null)}
            className="mt-2 text-purple-600 hover:text-purple-700 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Show no events state if no events with coordinates
  if (eventsWithCoordinates.length === 0) {
    return (
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-sm border border-purple-100 relative bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">No upcoming events found</p>
          <p className="text-gray-500 text-sm">Check back later for new events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-sm border border-purple-100 relative">
      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Map Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded mr-2 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="1" fill="#ffffff"/>
                <rect x="3" y="2" width="18" height="4" fill="#ffffff"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="#7c3aed" strokeWidth="1"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="#7c3aed" strokeWidth="1"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#7c3aed" strokeWidth="1"/>
                <circle cx="12" cy="15" r="1" fill="#7c3aed"/>
              </svg>
            </div>
            <span className="text-xs text-gray-700">Event Venues ({eventsWithCoordinates.length})</span>
          </div>
        </div>
      </div>

      {/* Location Button */}
      <button
        onClick={getUserLocation}
        className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        title="Get my location"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
        </svg>
      </button>

      {!isLoaded ? (
        // Loading state
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : hasValidApiKey ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={optimalZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ color: '#fefefe' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e3f2fd' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#e8eaf6' }]
              }
            ],
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(16, 16),
                anchor: new window.google.maps.Point(8, 8)
              }}
            />
          )}

          {/* Event Markers */}
          {eventsWithCoordinates.map((event) => (
            <Marker
              key={event.id}
              position={{ 
                lat: parseFloat(event.venue.latitude), 
                lng: parseFloat(event.venue.longitude) 
              }}
              title={event.name}
              onClick={() => setSelectedEvent(event)}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="#7c3aed" stroke="#ffffff" stroke-width="2"/>
                    <rect x="4" y="4" width="16" height="4" fill="#7c3aed"/>
                    <circle cx="12" cy="14" r="2" fill="#ffffff"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 12)
              }}
            />
          ))}



          {/* Info Window for Selected Event */}
          {selectedEvent && (
            <InfoWindow
              position={{ 
                lat: parseFloat(selectedEvent.venue.latitude), 
                lng: parseFloat(selectedEvent.venue.longitude) 
              }}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div className="p-3 max-w-xs">
                <h3 className="font-bold text-gray-900 mb-2">{selectedEvent.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{selectedEvent.venue.name}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{formatEventDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{selectedEvent.time || new Date(selectedEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-purple-600">R{selectedEvent.price || 0}</span>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        // Fallback when API key is missing
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Unavailable</h3>
            <p className="text-gray-600 mb-4">Google Maps API key is required to display the map.</p>
            {eventsWithCoordinates.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                <h4 className="font-medium text-gray-900 mb-2">Events with Venues:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {eventsWithCoordinates.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <span>{event.name}</span>
                      <span className="text-purple-600 font-medium">R{event.ticket_price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveEventsMap;
