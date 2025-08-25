import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VenueForm from '../../../../components/Venue/VenueForm';

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = (venue) => {
    // Navigate to the venue view page after successful edit
    navigate(`/venue/${venue.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Venue</h1>
            <p className="text-gray-600 mt-2">Update your venue information below.</p>
          </div>
          
          <VenueForm 
            venueId={id}
            onSuccess={handleSuccess}
            isModal={false}
          />
        </div>
      </div>
    </div>
  );
}
