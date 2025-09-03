import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

// Static libraries array to prevent recreation on every render
const GOOGLE_MAPS_LIBRARIES = ['places', 'marker'];

export const GoogleMapsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y';

  const handleLoad = () => {
    setIsLoaded(true);
    console.log('Google Maps API loaded successfully');
  };

  const handleError = (error) => {
    setLoadError(error);
    console.error('Google Maps API failed to load:', error);
  };

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, apiKey }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={GOOGLE_MAPS_LIBRARIES}
        onLoad={handleLoad}
        onError={handleError}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
};
