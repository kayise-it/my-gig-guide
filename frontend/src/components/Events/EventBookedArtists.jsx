import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_BASE_PATH } from '../../api/config';

export default function EventBookedArtists({ artists = [] }) {
  if (!artists || artists.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Booked Artists</h3>
        <p className="text-sm text-gray-500">No artists added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Booked Artists</h3>
      <div className="flex flex-wrap gap-2">
        {artists.map(a => {
          const artistId = a.artist_id || a.id;
          const userId = a.userId || a.user_id; // prefer userId for public profile route
          const name = a.stage_name || a.real_name || a.name || `Artist #${artistId}`;
          const profileKey = userId || artistId;
          const href = `${APP_BASE_PATH}/Artists/${profileKey}`;
          return (
            <Link
              key={`${artistId}-${profileKey}`}
              to={href}
              className="inline-flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              <span className="underline-offset-2">{name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}



