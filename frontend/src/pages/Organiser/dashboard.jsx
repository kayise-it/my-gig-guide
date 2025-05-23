// file: frontend/src/pages/Organiser/Dashboard.jsx
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';


const Dashboard = ({ organiser }) => {
  // Sample data - replace with actual data from props/API
  const [organiserEvents, setOrganiserEvents] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user')).id;
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };
  
  const stats = [
    { name: 'Total Events', value: 1, change: '+4%', changeType: 'positive' },
    { name: 'Upcoming Events', value: 1, change: '+2', changeType: 'positive' },
    { name: 'Past Events', value: 0, change: '-1', changeType: 'negative' },
    { name: 'Avg. Attendance', value: '85%', change: '+5%', changeType: 'positive' },
  ];

  const recentEvents = [
    { id: 1, name: 'Summer Festival', date: '2023-07-15', attendees: 1200, status: 'completed' },
    { id: 2, name: 'Tech Conference', date: '2023-08-20', attendees: 800, status: 'upcoming' },
    { id: 3, name: 'Music Awards', date: '2023-09-05', attendees: 0, status: 'planned' },
  ];

  const token = localStorage.getItem('token'); // or wherever your token is stored

  // Fetch user info on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  console.log("Events data:", events); // Log the events data for debugging

  // Fetch events after user is loaded
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8000/api/events/organiser/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Pass the token here
          }
        })
        .then((response) => {
          setEvents(response.data.events);
        })
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, [user]); // Depends on user state

  /*   if (loading) return <div className="text-center py-8">Loading event details...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!event) return <div className="text-center py-8">Event not foun90d</div>;
   */


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Organiser Dashboard</h1>
          <div className="flex items-center space-x-4">

            <span className="text-gray-700 font-medium">{organiser?.name || 'Organiser Name'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    {/* Icon would go here */}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Link
              to="/organiser/dashboard/events/new"
              className="bg-white overflow-hidden shadow rounded-lg p-4 flex items-center hover:bg-gray-50 transition-colors"
            >
              <div className="bg-indigo-100 p-3 rounded-md mr-4">
                {/* Plus icon */}
              </div>
              <span className="font-medium">Create New Event</span>
            </Link>


            <Link
              to="/organiser/dashboard/profile"
              className="bg-white overflow-hidden shadow rounded-lg p-4 flex items-center hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 p-3 rounded-md mr-4">
                {/* Profile icon */}
              </div>
              <span className="font-medium">Edit Profile</span>
            </Link>
            <Link
              to="/organiser/dashboard/venues/new"
              className="bg-white overflow-hidden shadow rounded-lg p-4 flex items-center hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 p-3 rounded-md mr-4">
                {/* Profile icon */}
              </div>
              <span className="font-medium">New Venue</span>
            </Link>
           
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Events</h3>
            <Link to="/organiser/dashboard/events" className="text-sm text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
  {events?.map((event) => (
    <div key={event.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/organiser/dashboard/event/${event.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            {event.name}
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(event.date).toLocaleDateString()} • {event.attendees} attendees
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            event.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : event.status === 'upcoming'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {event.status}
          </span>
          
          {/* Edit Link */}
          <Link
            to={`/organiser/dashboard/event/edit/${event.id}`}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
          >
            Edit
          </Link>
          
          {/* Delete Link */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this event?')) {
                // Call your delete function here
                handleDeleteEvent(event.id);
              }
            }}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-500">Activity feed will appear here</p>
            {/* Activity items would be mapped here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;