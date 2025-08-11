import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

// Static libraries array to prevent reloading
const libraries = ['places'];

function VenueMap({ venue }) {
  const [center, setCenter] = useState({ lat: -25.4658, lng: 30.9853 }); // Default to Mbombela
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (venue?.latitude && venue?.longitude) {
      const latLng = {
        lat: parseFloat(venue.latitude),
        lng: parseFloat(venue.longitude),
      };
      setCenter(latLng);
      setMarker(latLng);
    }
  }, [venue]);

  const onLoad = () => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps is not loaded');
      return;
    }
  };

  return (
    <div className="relative">
      <LoadScript googleMapsApiKey="AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y" libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ],
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
          }}
        >
          {marker && (
            <Marker 
              position={marker}
              title={venue?.name}
            />
          )}
        </GoogleMap>
      </LoadScript>
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
          <span className="text-sm font-medium text-gray-700">Venue Location</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span>Water</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>Parks</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
            <span>Roads</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueMap;