import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPinIcon, CalendarDaysIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '16px',
};

// Static libraries array to prevent reloading
const libraries = ['places'];

function LiveEventsMap({ events = [] }) {
  const [center, setCenter] = useState({ lat: -26.1550, lng: 28.0595 });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper function to format event date
  const formatEventDate = (eventDate) => {
    const date = new Date(eventDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  // Filter events that have venue coordinates (memoized to prevent infinite loops)
  const eventsWithCoordinates = useMemo(() => 
    events.filter(event => 
      event.venue && 
      event.venue.latitude && 
      event.venue.longitude &&
      !isNaN(parseFloat(event.venue.latitude)) && 
      !isNaN(parseFloat(event.venue.longitude))
    ), [events]
  );

  // Calculate optimal zoom level (memoized)
  const optimalZoom = useMemo(() => {
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
  }, [eventsWithCoordinates]);

  // Calculate center based on venue locations
  useEffect(() => {
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
  }, [eventsWithCoordinates]);

  // Get user location separately (for the blue dot only)
  useEffect(() => {
    if (navigator.geolocation) {
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
  }, []);

  const onLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setIsLoaded(false);
  }, []);

  // Check if API key is available
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y';
  const hasValidApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && apiKey !== 'YOUR_API_KEY_HERE';

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
                <line x1="8" y1="2" x2="8" y2="6" stroke="#7c3aed" stroke-width="1"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="#7c3aed" stroke-width="1"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#7c3aed" stroke-width="1"/>
                <circle cx="12" cy="15" r="1" fill="#7c3aed"/>
              </svg>
            </div>
            <span className="text-xs text-gray-700">Event Venues ({eventsWithCoordinates.length})</span>
          </div>
        </div>
      </div>

      {hasValidApiKey ? (
        <LoadScript 
          googleMapsApiKey={apiKey}
          libraries={libraries}
        >
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
          {userLocation && isLoaded && window.google && (
            <Marker
              position={userLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              }}
            />
          )}

          {/* Event Markers */}
          {isLoaded && window.google && eventsWithCoordinates.map((event) => (
            <Marker
              key={event.id}
              position={{ 
                lat: parseFloat(event.venue.latitude), 
                lng: parseFloat(event.venue.longitude) 
              }}
              onClick={() => setSelectedEvent(event)}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" fill="#7c3aed" stroke="#ffffff" stroke-width="2"/>
                    <rect x="3" y="2" width="18" height="4" fill="#7c3aed"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="#ffffff" stroke-width="1"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="#ffffff" stroke-width="1"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="#ffffff" stroke-width="1"/>
                    <circle cx="12" cy="15" r="2" fill="#ffffff"/>
                    <path d="M12 13 L12 17 M10 15 L14 15" stroke="#7c3aed" stroke-width="1" stroke-linecap="round"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 12)
              }}
            />
          ))}

          {/* Fallback markers when Google isn't loaded */}
          {(!isLoaded || !window.google) && (
            <>
              {userLocation && (
                <Marker
                  position={userLocation}
                  title="Your Location"
                />
              )}
              {eventsWithCoordinates.map((event) => (
                <Marker
                  key={event.id}
                  position={{ 
                    lat: parseFloat(event.venue.latitude), 
                    lng: parseFloat(event.venue.longitude) 
                  }}
                  onClick={() => setSelectedEvent(event)}
                  title={event.name}
                  label={{
                    text: '★',
                    color: '#7c3aed',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              ))}
            </>
          )}

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
                    <span>{formatEventDate(selectedEvent.event_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{new Date(selectedEvent.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-purple-600">R{selectedEvent.ticket_price}</span>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        </LoadScript>
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
