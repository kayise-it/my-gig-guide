import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, CurrencyDollarIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // or wherever your token is stored

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/events`, {
            headers: {
              'Authorization': `Bearer ${token}` // Pass the token here
            }
          });        
          if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Events</h1>
        <p className="mt-2 text-sm text-gray-600">
          Browse through our exciting lineup of upcoming events
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Events
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                className="block w-full rounded-md border-gray-300 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="concert">Concerts</option>
              <option value="festival">Festivals</option>
              <option value="conference">Conferences</option>
              <option value="exhibition">Exhibitions</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <span className="text-sm text-gray-500">
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              {/* Event Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                {event.poster ? (
                  <img
                    src={event.poster}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
                  {event.price && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ${event.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Meta */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span>{event.time}</span>
                  </div>

                  {event.venue && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>{event.venue.name}</span>
                    </div>
                  )}

                  {event.category && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {event.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}