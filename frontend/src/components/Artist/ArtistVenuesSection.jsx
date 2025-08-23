import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import EnhancedVenueCard from '../Venue/EnhancedVenueCard';

export default function ArtistVenuesSection({ venues }) {
  const [showAll, setShowAll] = useState(false);
  const maxDisplayed = 3;
  const displayedVenues = showAll ? venues : venues.slice(0, maxDisplayed);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Your Venues</h4>
          <Link
            to="/artists/dashboard/venue/new"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Venue
          </Link>
        </div>

        {venues.length === 0 ? (
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">No venues yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add venues where you perform to help fans find your shows
            </p>
            <Link
              to="/artists/dashboard/venue/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Add your first venue
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedVenues.map(venue => (
                <EnhancedVenueCard
                  key={venue.id}
                  venue={venue}
                  showActions={true}
                  showStats={true}
                  className="h-full"
                />
              ))}
            </div>

            {venues.length > maxDisplayed && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium py-2"
                >
                  {showAll ? 'Show less' : `View all ${venues.length} venues`}
                </button>
              </div>
            )}

            {venues.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{venues.length} venue{venues.length !== 1 ? 's' : ''} total</span>
                  <Link
                    to="/artists/dashboard/venues"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Manage all
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}