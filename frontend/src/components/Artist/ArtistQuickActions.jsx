import { Link } from 'react-router-dom';
import { APP_BASE_PATH } from '../../api/config';

export default function ArtistQuickActions({ artistId }) {
  return (
    <div className="space-y-4 px-6 py-5 bg-white shadow rounded-lg overflow-hidden">
      <h4 className="text-lg font-bold text-gray-900">Quick Actions</h4>
      <p className="text-sm text-gray-500 mb-4">
        Upload multiple events at once with our bulk upload feature
      </p>
      <Link 
        to={`${APP_BASE_PATH}/artists/dashboard/events/new`}
        state={{ artistId }}
        className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Create New Event
      </Link>
    </div>
  );
}