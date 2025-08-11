import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const GalleryPlaceholder = ({ 
    size = "default", 
    className = "", 
    iconSize = "h-6 w-6",
    iconColor = "text-gray-400",
    borderColor = "border-gray-300",
    backgroundColor = "bg-gray-100/50"
}) => {
    const sizeClasses = {
        small: "h-16 w-16",
        default: "h-24 w-24", 
        large: "h-32 w-32",
        full: "h-full w-full"
    };

    return (
        <div 
            className={`
                ${backgroundColor} 
                border-2 
                border-dashed 
                ${borderColor} 
                rounded-xl 
                flex 
                items-center 
                justify-center 
                ${sizeClasses[size]} 
                ${className}
            `}
        >
            <SparklesIcon className={iconSize + " " + iconColor} />
        </div>
    );
};

export default GalleryPlaceholder;
