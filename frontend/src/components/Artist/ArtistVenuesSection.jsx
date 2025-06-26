import { Link } from 'react-router-dom';
import VenueCard from '../Venue/VenueCard';

export default function ArtistVenuesSection({ venues }) {
  return (
    <div className="space-y-4 px-6 py-5 bg-white shadow rounded-lg overflow-hidden">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold text-gray-900">Your Venues</h4>
        <Link
          to="/artists/dashboard/venue/new"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add V3enue
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {venues.map(venue => (
          <VenueCard 
            key={venue.id}
            venue={venue}
            who="artists/dashboard"
          />
        ))}
      </div>
    </div>
  );
}