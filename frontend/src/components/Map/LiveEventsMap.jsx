import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPinIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '16px',
};

// Sample events with Johannesburg coordinates for testing
const sampleEvents = [
  {
    id: 1,
    name: 'Jazz Under the Stars',
    artist: 'The Midnight Keys',
    venue: 'Sandton Convention Centre',
    date: 'Tonight',
    time: '8:00 PM',
    price: 'R150',
    lat: -26.1076,
    lng: 28.0567
  },
  {
    id: 2,
    name: 'Electronic Nights',
    artist: 'Neon Waves',
    venue: 'The Zone @ Rosebank',
    date: 'Tomorrow',
    time: '10:00 PM',
    price: 'R250',
    lat: -26.1465,
    lng: 28.0436
  },
  {
    id: 3,
    name: 'Rock Festival',
    artist: 'Electric Thunder',
    venue: 'Ellis Park Stadium',
    date: 'This Weekend',
    time: '6:00 PM',
    price: 'R300',
    lat: -26.2041,
    lng: 28.0473
  },
  {
    id: 4,
    name: 'Acoustic Sessions',
    artist: 'Rusty Strings',
    venue: 'Lyric Theatre',
    date: 'Next Week',
    time: '7:00 PM',
    price: 'R180',
    lat: -26.1951,
    lng: 28.0097
  }
];

function LiveEventsMap() {
  // Johannesburg center for testing
  const [center, setCenter] = useState({ lat: -26.1550, lng: 28.0595 });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get user's current location (fallback to Johannesburg for testing)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setCenter(userPos);
        },
        (error) => {
          console.log('Geolocation error, using Johannesburg for testing:', error);
          // Keep Johannesburg as fallback
          setUserLocation({ lat: -26.1550, lng: 28.0595 });
        }
      );
    } else {
      // Geolocation not supported, use Johannesburg
      setUserLocation({ lat: -26.1550, lng: 28.0595 });
    }
  }, []);

  const onLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setIsLoaded(false);
  }, []);

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-sm border border-purple-100">
      <LoadScript 
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
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
          {isLoaded && window.google && sampleEvents.map((event) => (
            <Marker
              key={event.id}
              position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setSelectedEvent(event)}
              icon={{
                path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: '#7c3aed',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                rotation: 180,
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
              {sampleEvents.map((event) => (
                <Marker
                  key={event.id}
                  position={{ lat: event.lat, lng: event.lng }}
                  onClick={() => setSelectedEvent(event)}
                  title={event.name}
                />
              ))}
            </>
          )}

          {/* Info Window for Selected Event */}
          {selectedEvent && (
            <InfoWindow
              position={{ lat: selectedEvent.lat, lng: selectedEvent.lng }}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div className="p-3 max-w-xs">
                <h3 className="font-bold text-gray-900 mb-2">{selectedEvent.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-purple-600">{selectedEvent.price}</span>
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
    </div>
  );
}

export default LiveEventsMap;
