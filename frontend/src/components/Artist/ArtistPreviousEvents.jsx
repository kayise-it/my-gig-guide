import { CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function ArtistPreviousEvents({ events }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5">
        <h4 className="text-lg font-bold text-gray-900">Previous Events</h4>
        
        {events.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No past events yet</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {events.map(event => (
              <li key={event.id} className="group">
                <Link
                  to={`/events/${event.id}`}
                  className="flex items-center p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}