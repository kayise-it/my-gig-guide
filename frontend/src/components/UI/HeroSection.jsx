import React, { useEffect, useRef } from 'react';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid';
import { 
  StarIcon as StarIconOutline,
  HeartIcon as HeartIconOutline,
  MusicalNoteIcon,
  CalendarDaysIcon,
  UsersIcon,
  SparklesIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  ShareIcon,
  BuildingLibraryIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeroBreadcrumb } from './DynamicBreadcrumb';

const HeroSection = ({
  // Content props
  title,
  subtitle,
  description,
  image,
  fallbackIcon: FallbackIcon,
  fallbackText,
  
  // Breadcrumb props
  breadcrumbs,
  showHome = true,
  
  // Action props
  onShare,
  onFavorite,
  isFavorite = false,
  favoriteText = "Favorite",
  
  // Stats props
  stats = [],
  
  // Rating props
  rating,
  ratingText = "Rating",
  
  // CTA props
  ctaText,
  ctaIcon: CtaIcon,
  onCtaClick,
  
  // Custom content
  children,
  
  // Styling
  className = "",
  imageClassName = "",
  overlayClassName = "",
  contentClassName = ""
}) => {
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      navigator.share({
        title: title,
        text: description || `Check out ${title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite();
    }
  };

  // Parallax scroll effect
  const heroRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !bgImageRef.current) return;
      
      const scrolled = window.pageYOffset;
      const heroTop = heroRef.current.offsetTop;
      const heroHeight = heroRef.current.offsetHeight;
      
      // Only apply parallax when hero is in view
      if (scrolled >= heroTop - window.innerHeight && scrolled <= heroTop + heroHeight) {
        const parallaxOffset = (scrolled - heroTop) * 0.5; // Adjust speed here (0.5 = slower movement)
        bgImageRef.current.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;
      }
    };

    // Add smooth scrolling to the page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className={`relative w-full h-[500px] overflow-hidden ${className}`}>
        {/* Floating Action Buttons */}
        <div className="absolute top-6 right-6 z-20 flex space-x-3">
          <button 
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-100 transition-all duration-300 hover:scale-110 group"
          >
            <ShareIcon className="h-5 w-5 group-hover:text-purple-600 transition-colors duration-300" />
          </button>
          <button 
            onClick={handleFavorite}
            className={`backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <HeartIconOutline className={`h-5 w-5 transition-all duration-300 ${
              isFavorite ? 'fill-current' : 'group-hover:fill-current'
            }`} />
          </button>
        </div>

        {/* Background Image or Fallback */}
        {image ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={image}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-all duration-700 parallax-bg ${imageClassName}`}
              style={{
                transform: 'translateY(0px) scale(1.1)',
                willChange: 'transform'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30"></div>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="relative mb-6">
                  <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
                  {FallbackIcon && <FallbackIcon className="relative h-20 w-20 mx-auto opacity-90" />}
                </div>
                <span className="text-2xl font-semibold">{fallbackText || "Image Coming Soon"}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Overlay */}
        <div className={`absolute inset-0 flex items-center ${overlayClassName}`}>
          <div className="p-8 w-full heroCont">
            {/* Breadcrumb at the top of content */}
            {breadcrumbs && (
              <div className="max-w-6xl mx-auto mb-8">
                <HeroBreadcrumb
                  customBreadcrumbs={breadcrumbs}
                  showHome={showHome}
                />
              </div>
            )}
            <div className={`max-w-6xl mx-auto ${contentClassName}`}>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1 mb-6 lg:mb-0">
                  {/* Subtitle/Badge */}
                  {subtitle && (
                    <div className="mb-4">
                      <span className="inline-flex items-center bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        {subtitle}
                      </span>
                    </div>
                  )}
                  
                  {/* Main Title */}
                  <h1 className="text-4xl lg:text-6xl font-black text-white drop-shadow-2xl mb-4 leading-tight">
                    {title}
                  </h1>
                  
                  {/* Stats */}
                  {stats.length > 0 && (
                    <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg">
                      {stats.map((stat, index) => (
                        <div key={index} className="flex items-center">
                          {stat.icon && <stat.icon className="h-6 w-6 mr-2 text-purple-300" />}
                          <span>{stat.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Right Side Content */}
                <div className="lg:ml-8">
                  {/* Rating Card */}
                  {rating && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shadow-xl mb-4">
                      <div className="flex items-center justify-center mb-1">
                        <StarIconSolid className="h-5 w-5 text-yellow-300 mr-1" />
                        <span className="text-2xl font-bold text-white">{rating}</span>
                      </div>
                      <div className="text-blue-200 text-sm">{ratingText}</div>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  {ctaText && onCtaClick && (
                    <button 
                      onClick={onCtaClick}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group"
                    >
                      {CtaIcon && <CtaIcon className="h-5 w-5 mr-2" />}
                      <span>{ctaText}</span>
                      <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Custom Children Content */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
