import React from 'react';
import RatingSystem from '../components/UI/RatingSystem';
import StarRating from '../components/UI/StarRating';
import RatingCard from '../components/UI/RatingCard';
import RatingForm from '../components/UI/RatingForm';

const RatingDemo = () => {
  const handleRatingSubmit = async (ratingData) => {
    console.log('Rating submitted:', ratingData);
    // In a real app, this would call the API
    alert(`Rating submitted: ${ratingData.rating} stars${ratingData.review ? ` with review: "${ratingData.review}"` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rating System Demo</h1>
          <p className="text-lg text-gray-600">
            Explore the different rating components and their functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo 1: Basic Star Rating */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Star Rating</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interactive Rating</label>
                <StarRating
                  rating={0}
                  onRatingChange={(rating) => console.log('Rating changed:', rating)}
                  size="lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Read-only Rating</label>
                <StarRating
                  rating={4.2}
                  readonly={true}
                  size="md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Small Rating</label>
                <StarRating
                  rating={3.8}
                  readonly={true}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Demo 2: Rating Cards */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Cards</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artist Rating Card</label>
                <RatingCard
                  rating={4.8}
                  totalRatings={124}
                  label="Artist Rating"
                  size="md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Rating Card</label>
                <RatingCard
                  rating={4.2}
                  totalRatings={89}
                  label="Venue Rating"
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Demo 3: Rating Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Form</h2>
            <RatingForm
              onSubmit={handleRatingSubmit}
              onCancel={() => console.log('Form cancelled')}
              rateableType="artist"
              rateableId={1}
            />
          </div>

          {/* Demo 4: Complete Rating System */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Rating System</h2>
            <RatingSystem
              rateableType="artist"
              rateableId={1}
              label="Artist Rating"
              showForm={true}
              showReviews={true}
            />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Usage Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Artist Pages</h3>
              <p className="text-sm text-gray-600 mb-3">
                Display ratings and allow users to rate artists
              </p>
              <code className="text-xs bg-gray-100 p-2 rounded block">
                {`<RatingSystem
  rateableType="artist"
  rateableId={artistId}
  label="Artist Rating"
  showForm={true}
  showReviews={true}
/>`}
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Event Pages</h3>
              <p className="text-sm text-gray-600 mb-3">
                Show event ratings and reviews
              </p>
              <code className="text-xs bg-gray-100 p-2 rounded block">
                {`<RatingSystem
  rateableType="event"
  rateableId={eventId}
  label="Event Rating"
  showForm={true}
  showReviews={true}
/>`}
              </code>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Venue Pages</h3>
              <p className="text-sm text-gray-600 mb-3">
                Display venue ratings
              </p>
              <code className="text-xs bg-gray-100 p-2 rounded block">
                {`<RatingSystem
  rateableType="venue"
  rateableId={venueId}
  label="Venue Rating"
  showForm={true}
  showReviews={false}
/>`}
              </code>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
          <div className="space-y-2 text-sm">
            <div><strong>POST /api/ratings</strong> - Create or update a rating</div>
            <div><strong>GET /api/ratings/average/:type/:id</strong> - Get average rating</div>
            <div><strong>GET /api/ratings/user/:type/:id</strong> - Get user's rating</div>
            <div><strong>GET /api/ratings/:type/:id</strong> - Get all ratings for an item</div>
            <div><strong>DELETE /api/ratings/:type/:id</strong> - Delete user's rating</div>
            <div><strong>GET /api/ratings/user/ratings</strong> - Get user's all ratings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingDemo;


