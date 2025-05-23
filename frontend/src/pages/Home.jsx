import { useState } from 'react';
import { FiMapPin, FiCalendar, FiSearch, FiMusic } from 'react-icons/fi';


const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample gig data
  const gigs = [
    {
      id: 1,
      artist: 'The Midnight Keys',
      venue: 'Blue Note Lounge',
      date: 'Fri, Jun 10 • 8:00 PM',
      price: 'R15',
      genre: 'Jazz'
    },
    {
      id: 2,
      artist: 'Neon Waves',
      venue: 'The Electric Factory',
      date: 'Sat, Jun 11 • 10:00 PM',
      price: 'R25',
      genre: 'Electronic'
    },
    {
      id: 3,
      artist: 'Rusty Strings',
      venue: 'Harmony Hall',
      date: 'Sun, Jun 12 • 7:00 PM',
      price: 'R10',
      genre: 'Folk'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiMusic className="text-purple-500 text-2xl" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              GigGuide
            </span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-purple-400 transition">Home</a>
            <a href="#" className="hover:text-purple-400 transition">Upcoming</a>
            <a href="#" className="hover:text-purple-400 transition">Venues</a>
            <a href="Event/Registration" className="hover:text-purple-400 transition">Add Event</a>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover <span className="text-purple-400 flip" data-flips="['Live Music', 'Poetry', 'Public Speaking']">Live Music</span> Near You
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Find concerts, gigs, and events in your city. Never miss your favorite artist again!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search by artist, venue, or genre..."
                className="flex-grow p-4 bg-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-purple-600 hover:bg-purple-700 px-6 py-4 transition">
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-12 px-6 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiMapPin className="mr-2 text-purple-400" /> Live Events Map
          </h2>
          <div className="bg-gray-700 rounded-xl h-96 flex items-center justify-center">
            <p className="text-gray-400">Interactive map will appear here</p>
            {/* Your Map component will go here */}
          </div>
        </div>
      </section>

      {/* Gig Listings */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FiCalendar className="mr-2 text-purple-400" /> Upcoming Gigs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div key={gig.id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{gig.artist}</h3>
                      <p className="text-gray-400">{gig.venue}</p>
                    </div>
                    <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                      {gig.genre}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-gray-300">
                      <p>{gig.date}</p>
                      <p className="text-purple-400 font-medium">{gig.price}</p>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition">
                      Get Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} GigGuide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;