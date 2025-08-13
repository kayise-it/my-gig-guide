import React from 'react';
import { SparklesIcon, EyeIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../api/config';

const GalleryImage = ({ 
    image, 
    index, 
    alt, 
    onClick, 
    className = "",
    size = "medium", // small, medium, large
    showNumber = true,
    showHoverIcon = true,
    aspectRatio = "square" // square, wide, tall
}) => {
    // Handle image URL construction
    const imageUrl = React.useMemo(() => {
        if (!image) return 'https://via.placeholder.com/300x300/E5E7EB/9CA3AF?text=No+Image';
        if (image.startsWith('http')) return image;
        
        // Ensure the path starts with /
        const cleanPath = image.startsWith('/') ? image : `/${image}`;
        
        // Fix the malformed paths from database
        // Database has: /artists/events/events/1_kamal_lamb/gallery/...
        // Should be: /artists/3_Thando_8146/events/1_kamal_lamb/gallery/...
        let correctedPath = cleanPath;
        
        // Remove duplicate "events" and fix the artist path
        if (correctedPath.includes('/artists/events/events/')) {
            correctedPath = correctedPath.replace('/artists/events/events/', '/artists/3_Thando_8146/events/');
        }
        
        // If the path already contains the correct structure, use it as is
        if (correctedPath.includes('/artists/3_Thando_8146/') || correctedPath.includes('/organiser/')) {
            return `http://localhost:5173${correctedPath}`;
        }
        
        // Fallback to the old structure if needed
        correctedPath = correctedPath.replace('/artists/events/', '/artists/3_Thando_8146/events/');
        return `http://localhost:5173${correctedPath}`;
    }, [image]);

    // Debug logging for first image only (if needed)
    React.useEffect(() => {
        if (index === 0 && !image?.startsWith('http')) {
            console.log(`GalleryImage loading:`, imageUrl);
            console.log(`Original image path:`, image);
        }
    }, [image, imageUrl, index]);
    
    // Size variants
    const sizeClasses = {
        small: "h-28",
        medium: "h-40", 
        large: "h-56"
    };
    
    // Aspect ratio variants
    const aspectClasses = {
        square: "aspect-square",
        wide: "aspect-video",
        tall: "aspect-[3/4]"
    };
    
    return (
        <div 
            className={`
                relative overflow-hidden rounded-xl cursor-pointer group 
                shadow-sm hover:shadow-lg transition-all duration-300 
                border border-purple-200 hover:border-purple-400 
                bg-gradient-to-br from-white to-purple-50 hover:to-blue-50
                transform hover:scale-105
                ${aspectClasses[aspectRatio]}
                ${sizeClasses[size]}
                ${className}
            `}
            onClick={onClick}
        >
            {/* Main Image */}
            <img
                src={imageUrl}
                alt={alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=Image+Not+Found';
                }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
            
            {/* Hover Icon */}
            {showHoverIcon && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl border border-purple-200">
                        <EyeIcon className="h-6 w-6 text-purple-600" />
                    </div>
                </div>
            )}
            
            {/* Image Number Badge */}
            {showNumber && (
                <div className="absolute top-2 right-2 transform transition-all duration-300 group-hover:scale-110">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        {index + 1}
                    </div>
                </div>
            )}
            
            {/* Corner Sparkle */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12">
                <SparklesIcon className="h-4 w-4 text-white drop-shadow-lg" />
            </div>
            
            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            
            {/* Loading Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse opacity-0 group-hover:opacity-0"></div>
        </div>
    );
};

export default GalleryImage;
