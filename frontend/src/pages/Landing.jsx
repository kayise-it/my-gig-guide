import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  MicrophoneIcon,
  MusicalNoteIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  HeartIcon,
  UsersIcon,
  StarIcon
} from '@heroicons/react/24/outline';

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Hero carousel data
  const heroSlides = [
    {
      title: "Discover Live Music",
      subtitle: "Find the hottest concerts and gigs in your area",
      accent: "from-purple-600 to-pink-600"
    },
    {
      title: "Connect with Artists", 
      subtitle: "Follow your favorite performers and never miss a show",
      accent: "from-blue-600 to-cyan-600"
    },
    {
      title: "Experience Every Beat",
      subtitle: "From intimate venues to grand stages - we bring it all to you",
      accent: "from-orange-600 to-red-600"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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

  const features = [
    {
      icon: CalendarDaysIcon,
      title: "Live Events",
      description: "Discover concerts, festivals, and live performances happening near you",
      color: "text-purple-600"
    },
    {
      icon: MapPinIcon,
      title: "Local Venues",
      description: "Explore unique venues and hidden gems in your city",
      color: "text-blue-600"
    },
    {
      icon: MicrophoneIcon,
      title: "Artist Profiles",
      description: "Connect with local and touring artists, follow their journey",
      color: "text-pink-600"
    },
    {
      icon: UsersIcon,
      title: "Community",
      description: "Join a vibrant community of music lovers and entertainment seekers",
      color: "text-green-600"
    }
  ];

  const categories = [
    { name: "Rock & Alternative", count: "150+ Events", color: "bg-red-500" },
    { name: "Electronic & Dance", count: "200+ Events", color: "bg-blue-500" },
    { name: "Hip Hop & R&B", count: "120+ Events", color: "bg-purple-500" },
    { name: "Jazz & Blues", count: "80+ Events", color: "bg-yellow-500" },
    { name: "Pop & Indie", count: "180+ Events", color: "bg-pink-500" },
    { name: "World Music", count: "90+ Events", color: "bg-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 1s ease-out forwards;
        }
      `}</style>

      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                index === currentSlide ? 'translate-x-0' : 
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80" />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-20`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-8">
            {/* Animated Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-75 blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-full">
                  <MusicalNoteIcon className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            {/* Cascading Text Animation */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                <span className="block overflow-hidden">
                  <span className="block opacity-0 animate-slideUp" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
                    GIG
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="block opacity-0 animate-slideUp bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    GUIDE
                  </span>
                </span>
              </h1>
              
              <div className="overflow-hidden">
                <p className="text-2xl md:text-3xl font-light text-gray-300 opacity-0 animate-slideUp" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                  {heroSlides[currentSlide].title}
                </p>
              </div>
              
              <div className="overflow-hidden">
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto opacity-0 animate-slideUp" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                  {heroSlides[currentSlide].subtitle}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-slideUp" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <Link 
                to="/Events"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Explore Events</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/Artists"
                className="group border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Discover Artists</span>
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 right-8 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000 ${
              isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Entertainment
              </span>{" "}
              <span className="text-white">at Your Fingertips</span>
            </h2>
            <p className={`text-xl text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              We bring the best of live entertainment directly to you, making it easier than ever to discover, connect, and experience amazing events.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-900/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-purple-500/50 ${
                    isVisible.features 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100 + 400}ms` }}
                >
                  <div className={`${feature.color} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" data-animate className="py-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000 ${
              isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span className="text-white">Every Genre,</span>{" "}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Every Vibe
              </span>
            </h2>
            <p className={`text-xl text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              From underground shows to mainstream concerts, discover events across all music genres and entertainment styles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 hover:scale-105 transition-all duration-500 cursor-pointer border border-gray-700 hover:border-purple-500/50 ${
                  isVisible.categories 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100 + 400}ms` }}
              >
                <div className={`absolute top-0 right-0 w-20 h-20 ${category.color} rounded-bl-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                <div className={`w-12 h-12 ${category.color} rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <MusicalNoteIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {category.count}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Events Map Placeholder */}
      <section className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Live Events Map
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Interactive map coming soon - discover events happening right around you
          </p>
          <div className="bg-gray-900/50 rounded-2xl p-16 border-2 border-dashed border-purple-500/30">
            <MapPinIcon className="h-24 w-24 text-purple-400 mx-auto mb-6 opacity-50" />
            <p className="text-gray-500 text-lg">Map Integration Coming Soon</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <SparklesIcon className="h-16 w-16 text-yellow-400 mx-auto animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Ready to Experience
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                The Beat?
              </span>
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of music lovers who trust Gig Guide to discover their next unforgettable experience.
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
                to="/Events"
                className="group border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center space-x-2"
              >
                <StarIcon className="h-5 w-5" />
                <span>Browse Events</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;

