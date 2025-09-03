// file: frontend/src/components/Map/GoogleMapComponent.jsx

import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Static libraries array to prevent reloading
// Static libraries array to prevent recreation on every render
const GOOGLE_MAPS_LIBRARIES = ['places'];

function GoogleMapComponent({ gigs }) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [center, setCenter] = useState({ lat: -25.4658, lng: 30.9853 }); // Default to Mbombela
  const [marker, setMarker] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onLoad = () => {
    setMapLoaded(true);
    
    if (!window.google || !window.google.maps) {
      console.error('Google Maps is not loaded');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const address = gigs?.[0]?.venue?.address;

    if (address) {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const latLng = {
            lat: location.lat(),
            lng: location.lng(),
          };
          setCenter(latLng);
          setMarker(latLng);
        } else {
          console.error('Geocoding failed:', status);
          // Keep default center if geocoding fails
        }
      });
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center text-red-500">
          <p>Failed to load Google Maps</p>
          <p className="text-sm">Please refresh the page</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
    >
      {marker && mapLoaded && window.google?.maps && window.google.maps.marker && (
        <google-maps-marker
          position={marker}
          title="Event Location"
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            border: '2px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ffffff'
            }}></div>
          </div>
        </google-maps-marker>
      )}
    </GoogleMap>
  );
}

export default GoogleMapComponent;