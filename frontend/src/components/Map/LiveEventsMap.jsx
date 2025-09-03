import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { APP_BASE_PATH } from '../../api/config';
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import { MapPinIcon, CalendarDaysIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

const defaultContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '16px',
};

// Static libraries array to prevent recreation on every render
const GOOGLE_MAPS_LIBRARIES = ['places'];

function LiveEventsMap({ events = [], height = '400px', width = '100%', showLegend = true, compact = false, zoomDelta = 0 }) {
  const { isLoaded, loadError, apiKey } = useGoogleMaps();
  const [center, setCenter] = useState({ lat: -26.1550, lng: 28.0595 });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [mapError, setMapError] = useState(loadError);

  const containerStyle = useMemo(() => ({ ...defaultContainerStyle, width, height }), [width, height]);

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
      <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-purple-100 relative bg-gray-50 flex items-center justify-center" style={{ height }}>
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
      <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-purple-100 relative bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center" style={{ height }}>
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
    <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-purple-100 relative" style={{ height }}>
      {/* Map Legend (hideable) */}
      {showLegend && (
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
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ffffff"/>
                  <circle cx="12" cy="9" r="2" fill="#7c3aed"/>
                </svg>
              </div>
              <span className="text-xs text-gray-700">Event Venues ({eventsWithCoordinates.length})</span>
            </div>
          </div>
        </div>
      )}

      {/* Location Button */}
      {!compact && (
        <button
          onClick={getUserLocation}
          className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          title="Get my location"
        >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
        </svg>
        </button>
      )}

      {!isLoaded ? (
        // Loading state
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (hasValidApiKey && typeof window !== 'undefined' && window.google && window.google.maps) ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={Math.max(0, optimalZoom + zoomDelta)}
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
            disableDefaultUI: compact ? true : false,
            zoomControl: compact ? false : true,
            streetViewControl: false,
            mapTypeControl: compact ? false : false,
            fullscreenControl: compact ? false : true,
            gestureHandling: compact ? 'none' : 'auto',
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
                onClick={compact ? undefined : () => setSelectedEvent(event)}
                onMouseOver={compact ? undefined : () => {
                  if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                  }
                  const timeout = setTimeout(() => {
                    setHoveredEvent(event);
                  }, 300);
                  setHoverTimeout(timeout);
                }}
                onMouseOut={compact ? undefined : () => {
                  if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                  }
                  setHoveredEvent(null);
                }}
                icon={window.google ? {
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="${compact ? 40 : 48}" height="${compact ? 40 : 48}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <circle cx="12" cy="12" r="10" fill="#7c3aed" opacity="0.3" filter="url(#glow)">
                        <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#7c3aed" stroke="#ffffff" stroke-width="1"/>
                      <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(compact ? 40 : 48, compact ? 40 : 48),
                  anchor: new window.google.maps.Point(compact ? 20 : 16, compact ? 36 : 32)
                } : undefined}
              />
            ))}

            {/* Info Window for Selected Event (Click) */}
            {!compact && selectedEvent && (
              <InfoWindow
                position={{ 
                  lat: parseFloat(selectedEvent.venue.latitude), 
                  lng: parseFloat(selectedEvent.venue.longitude) 
                }}
                onCloseClick={() => setSelectedEvent(null)}
              >
                <div className="p-4 max-w-xs">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{selectedEvent.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{selectedEvent.venue.name}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                      <span>{formatEventDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                      <span>{selectedEvent.time || new Date(selectedEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <span className="font-semibold text-purple-600 text-lg">R{selectedEvent.price || 0}</span>
                      <a 
                        href={`${APP_BASE_PATH}/events/${selectedEvent.id}`}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `${APP_BASE_PATH}/events/${selectedEvent.id}`;
                        }}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Info Window for Hovered Event */}
            {!compact && hoveredEvent && !selectedEvent && (
              <InfoWindow
                position={{ 
                  lat: parseFloat(hoveredEvent.venue.latitude), 
                  lng: parseFloat(hoveredEvent.venue.longitude) 
                }}
              >
                <div className="p-3 max-w-xs">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{hoveredEvent.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{hoveredEvent.venue.name}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                      <span>{formatEventDate(hoveredEvent.date)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-purple-600">R{hoveredEvent.price || 0}</span>
                      <span className="text-xs text-gray-500">Click for details</span>
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
            <p className="text-gray-600 mb-4">Google Maps is not ready yet. Please refresh or try again shortly.</p>
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
