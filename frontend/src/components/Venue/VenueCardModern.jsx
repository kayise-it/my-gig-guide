import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import VenueMap from '../Map/VenueMap';

/*
  Props:
  - venue: { id, name, main_picture, location, rating, coordinates: { lat, lng } }
  - to: optional override link
*/
const VenueCardModern = ({ venue, to }) => {
  if (!venue) return null;

  const imageUrl = venue.main_picture || '';
  const linkTo = to || `/venue/${venue.id}`;
  const lat = venue?.coordinates?.lat ?? venue?.lat;
  const lng = venue?.coordinates?.lng ?? venue?.lng;

  return (
    <Link
      to={linkTo}
      className="block rounded-[22px] bg-white shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden"
    >
      {/* Top media */}
      <div className="relative aspect-[4/3]">
        {imageUrl ? (
          <img src={imageUrl} alt={venue.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
        <div className="absolute inset-0 rounded-t-[22px] ring-1 ring-black/5" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {venue?.rating && (
            <div className="flex items-center bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
              {Number(venue.rating).toFixed(1)}
            </div>
          )}
        </div>

        {/* Title overlay button */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 px-4 py-2 rounded-full text-sm font-medium shadow">
            Start Route
          </div>
        </div>

        {/* Caption */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1 text-white" />
            {venue?.location || 'Location'}
          </div>
        </div>
      </div>

      {/* Bottom stats + mini map */}
      <div className="grid grid-cols-5 gap-3 p-4 items-center">
        <div className="col-span-3 space-y-1">
          <h3 className="font-semibold text-gray-900 truncate">{venue?.name}</h3>
          <div className="text-xs text-gray-500 truncate">{venue?.subtitle || venue?.city || ''}</div>
          <div className="mt-2 flex items-center text-xs text-gray-600 space-x-4">
            {venue?.distance && (
              <span>{venue.distance} km</span>
            )}
            {venue?.duration && (
              <span>{venue.duration}</span>
            )}
            {venue?.level && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{venue.level}</span>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <div className="h-24 w-full">
              <VenueMap
                height="100%"
                width="100%"
                lat={lat}
                lng={lng}
                zoom={14}
                markerTitle={venue?.name}
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueCardModern;

