// frontend/src/context/VenueModalContext.jsx
import { createContext, useContext, useState } from 'react';

const VenueModalContext = createContext();

export const VenueModalProvider = ({ children }) => {
  const [isVenueModalOpen, setVenueModalOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);

  const openVenueModal = (venue = null) => {
    setCurrentVenue(venue);
    setVenueModalOpen(true);
  };

  const closeVenueModal = () => {
    setVenueModalOpen(false);
    setCurrentVenue(null);
  };

  return (
    <VenueModalContext.Provider value={{
      isVenueModalOpen,
      currentVenue,
      openVenueModal,
      closeVenueModal,
    }}>
      {children}
    </VenueModalContext.Provider>
  );
};

export const useVenueModal = () => useContext(VenueModalContext);