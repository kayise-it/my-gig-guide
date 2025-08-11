import React from 'react';
import { useNavigate } from 'react-router-dom';
import VenueForm from '../../../../components/Venue/VenueForm';

function NewOrganiserVenue() {
  const navigate = useNavigate();

  const handleSuccess = (createdVenue) => {
    // Redirect to the newly created venue or venues list
    navigate(`/organiser/dashboard/venues/${createdVenue.id}`);
    // Or navigate('/venues') if you prefer to go back to the list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <VenueForm onSuccess={handleSuccess} />
    </div>
  );
}

export default NewOrganiserVenue;