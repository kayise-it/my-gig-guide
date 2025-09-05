import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    UsersIcon,
    TagIcon,
    HeartIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import API_BASE_URL from '../../api/config';

const SimilarEvents = ({ currentEvent, currentEventId }) => {
    const [similarEvents, setSimilarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSimilarEvents();
    }, [currentEvent, currentEventId]);

    const fetchSimilarEvents = async () => {
        try {
            setLoading(true);
            
            // Get the week range for the current event
            const eventDate = new Date(currentEvent?.date);
            const startOfWeek = new Date(eventDate);
            startOfWeek.setDate(eventDate.getDate() - eventDate.getDay()); // Start of week (Sunday)
            
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)

            // Format dates for API
            const startDate = startOfWeek.toISOString().split('T')[0];
            const endDate = endOfWeek.toISOString().split('T')[0];

            // Fetch events from the same week
            const response = await axios.get(`${API_BASE_URL}/api/events`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    limit: 6,
                    exclude_id: currentEventId
                }
            });

            if (response.data?.success && response.data?.events) {
                // Filter and sort by similarity (same category, venue, or date proximity)
                const events = response.data.events.filter(event => event.id !== currentEventId);
                
                // Sort by similarity score
                const scoredEvents = events.map(event => ({
                    ...event,
                    similarityScore: calculateSimilarityScore(event, currentEvent)
                }));

                // Sort by similarity score (highest first) and take top 4
                const sortedEvents = scoredEvents
                    .sort((a, b) => b.similarityScore - a.similarityScore)
                    .slice(0, 4);

                setSimilarEvents(sortedEvents);
            } else {
                setSimilarEvents([]);
            }
        } catch (err) {
            console.error('Error fetching similar events:', err);
            setError('Failed to load similar events');
            setSimilarEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateSimilarityScore = (event, currentEvent) => {
        let score = 0;
        
        // Same category gets high score
        if (event.category === currentEvent?.category) {
            score += 3;
        }
        
        // Same venue gets high score
        if (event.venue_id === currentEvent?.venue_id) {
            score += 2;
        }
        
        // Same day gets medium score
        if (event.date === currentEvent?.date) {
            score += 2;
        }
        
        // Same price range gets low score
        const priceDiff = Math.abs((event.price || 0) - (currentEvent?.price || 0));
        if (priceDiff < 100) {
            score += 1;
        }
        
        return score;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        if (!price || Number(price) === 0) return 'Free';
        return `R${Number(price).toLocaleString('en-ZA')}`;
    };

    const getEventStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'scheduled':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Events This Week</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-32 rounded-lg mb-3"></div>
                            <div className="space-y-2">
                                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                                <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Events This Week</h2>
                <div className="text-center py-8">
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    if (similarEvents.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Events This Week</h2>
                <div className="text-center py-8">
                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No similar events found this week</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Events This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarEvents.map((event) => (
                    <Link
                        key={event.id}
                        to={`/events/${event.id}`}
                        className="group block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
                    >
                        <div className="space-y-3">
                            {/* Event Image */}
                            <div className="relative">
                                {event.poster ? (
                                    <img
                                        src={`${API_BASE_URL}${event.poster}`}
                                        alt={event.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {event.name?.charAt(0) || 'E'}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Event Status Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
                                        {event.status || 'Active'}
                                    </span>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                                    {event.name}
                                </h3>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <ClockIcon className="h-4 w-4" />
                                    <span>{event.time || 'TBD'}</span>
                                </div>
                                
                                {event.venue_id && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <MapPinIcon className="h-4 w-4" />
                                        <span className="truncate">Venue #{event.venue_id}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-bold text-purple-600">
                                            {formatPrice(event.price)}
                                        </span>
                                        {event.capacity && (
                                            <span className="text-sm text-gray-500">
                                                • {event.capacity} spots
                                            </span>
                                        )}
                                    </div>
                                    
                                    {event.category && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {event.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {/* View More Button */}
            <div className="mt-6 text-center">
                <Link
                    to="/events"
                    className="inline-flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View All Events
                </Link>
            </div>
        </div>
    );
};

export default SimilarEvents;
