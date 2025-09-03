import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../api/config';
import axios from 'axios';

const ViewEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = () => {
    navigate(`/user/dashboard/edit-event/${id}`);
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        navigate('/user/dashboard');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/user/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                <p className="text-gray-600 mt-1">Event Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditEvent}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Event
              </button>
              <button
                onClick={handleDeleteEvent}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Poster */}
        {event.poster && (
          <div className="mb-8">
            <img
              src={`${API_BASE_URL}${event.poster}`}
              alt={event.name}
              className="w-full h-64 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CalendarDaysIcon className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date</p>
                      <p className="text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time</p>
                      <p className="text-gray-900">{event.time}</p>
                    </div>
                  </div>

                  {event.venue_id && (
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Venue</p>
                        <p className="text-gray-900">{event.venue_name || 'Venue'}</p>
                      </div>
                    </div>
                  )}

                  {event.category && (
                    <div className="flex items-center space-x-3">
                      <div className="h-5 w-5 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">{event.category.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Category</p>
                        <p className="text-gray-900 capitalize">{event.category}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                
                {event.description && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900">{event.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {event.price && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Price</p>
                      <p className="text-lg font-semibold text-gray-900">${event.price}</p>
                    </div>
                  )}

                  {event.capacity && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Capacity</p>
                      <p className="text-lg font-semibold text-gray-900">{event.capacity} people</p>
                    </div>
                  )}
                </div>

                {event.booked_artists && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Booked Artists/Performers</p>
                    <p className="text-gray-900">{event.booked_artists}</p>
                  </div>
                )}

                {event.ticket_url && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Tickets</p>
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                    >
                      Buy Tickets
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery */}
          {event.gallery && event.gallery.split(',').length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.gallery.split(',').map((image, index) => (
                  <img
                    key={index}
                    src={`${API_BASE_URL}${image}`}
                    alt={`${event.name} - Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.open(`${API_BASE_URL}${image}`, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
