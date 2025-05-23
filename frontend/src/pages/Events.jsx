// frontend/src/pages/Events.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaMusic, FaSearch, FaSpinner } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/events', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setEvents(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch events');
        } finally {
          setLoading(false);
        }
      };
  
      fetchEvents();
    }, []);
  
    const filteredEvents = events.filter(event =>
      (event.event_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (event.event_date?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      );
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h1>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events by name, venue, or artist..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
  
        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-1/3 h-48 bg-gray-200">
                    {event.image_url ? (
                      <img 
                        src={event.image_url} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                        <FaMusic className="text-4xl text-indigo-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Event Details */}
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{event.name}</h2>
                        <div className="flex items-center mt-2 text-gray-600">
                          <FaCalendarAlt className="mr-2" />
                          <span>{format(parseISO(event.event_date), 'PPPp')}</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{event.venue?.name} • {event.venue?.location}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        ${event.ticket_price}
                      </span>
                    </div>
                    
                    {/* Artists */}
                    {event.artists?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Featuring</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {event.artists.map(artist => (
                            <span key={artist.id} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {artist.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Description */}
                    <p className="mt-4 text-gray-600 line-clamp-2">{event.description}</p>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between items-center">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                        More Details
                      </button>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
                        Get Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your search</p>
          </div>
        )}
  
        {/* JSON Debug View (optional) */}
        <details className="mt-12 bg-gray-100 p-4 rounded-lg">
          <summary className="font-medium text-gray-700 cursor-pointer">Debug: Events JSON</summary>
          <pre className="mt-2 p-4 bg-white rounded overflow-auto max-h-64">
            {JSON.stringify(events, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
  