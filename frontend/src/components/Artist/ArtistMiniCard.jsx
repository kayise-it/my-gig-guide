import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../../api/config';

const ArtistMiniCard = ({ 
    artist, 
    size = "medium", // small, medium, large
    showName = true,
    showBadge = false,
    className = ""
}) => {
    const navigate = useNavigate();

    if (!artist) return null;

    // Size variants
    const sizeClasses = {
        small: "w-16 h-16", // 64px
        medium: "w-20 h-20", // 80px
        large: "w-24 h-24" // 96px
    };

    const textSizes = {
        small: "text-xs",
        medium: "text-sm", 
        large: "text-base"
    };

    const badgeSizes = {
        small: "h-3 w-3",
        medium: "h-4 w-4",
        large: "h-5 w-5"
    };

    // Construct profile image URL
    const profileImageUrl = React.useMemo(() => {
        if (artist.profile_image) {
            if (artist.profile_image.startsWith('http')) {
                return artist.profile_image;
            }
            const cleanPath = artist.profile_image.startsWith('/') ? artist.profile_image : `/${artist.profile_image}`;
            return `${API_BASE_URL}${cleanPath}`;
        }
        return null;
    }, [artist.profile_image]);

    const handleClick = () => {
        navigate(`/artist/${artist.id}`);
    };

    return (
        <div 
            className={`
                relative flex flex-col items-center cursor-pointer group
                transition-all duration-300 hover:scale-105
                ${className}
            `}
            onClick={handleClick}
        >
            {/* Artist Image/Avatar */}
            <div 
                className={`
                    relative overflow-hidden rounded-xl
                    bg-gradient-to-br from-purple-100 to-blue-100
                    border-2 border-white shadow-lg
                    group-hover:shadow-xl group-hover:border-purple-300
                    transition-all duration-300
                    ${sizeClasses[size]}
                `}
            >
                {profileImageUrl ? (
                    <img
                        src={profileImageUrl}
                        alt={artist.stage_name || artist.name || 'Artist'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0QzE0IDUuMSAxMy4xIDYgMTIgNkMxMC45IDYgMTAgNS4xIDEwIDRDMTAgMi45IDEwLjkgMiAxMiAyWk0yMSA5VjIySDNWOUwxMiA5WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200">
                        <UserIcon className={`text-purple-600 ${badgeSizes[size === 'small' ? 'medium' : size]}`} />
                    </div>
                )}

                {/* Featured Badge */}
                {showBadge && (
                    <div className="absolute -top-1 -right-1">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1 shadow-sm">
                            <SparklesIcon className={`text-white ${badgeSizes[size]}`} />
                        </div>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                
                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <UserIcon className="h-3 w-3 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Artist Name */}
            {showName && (
                <div className="mt-2 text-center">
                    <p className={`
                        font-medium text-gray-800 group-hover:text-purple-600 
                        transition-colors duration-300 truncate max-w-full
                        ${textSizes[size]}
                    `}>
                        {artist.stage_name || artist.name || 'Unknown Artist'}
                    </p>
                    {artist.genre && (
                        <p className={`
                            text-gray-500 group-hover:text-gray-600
                            transition-colors duration-300 truncate
                            ${size === 'small' ? 'text-xs' : 'text-xs'}
                        `}>
                            {artist.genre}
                        </p>
                    )}
                </div>
            )}

            {/* Bottom Glow Effect */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
    );
};

export default ArtistMiniCard;
