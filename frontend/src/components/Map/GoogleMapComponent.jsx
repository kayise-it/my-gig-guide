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

  const onLoad = () => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps is not loaded');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const address = gigs[0]?.venue?.address;

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
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;