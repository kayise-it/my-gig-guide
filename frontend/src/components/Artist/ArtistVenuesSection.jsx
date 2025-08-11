import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon, 
  UsersIcon, 
  PlusIcon,
  ChevronRightIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function ArtistVenuesSection({ venues }) {
  const [showAll, setShowAll] = useState(false);
  const maxDisplayed = 3;
  const displayedVenues = showAll ? venues : venues.slice(0, maxDisplayed);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Your Venues</h4>
          <Link
            to="/artists/dashboard/venue/new"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg transition-colors"
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
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add your first venue
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedVenues.map(venue => (
                <div key={venue.id} className="group">
                  <Link
                    to={`/venue/${venue.id}`}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                        <MapPinIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                          {venue.name}
                        </p>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                      </div>
                      <div className="flex items-center mt-1 space-x-4">
                        <p className="text-xs text-gray-500 truncate">
                          {venue.address}
                        </p>
                        {venue.capacity && (
                          <div className="flex items-center text-xs text-gray-500">
                            <UsersIcon className="h-3 w-3 mr-1" />
                            {venue.capacity}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {venues.length > maxDisplayed && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2"
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
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
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