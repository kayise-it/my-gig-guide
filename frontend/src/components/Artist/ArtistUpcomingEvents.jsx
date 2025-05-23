import EventCard from '../Events/EventCard';

export default function ArtistUpcomingEvents({ events }) {
  return (
    <div className="space-y-4 px-6 py-5 bg-white shadow rounded-lg overflow-hidden">
      <h4 className="text-lg font-bold text-gray-900">Upcoming Events</h4>
      <div className="grid grid-cols-2 gap-4">
        {events.map(event => (
          <EventCard 
            key={event.id}
            event={event}
            who="artists/dashboard"
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}