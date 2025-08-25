import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import StarRating from './StarRating';

const RatingCard = ({ 
  rating = 0, 
  totalRatings = 0, 
  label = "Rating",
  size = 'md',
  className = '',
  showTotal = true
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-3 py-2',
          rating: 'text-lg',
          label: 'text-xs',
          star: 'w-4 h-4'
        };
      case 'lg':
        return {
          container: 'px-6 py-4',
          rating: 'text-2xl',
          label: 'text-base',
          star: 'w-6 h-6'
        };
      default:
        return {
          container: 'px-4 py-3',
          rating: 'text-xl',
          label: 'text-sm',
          star: 'w-5 h-5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`
      bg-black/20 backdrop-blur-md 
      border border-white/10 
      rounded-2xl 
      ${sizeClasses.container}
      ${className}
    `}>
      <div className="flex items-center justify-center mb-1">
        <StarIcon className={`${sizeClasses.star} text-yellow-400 mr-2`} />
        <span className={`font-bold text-white ${sizeClasses.rating}`}>
          {rating.toFixed(1)}
        </span>
      </div>
      <div className="text-center">
        <span className={`text-gray-200 ${sizeClasses.label}`}>
          {label}
        </span>
        {showTotal && totalRatings > 0 && (
          <span className={`text-gray-300 ${sizeClasses.label} block`}>
            ({totalRatings} reviews)
          </span>
        )}
      </div>
    </div>
  );
};

export default RatingCard;


