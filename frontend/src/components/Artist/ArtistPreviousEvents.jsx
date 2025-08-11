import React, { useState } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../api/config';

export default function ArtistPreviousEvents({ events }) {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate pagination
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + eventsPerPage);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const getPosterImageUrl = (posterPath) => {
    if (!posterPath) return null;
    if (posterPath.startsWith('http')) return posterPath;
    return `${API_BASE_URL}${posterPath}`;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Previous Events</h4>
          {events.length > eventsPerPage && (
            <div className="flex items-center space-x-1">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
              </button>
              <span className="text-xs text-gray-500 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-6">
            <CalendarIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No past events yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentEvents.map(event => (
              <div key={event.id} className="group">
                <Link
                  to={`/events/${event.id}`}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 p-0.5">
                      <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {event.poster && getPosterImageUrl(event.poster) ? (
                          <img
                            src={getPosterImageUrl(event.poster)}
                            alt={event.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <CalendarIcon className="h-6 w-6 text-indigo-600" style={{ display: event.poster ? 'none' : 'block' }} />
                      </div>
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {events.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, events.length)} of {events.length} events
            </p>
          </div>
        )}
      </div>
    </div>
  );
}