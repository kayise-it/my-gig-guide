import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../api/config';
import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';


export default function viewArtist() {
    const { artist_id } = useParams(); // must match your route like /artists/:artist_id

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [events, setEvents] = useState([]);

    console.log("uiuiuuiiu");
    console.log('Fetching artist with ID:', artist_id);
    console.log('Token:', localStorage.getItem('token'));

    useEffect(() => {
        console.log("useEffect triggered with artist_id:", artist_id);
        console.log("Calling API:", `${API_BASE_URL}/api/artists/${artist_id}`);
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/artists/${artist_id}`);
                setProfile(response.data);
            } catch (err) {
                console.error('API Error Details:', {
                    message: err.message,
                    response: err.response?.data,
                    request: err.request,
                    config: err.config
                });
                setError(err.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [artist_id]);

    const checkFavoriteStatus = async (organiserId) => {
        try {
            const res = await axios.get('/api/favorites/check', {
                params: { organiserId },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsFavorite(res.data.isFavorite);
        } catch (err) {
            console.error('Error checking favorite status:', err);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await axios.delete('/api/favorites', {
                    data: { organiserId: id },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post('/api/favorites',
                    { organiserId: id },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
            }
            setIsFavorite(!isFavorite);
        } catch (err) {
            setError('Failed to update favorite status');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
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
            {/* Header Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-8 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">

                        </div>
                        <div className="ml-6">
                            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                            <div className="flex items-center mt-2">
                                <button
                                    onClick={toggleFavorite}
                                    className="flex items-center text-sm text-gray-500 hover:text-yellow-500"
                                >

                                    <span className="ml-1">{isFavorite ? 'Favorited' : 'Mark as Favorite'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Gallery Section */}
            {profile.gallery && profile.gallery.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {profile.gallery.map((image, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-lg shadow">
                                <img
                                    src={image}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Events Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        src={event.poster || 'https://via.placeholder.com/400x300'}
                                        alt={event.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">{event.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(event.date).toLocaleDateString()} at {event.time}
                                    </div>
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        View Event
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg p-8 text-center">
                        <p className="text-gray-500">No upcoming events found</p>
                    </div>
                )}
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">{events.length}</div>
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500 truncate">Avg. Attendance</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {events.length > 0 ? Math.round(events.reduce((sum, event) => sum + (event.attendees || 0), 0) / events.length) : 0}
                                    </div>
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500 truncate">Rating</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900">4.8</div>
                                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="sr-only">Increased by</span>
                                        12%
                                    </div>
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
