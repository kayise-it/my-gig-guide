import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showValue = true,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleMouseEnter = (starIndex) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex) => {
    if (!readonly && onRatingChange) {
      setCurrentRating(starIndex);
      onRatingChange(starIndex);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      case 'xl':
        return 'w-8 h-8';
      default:
        return 'w-5 h-5';
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || currentRating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      const StarComponent = isFilled ? StarIcon : StarOutlineIcon;
      
      stars.push(
        <StarComponent
          key={i}
          className={`${getSizeClasses()} ${
            isFilled 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          } ${
            !readonly ? 'cursor-pointer hover:scale-110 transition-transform' : ''
          }`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-2">
          {currentRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;


