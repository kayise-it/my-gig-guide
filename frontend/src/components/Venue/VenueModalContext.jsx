import { createContext, useContext, useState } from 'react';

const VenueModalContext = createContext();

export const VenueModalProvider = ({ children }) => {
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);

  const openVenueModal = (venue) => {
    setCurrentVenue(venue);
    setIsVenueModalOpen(true);
  };

  const closeVenueModal = () => {
    setIsVenueModalOpen(false);
    setCurrentVenue(null);
  };

  return (
    <VenueModalContext.Provider
      value={{
        isVenueModalOpen,
        currentVenue,
        openVenueModal,
        closeVenueModal
      }}
    >
      {children}
    </VenueModalContext.Provider>
  );
};

export const useVenueModal = () => {
  const context = useContext(VenueModalContext);
  if (!context) {
    throw new Error('useVenueModal must be used within a VenueModalProvider');
  }
  return context;
};