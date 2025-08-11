import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MusicalNoteIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  MicrophoneIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: 1,
      name: 'Jazz Under the Stars',
      artist: 'The Midnight Keys',
      venue: 'Blue Note Lounge',
      date: 'Tonight',
      time: '8:00 PM',
      price: 'R150'
    },
    {
      id: 2,
      name: 'Electronic Nights',
      artist: 'Neon Waves',
      venue: 'The Electric Factory',
      date: 'Tomorrow',
      time: '10:00 PM',
      price: 'R250'
    },
    {
      id: 3,
      name: 'Acoustic Sessions',
      artist: 'Rusty Strings',
      venue: 'Harmony Hall',
      date: 'This Weekend',
      time: '7:00 PM',
      price: 'R100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      
      {/* Clean Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Simple Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-sm">
                <MusicalNoteIcon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Clean Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Find the best concerts, festivals, and events happening in your area
            </p>

            {/* Clean Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-32 py-4 border border-purple-200 rounded-2xl text-lg placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <Link
                    to="/events"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-sm"
                  >
                    <span>Search</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Clean Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/events"
                className="bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow-md"
              >
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Browse All Events</span>
              </Link>
              <Link 
                to="/artists"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow-md"
              >
                <MicrophoneIcon className="h-5 w-5" />
                <span>Discover Artists</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Happening{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Soon
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these amazing upcoming events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {event.price}
                  </span>
                </div>
                
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <MicrophoneIcon className="h-4 w-4 text-purple-500 mr-3" />
                    <span>{event.artist}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-purple-500 mr-3" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-purple-500 mr-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-purple-500 mr-3" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                >
                  <span>View Details</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              View all events
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Something Amazing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of music lovers discovering the best events in their city
          </p>
          <Link
            to="/events"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
