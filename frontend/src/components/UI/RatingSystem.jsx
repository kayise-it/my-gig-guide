import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';
import RatingCard from './RatingCard';
import RatingForm from './RatingForm';
import ratingService from '../../services/ratingService';
import { StarIcon } from '@heroicons/react/24/solid';

const RatingSystem = ({ 
  rateableType, 
  rateableId, 
  label = "Rating",
  showForm = true,
  showReviews = false,
  className = ''
}) => {
  const { currentUser } = useAuth();
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    loadRatingData();
  }, [rateableType, rateableId]);

  const loadRatingData = async () => {
    setIsLoading(true);
    try {
      // Load average rating
      const avgData = await ratingService.getAverageRating(rateableType, rateableId);
      setAverageRating(parseFloat(avgData.avgRating) || 0);
      setTotalRatings(avgData.totalRatings || 0);

      // Load user rating if authenticated
      if (currentUser) {
        const userData = await ratingService.getUserRating(rateableType, rateableId);
        setUserRating(userData.rating);
      }

      // Load reviews if needed
      if (showReviews) {
        const reviewsData = await ratingService.getItemRatings(rateableType, rateableId, 1, 5);
        setReviews(reviewsData.ratings || []);
      }
    } catch (error) {
      console.error('Error loading rating data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      const result = await ratingService.createOrUpdateRating(ratingData);
      
      // Update local state
      setAverageRating(parseFloat(result.averageRating.avgRating) || 0);
      setTotalRatings(result.averageRating.totalRatings || 0);
      setUserRating(result.rating);
      setShowRatingForm(false);

      // Reload reviews if showing them
      if (showReviews) {
        const reviewsData = await ratingService.getItemRatings(rateableType, rateableId, 1, 5);
        setReviews(reviewsData.ratings || []);
      }

      return result;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  };

  const handleDeleteRating = async () => {
    try {
      const result = await ratingService.deleteRating(rateableType, rateableId);
      
      // Update local state
      setAverageRating(parseFloat(result.averageRating.avgRating) || 0);
      setTotalRatings(result.averageRating.totalRatings || 0);
      setUserRating(null);

      // Reload reviews if showing them
      if (showReviews) {
        const reviewsData = await ratingService.getItemRatings(rateableType, rateableId, 1, 5);
        setReviews(reviewsData.ratings || []);
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  const handleEditRating = () => {
    setShowRatingForm(true);
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Rating Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <RatingCard
            rating={averageRating}
            totalRatings={totalRatings}
            label={label}
            size="md"
          />
          
          {currentUser && (
            <div className="flex items-center space-x-2">
              {userRating ? (
                <>
                  <span className="text-sm text-gray-600">Your rating:</span>
                  <StarRating
                    rating={userRating.rating}
                    readonly={true}
                    size="sm"
                    showValue={false}
                  />
                  <button
                    onClick={handleEditRating}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteRating}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600">Rate this {rateableType}:</span>
                  <button
                    onClick={() => setShowRatingForm(true)}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Add Rating
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating Form */}
      {showForm && showRatingForm && (
        <div className="mb-6">
          <RatingForm
            onSubmit={handleRatingSubmit}
            onCancel={() => setShowRatingForm(false)}
            initialRating={userRating?.rating || 0}
            initialReview={userRating?.review || ''}
            rateableType={rateableType}
            rateableId={rateableId}
          />
        </div>
      )}

      {/* Reviews Section */}
      {showReviews && reviews.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Reviews ({totalRatings})
          </h4>
          
          <div className="space-y-4">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <StarRating
                      rating={review.rating}
                      readonly={true}
                      size="sm"
                      showValue={false}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {review.user?.username || 'Anonymous'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.review && (
                  <p className="text-sm text-gray-700">{review.review}</p>
                )}
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              {showAllReviews ? 'Show Less' : `Show All ${totalRatings} Reviews`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingSystem;


