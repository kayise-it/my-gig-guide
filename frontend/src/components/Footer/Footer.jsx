// src/components/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  MusicalNoteIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
// We'll use simple icons or text for social media since Heroicons doesn't include brand icons

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl mr-3">
                <MusicalNoteIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  MyGigGuide
                </h3>
                <p className="text-gray-400 text-sm">Where Music Meets Magic</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Discover amazing events, connect with talented artists, and experience unforgettable performances in your city.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-purple-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 text-sm font-medium">
                FB
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-500 p-3 rounded-xl transition-all duration-300 hover:scale-110 text-sm font-medium">
                TW
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 text-sm font-medium">
                IG
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 text-sm font-medium">
                LI
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Events
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Artists
                </Link>
              </li>
              <li>
                <Link to="/venues" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Venues
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Safety Guidelines</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Community</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300 text-sm">123 Music Street, Cape Town, South Africa</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                <a href="mailto:hello@mygigguide.com" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  hello@mygigguide.com
                </a>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                <a href="tel:+27123456789" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  +27 12 345 6789
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-white font-medium mb-3">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
                />
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-r-xl transition-all duration-300 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} MyGigGuide. Made with{" "}
                <HeartIcon className="h-4 w-4 text-red-500 inline mx-1" />
                for music lovers.
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}