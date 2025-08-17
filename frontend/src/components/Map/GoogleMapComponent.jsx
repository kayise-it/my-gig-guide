// file: frontend/src/components/Map/GoogleMapComponent.jsx

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Static libraries array to prevent reloading
const libraries = ['places'];

function GoogleMapComponent({ gigs, apiKey }) {
  const [center, setCenter] = useState({ lat: -25.4658, lng: 30.9853 }); // Default to Mbombela
  const [marker, setMarker] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = () => {
    setIsLoaded(true);
    
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

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
      >
        {marker && isLoaded && window.google?.maps && (
          <Marker 
            position={marker}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#ffffff" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="#ffffff"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16)
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;