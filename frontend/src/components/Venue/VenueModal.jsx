//File location: frontend/src/components/Venue/VenueModal.jsx
import React from 'react';
import { useVenueModal } from './VenueModalContext'; // ✅ Add this

const VenueModal = () => {
  const { isVenueModalOpen, currentVenue, closeVenueModal } = useVenueModal();

  if (!isVenueModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{currentVenue?.name || 'Venue Details'}</h2>
        {/* Add your venue details here */}
        <button onClick={closeVenueModal}>Close</button>
      </div>
    </div>
  );
};

export default VenueModal;