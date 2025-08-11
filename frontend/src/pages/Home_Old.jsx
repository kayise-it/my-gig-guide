import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  MagnifyingGlassIcon, 
  MusicalNoteIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  HeartIcon,
  StarIcon,
  ClockIcon,
  TicketIcon,
  MicrophoneIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import ArtistMiniCard from '../components/Artist/ArtistMiniCard';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredSlide, setFeaturedSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [realArtists, setRealArtists] = useState([]);

  // Featured content carousel
  const featuredContent = [
    {
      type: 'event',
      title: 'Summer Music Festival',
      subtitle: 'Electronic Dance Music Extravaganza',
      artist: 'Various Artists',
      venue: 'Millennium Park',
      date: 'Sat, Jul 15',
      image: '/frontend/public/Background_pic/1Profile.jpeg',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      type: 'artist',
      title: 'Rising Star Showcase',
      subtitle: 'Discover the next big thing in music',
      artist: 'The Midnight Keys',
      venue: 'Blue Note Lounge',
      date: 'Fri, Jul 21',
      image: '/frontend/public/Background_pic/bprofile.jpeg',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      type: 'venue',
      title: 'New Venue Launch',
      subtitle: 'Experience music in a whole new way',
      artist: 'Multiple Acts',
      venue: 'The Electric Factory',
      date: 'Ongoing',
      image: '/frontend/public/Background_pic/dprofile.jpeg',
      gradient: 'from-pink-600 to-red-600'
    }
  ];

  // Sample gig data with enhanced information
  const upcomingGigs = [
    {
      id: 1,
      artist: 'The Midnight Keys',
      venue: 'Blue Note Lounge',
      date: 'Fri, Jun 10',
      time: '8:00 PM',
      price: 'R15',
      genre: 'Jazz',
      image: '/frontend/public/Background_pic/1Profile.jpeg',
      status: 'Available'
    },
    {
      id: 2,
      artist: 'Neon Waves',
      venue: 'The Electric Factory',
      date: 'Sat, Jun 11',
      time: '10:00 PM',
      price: 'R25',
      genre: 'Electronic',
      image: '/frontend/public/Background_pic/bprofile.jpeg',
      status: 'Selling Fast'
    },
    {
      id: 3,
      artist: 'Rusty Strings',
      venue: 'Harmony Hall',
      date: 'Sun, Jun 12',
      time: '7:00 PM',
      price: 'R10',
      genre: 'Folk',
      image: '/frontend/public/Background_pic/dprofile.jpeg',
      status: 'Available'
    },
    {
      id: 4,
      artist: 'Electric Soul',
      venue: 'Underground Club',
      date: 'Thu, Jun 15',
      time: '9:00 PM',
      price: 'R30',
      genre: 'R&B',
      image: '/frontend/public/Background_pic/Unknown.jpeg',
      status: 'VIP Available'
    }
  ];

  const featuredArtists = [
    { name: 'The Midnight Keys', genre: 'Jazz', followers: '2.5k' },
    { name: 'Neon Waves', genre: 'Electronic', followers: '5.2k' },
    { name: 'Rusty Strings', genre: 'Folk', followers: '1.8k' },
    { name: 'Electric Soul', genre: 'R&B', followers: '3.1k' },
    { name: 'Luna Vista', genre: 'Indie Pop', followers: '4.2k' },
    { name: 'Bass Nation', genre: 'Hip Hop', followers: '6.8k' },
    { name: 'Aurora Sound', genre: 'Ambient', followers: '1.5k' },
    { name: 'Fire & Steel', genre: 'Rock', followers: '8.1k' },
    { name: 'Velvet Dreams', genre: 'Soul', followers: '3.7k' },
    { name: 'Echo Chamber', genre: 'Alternative', followers: '2.9k' },
    { name: 'Digital Nomad', genre: 'Techno', followers: '5.5k' },
    { name: 'Sunset Drive', genre: 'Synthwave', followers: '4.3k' },
    { name: 'Ocean Blue', genre: 'Reggae', followers: '2.1k' },
    { name: 'City Lights', genre: 'Pop', followers: '7.2k' },
    { name: 'Wild Heart', genre: 'Country', followers: '3.4k' },
    { name: 'Starfall', genre: 'Dream Pop', followers: '2.8k' },
    { name: 'Neon Pulse', genre: 'Synth Pop', followers: '4.9k' },
    { name: 'Cosmic Drift', genre: 'Psychedelic', followers: '3.6k' },
    { name: 'Midnight Train', genre: 'Blues', followers: '2.2k' },
    { name: 'Phoenix Rising', genre: 'Metal', followers: '6.3k' },
    { name: 'Golden Hour', genre: 'Acoustic', followers: '1.9k' },
    { name: 'Storm Front', genre: 'Progressive', followers: '4.7k' },
    { name: 'Kaleidoscope', genre: 'Experimental', followers: '2.6k' },
    { name: 'Urban Jungle', genre: 'Trap', followers: '5.8k' }
  ];

  const trendingVenues = [
    { name: 'Blue Note Lounge', type: 'Jazz Club', capacity: '200', rating: '4.8' },
    { name: 'The Electric Factory', type: 'Concert Hall', capacity: '1,500', rating: '4.6' },
    { name: 'Harmony Hall', type: 'Acoustic Venue', capacity: '300', rating: '4.9' },
    { name: 'Underground Club', type: 'Intimate Space', capacity: '150', rating: '4.7' }
  ];

  // Auto-advance featured carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedSlide((prev) => (prev + 1) % featuredContent.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredContent.length]);

  // Fetch real artists data
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/artists`);
        if (response.data && Array.isArray(response.data)) {
          setRealArtists(response.data.slice(0, 24)); // Limit to 24 artists for grid
        }
      } catch (error) {
        console.error('Failed to fetch artists:', error);
        // Keep using dummy data if API fails
      }
    };

    fetchArtists();
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
      <section id="events" data-animate className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Happening{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                This Week
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't miss out on the hottest events in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingGigs.map((gig, index) => (
              <div
                key={gig.id}
                className={`group bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-900/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-purple-500/50 ${
                  isVisible.events 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100 + 400}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      gig.status === 'Selling Fast' 
                        ? 'bg-red-500 text-white' 
                        : gig.status === 'VIP Available'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-green-500 text-white'
                    }`}>
                      {gig.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-purple-900/80 text-purple-300 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {gig.genre}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                    {gig.artist}
                  </h3>
                  <div className="space-y-2 text-gray-400 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <BuildingLibraryIcon className="h-4 w-4" />
                      <span>{gig.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>{gig.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{gig.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-purple-400 font-bold text-lg">
                      {gig.price}
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 text-sm group-hover:scale-105">
                      <TicketIcon className="h-4 w-4" />
                      <span>Get Tickets</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/events"
              className="inline-flex items-center space-x-2 bg-gray-900/50 hover:bg-gray-900/80 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-gray-700 hover:border-purple-500/50"
            >
              <span>View All Events</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section id="artists" data-animate className="py-24 bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000 ${
              isVisible.artists ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Rising Stars
              </span>
            </h2>
            <p className={`text-xl text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible.artists ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Discover the artists everyone's talking about
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6">
            {(realArtists.length > 0 ? realArtists : featuredArtists).map((artist, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible.artists 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 50 + 400}ms` }}
              >
                <ArtistMiniCard
                  artist={{
                    id: artist.id || (index + 1),
                    name: artist.name || artist.stage_name,
                    stage_name: artist.stage_name || artist.name,
                    genre: artist.genre,
                    profile_image: artist.profile_image || null
                  }}
                  size="medium"
                  showName={true}
                  showBadge={index < 3} // Show badge for top 3 artists
                  className="text-white"
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/artists"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <MicrophoneIcon className="h-5 w-5" />
              <span>Explore All Artists</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Events Map */}
      <section id="map" data-animate className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000 ${
              isVisible.map ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span className="text-white">Live Events</span>{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Map
              </span>
            </h2>
            <p className={`text-xl text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible.map ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Interactive map coming soon - discover events happening right around you
            </p>
          </div>
          
          <div className={`bg-gray-900/50 rounded-2xl p-16 border-2 border-dashed border-purple-500/30 transition-all duration-1000 delay-400 ${
            isVisible.map ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center">
              <MapPinIcon className="h-24 w-24 text-purple-400 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-gray-300 mb-4">Interactive Map Coming Soon</h3>
              <p className="text-gray-500 text-lg mb-8">Find events near you with our upcoming location-based discovery feature</p>
              <div className="flex justify-center space-x-4">
                <span className="bg-purple-900/50 text-purple-300 px-4 py-2 rounded-full text-sm">
                  📍 Location-based search
                </span>
                <span className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm">
                  🗺️ Interactive venues
                </span>
                <span className="bg-pink-900/50 text-pink-300 px-4 py-2 rounded-full text-sm">
                  📱 Real-time updates
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Venues Section */}
      <section id="venues" data-animate className="py-24 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000 ${
              isVisible.venues ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span className="text-white">Trending</span>{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Venues
              </span>
            </h2>
            <p className={`text-xl text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible.venues ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              The hottest spots where magic happens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingVenues.map((venue, index) => (
              <div
                key={index}
                className={`group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-900/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-blue-500/50 ${
                  isVisible.venues 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100 + 400}ms` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BuildingLibraryIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {venue.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{venue.type}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>Cap: {venue.capacity}</span>
                    <span className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      {venue.rating}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 py-2 rounded-lg transition-colors duration-300 text-sm font-medium">
                    View Venue
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/venues"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <BuildingLibraryIcon className="h-5 w-5" />
              <span>Discover Venues</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <SparklesIcon className="h-16 w-16 text-yellow-400 mx-auto animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Join the
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Music Revolution
              </span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Connect with artists, discover venues, and never miss another amazing event in your city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup"
                className="group bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Get Started Free</span>
                <HeartIcon className="h-5 w-5 group-hover:text-red-500 transition-colors duration-300" />
              </Link>
              <Link 
                to="/events"
                className="group border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center space-x-2"
              >
                <CalendarDaysIcon className="h-5 w-5" />
                <span>Browse Events Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;