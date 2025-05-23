import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/events/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
        } else {
          setError(response.data.message || 'Event not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading event...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!event) return <div className="text-center py-8">Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-600 mb-2">
        {new Date(event.date).toLocaleDateString()} at {event.time}
      </p>
      {event.price > 0 && (
        <p className="text-lg font-semibold mb-4">Price: R{event.price.toFixed(2)}</p>
      )}
      <div className="prose max-w-none">
        <p>{event.description}</p>
      </div>
      {event.ticket_url && (
        <a 
          href={event.ticket_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Get Tickets
        </a>
      )}
    </div>
  );
}