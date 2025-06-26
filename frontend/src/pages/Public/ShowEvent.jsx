import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CalendarIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, LinkIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../api/config';

const ShowEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [venue, setVenue] = React.useState(null);

    React.useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
                setEvent(response.data.event);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    


    React.useEffect(() => {
        if (event && event.organiser_id) {
            console.log('Yebo yes');

            // Fetch organiser settings and extract folder_name and path
            axios.get(`${API_BASE_URL}/api/organisers/${event.organiser_id}/settings`)
                .then(res => {
                    const { folder_name, path } = res.data || {};
                    console.log('Organiser folder_name:', folder_name, 'path:', path);
                    // You can set state here if you want to use these values in the component
                })
                .catch(err => {
                    console.error('Failed to fetch organiser settings:', err);
                });
        }
        
    }, [event]);

    // take event.venue_id and go find the venue details
    React.useEffect(() => {
        if (event && event.venue_id) {
            axios.get(`${API_BASE_URL}/api/venues/${event.venue_id}`)
                .then(res => {
                    const venue = res.data.venue;
                    // Update the event with venue details
                    setEvent(prevEvent => ({
                        ...prevEvent,
                        venue_id: venue.name || 'Venue not specified',
                        address: venue.address || 'Address not specified',
                    }));
                })
                .catch(err => {
                    console.error('Failed to fetch venue details:', err);
                    // Optionally set a default value or handle the error
                    setEvent(prevEvent => ({
                        ...prevEvent,
                        venue_id: 'Venue not specified',
                        address: 'Address not specified',
                    }));
                });
        }
    }, [event]);


    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!event) return <div className="text-center py-8">Event not found</div>;

    // Format date
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="">
            {/* Hero Section */}
            <div className="relative w-full h-[350px] mb-8">
                {event.poster ? (
                    <img
                        src={event.poster}
                        alt={event.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">No Image Available</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <div className="p-6">
                        <h1 className="text-4xl font-bold text-white drop-shadow">{event.name}</h1>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="relative md:z-10 -mt-32 mb-8 bg-white p-6 rounded-lg shadow">
                {/* Event Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
                    {event.poster && (
                        <img
                            src={event.poster}
                            alt={event.name}
                            className="w-full h-64 object-cover bg-slate-100 rounded-lg mb-4"
                        />
                    )}
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Left Column */}
                    <div className="md:col-span-2">
                        {/* Date and Time */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Date And Time</h2>
                            <div className="flex items-center text-gray-700">
                                <CalendarIcon className="h-5 w-5 mr-2" />
                                <p>{eventDate} at {event.time}</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Address</h2>
                            <div className="flex items-center text-gray-700">
                                <MapPinIcon className="h-5 w-5 mr-2" />
                                <p>{event.venue_id || 'Address not specified'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                        </div>
                    </div>

                    {/* Right Column - Action Card */}
                    <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
                        {/* Price */}
                        {event.price && (
                            <div className="mb-4">
                                <p className="text-2xl font-bold">R{event.price}</p>
                                <p className="text-sm text-gray-500">per ticket</p>
                            </div>
                        )}

   

                        {/* Add to Calendar */}
                        <button className="w-full flex items-center justify-center border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded-md mb-6 transition-colors">
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            Add to Calendar
                        </button>

                        {/* Capacity */}
                        {event.capacity && (
                            <div className="text-sm text-gray-500 mb-2">
                                {event.capacity} spots available
                            </div>
                        )}

                        {/* Category */}
                        {event.category && (
                            <div className="text-sm text-gray-500">
                                Category: {event.category}
                            </div>
                        )}
                    </div>
                </div>

                {/* Gallery */}
                {event.gallery?.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Event Photos And Videos</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {event.gallery.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Organizer Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Event Organizer</h2>
                    <p className="text-gray-700 mb-4">{event.userId?.organization || 'Organizer'}</p>

                    <div className="space-y-2">
                        {event.userId?.phone && (
                            <div className="flex items-center text-gray-700">
                                <PhoneIcon className="h-5 w-5 mr-2" />
                                <a href={`tel:${event.userId.phone}`}>{event.userId.phone}</a>
                            </div>
                        )}

                        {event.userId?.email && (
                            <div className="flex items-center text-gray-700">
                                <EnvelopeIcon className="h-5 w-5 mr-2" />
                                <a href={`mailto:${event.userId.email}`}>{event.userId.email}</a>
                            </div>
                        )}

                        {event.userId?.website && (
                            <div className="flex items-center text-gray-700">
                                <LinkIcon className="h-5 w-5 mr-2" />
                                <a href={event.userId.website} target="_blank" rel="noopener noreferrer">
                                    {event.userId.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default ShowEvent;