import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsContext';



function VenueMap({ venue, height = '400px', width = '100%', zoom = 15 }) {
  const [center, setCenter] = useState({ lat: -25.4658, lng: 30.9853 }); // Default to Mbombela
  const [marker, setMarker] = useState(null);
  const { isLoaded, loadError } = useGoogleMaps();

  const containerStyle = useMemo(() => ({ width, height }), [width, height]);

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

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>Error loading Google Maps: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-lg">
        <p>Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
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
        {marker && window.google?.maps?.marker && (
          <google-maps-marker
            position={marker}
            title={venue?.name}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
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