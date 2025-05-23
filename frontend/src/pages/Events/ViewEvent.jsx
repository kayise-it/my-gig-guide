import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast'; // Install with: npm install react-hot-toast
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardBreadCrumb from '../../components/Includes/DashboardBreadCrumb';
import VenueMap from '../../components/Map/VenueMap';
import { venueService } from '../../api/venueService'; // You'll need to implement these API functions

export default function ViewEvent() {
    const { id } = useParams();
    const [isUpdating, setIsUpdating] = useState(false);
    const [event, setEvent] = useState(null);
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser, logout } = useContext(AuthContext);
    const [venues, setVenues] = useState({
        'name': '',
        'location': '',
        'capacity': '',
        'contact_email': '',
        'phone_number': '',
        'website': '',
        'address': '',
        'latitude': '',
        'longitude': '',
    });

    const token = localStorage.getItem('token'); // or wherever your token is stored
    const [editMode, setEditMode] = useState(false);


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/events/${id}`);
                if (response.data.success) {
                    const eventData = response.data.event;
                    setEvent(eventData);

                    const result = await venueService.getVenue(eventData.id);
                    console.log("Venue Thando is:", result);
                } else {
                    setError(response.data.message || 'Event not found');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load event');
                console.error('Error fetching event:', err);
            } finally {
                setLoading(false);
            }
        };
        const fetchArtistVenues = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user')).id;
                const response = await axios.get(`http://localhost:8000/api/artists/venues_by_artist/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Pass the token here
                    }
                });
                if (response.status === 200) {
                    setVenues(response.data);
                }
            } catch (error) {
                console.error('Error fetching artist events:', error);
                setError('Failed to load artist events');
            }
        };

        fetchArtistVenues();
        fetchEvent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData(e.target);
        const selectedVenue = formData.get("venue");
        const venueId = parseInt(selectedVenue, 10);

        // ✅ Validate input
        if (!venueId || isNaN(venueId)) {
            toast.error('Please select a valid venue.', {
                duration: 4000,
                position: 'top-center',
                icon: '⚠️',
                style: {
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                }
            });
            setIsUpdating(false);
            return;
        }

        try {
            const result = await venueService.updateEventVenue(event.id, { venue_id: venueId });
            console.log("Venue updated:", result);

            toast.success('Venue updated successfully!', {
                duration: 4000,
                position: 'top-center',
                icon: '✅',
                style: {
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                }
            });

            setEvent((prevEvent) => ({
                ...prevEvent,
                venue_id: venueId,
            }));

            setEditMode(false);
        } catch (err) {
            console.error("Failed to update venue:", err);
            toast.error('Failed to update venue', {
                duration: 4000,
                position: 'top-center',
                icon: '❌',
                style: {
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                }
            });
        } finally {
            setIsUpdating(false);
        }
    };
    if (loading) return <div className="text-center py-8">Loading event details...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!event) return <div className="text-center py-8">Event not found</div>;

    const breadcrumbs = [
        { label: 'Dashboard', path: '/artists/dashboard' },
        { label: currentUser.username, path: '' },
    ];
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with breadcrumb */}
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <DashboardBreadCrumb breadcrumbs={breadcrumbs} />
                <div className="flex items-center space-x-2">
                    <span className="font-medium">Thando</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">T</span>
                    </div>
                </div>
            </div>

            {/* Main content - two columns */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Left column - Map and Poster */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div className="relative z-10 rounded-xl overflow-hidden shadow-lg h-96">
                        <VenueMap
                            venue={{
                                latitude: -25.4718,
                                longitude: 30.9765,
                                name: "Kirsten Calderon",
                                address: "39b brown street, Mbombela"
                            }}
                            className="w-full h-full z-30"
                        />
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={event.image_url || '../public/placeholder.png'}
                            alt={event.name}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                </div>

                {/* Right column - Event details */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

                        {/* Venue status */}
                        <div className="mb-6">
                            {(event.venue_id === null || event.venue_id === 0) ? (
                                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-center text-red-600 font-medium mb-1">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        No venue assigned
                                    </div>
                                    <p className="text-sm text-red-500 mb-2">Please update this event with a valid venue.</p>
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                                    >
                                        Add Venue
                                    </button>
                                </div>
                            ) : (
                                <div className="p-3 bg-green-50 rounded-lg border border-green-100 mb-4">
                                    <div className="flex items-center text-green-700 font-medium mb-1">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Venue Assigned
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{event.venue_name || "Venue ID: " + event.venue_id}</p>
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                                    >
                                        Change Venue
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Event details */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-700">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>

                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700">{event.time}</span>
                            </div>

                            {event.price > 0 && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xl font-bold text-green-600">R{event.price.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        {/* Book Now button */}
                        <button className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition mb-6">
                            Book Now
                        </button>

                        {/* Event description */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Description</h3>
                            <p className="text-gray-600">{event.description || 'No description available for this event.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming events section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upcoming Events
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder for upcoming events */}
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-gray-100 rounded-xl p-4 h-48 flex items-center justify-center">
                            <span className="text-gray-400">Event card placeholder</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Venue selection modal (when editMode is true) */}
            {editMode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative z-50">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Select a Venue</h2>
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {venues.map((venue) => (
                                        <label
                                            key={venue.id}
                                            htmlFor={`venue_${venue.id}`}
                                            className="block cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                id={`venue_${venue.id}`}
                                                name="venue"
                                                value={venue.id}
                                                className="hidden peer"
                                            />
                                            <div className="p-4 rounded-lg border border-gray-200 bg-white hover:border-indigo-300 peer-checked:border-indigo-500 peer-checked:ring-2 peer-checked:ring-indigo-200 transition">
                                                <h3 className="font-semibold text-lg mb-1">{venue.name}</h3>
                                                <p className="text-sm text-gray-600">{venue.location}</p>
                                            </div>
                                        </label>
                                    ))}

                                    <div className="sm:col-span-2 pt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditMode(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                        >
                                            Save Venue
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}