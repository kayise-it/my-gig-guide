import { useVenueModal } from '@/components/Venue/VenueModalContext';

export const VenueModal = () => {
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