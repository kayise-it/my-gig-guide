# Rating System Documentation

## Overview

The rating system is a comprehensive solution that allows users to rate and review artists, events, venues, and organisers. It features a polymorphic design that can be easily extended to rate any type of content.

## Features

- ⭐ **5-star rating system** (1.0 to 5.0)
- 📝 **Optional text reviews** (up to 500 characters)
- 🔄 **Update existing ratings** (users can modify their ratings)
- 📊 **Average rating calculations** with total review counts
- 👤 **User-specific ratings** (users can see their own ratings)
- 🗑️ **Delete ratings** (users can remove their ratings)
- 📱 **Responsive design** with multiple size options
- 🎨 **Beautiful UI components** matching your app's design

## Backend Implementation

### Database Schema

The rating system uses a polymorphic design with a single `ratings` table:

```sql
CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  rateableId INT NOT NULL,
  rateableType ENUM('artist', 'event', 'venue', 'organiser') NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  review TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_rating (userId, rateableId, rateableType),
  INDEX idx_rateable (rateableType, rateableId),
  INDEX idx_rating (rating)
);
```

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ratings` | Create or update a rating | Yes |
| GET | `/api/ratings/average/:type/:id` | Get average rating | No |
| GET | `/api/ratings/user/:type/:id` | Get user's rating | Yes |
| GET | `/api/ratings/:type/:id` | Get all ratings for an item | No |
| DELETE | `/api/ratings/:type/:id` | Delete user's rating | Yes |
| GET | `/api/ratings/user/ratings` | Get user's all ratings | Yes |

### Request/Response Examples

#### Create/Update Rating
```javascript
// Request
POST /api/ratings
{
  "rateableId": 123,
  "rateableType": "artist",
  "rating": 4.5,
  "review": "Amazing performance!"
}

// Response
{
  "message": "Rating created successfully",
  "rating": {
    "id": 1,
    "userId": 456,
    "rateableId": 123,
    "rateableType": "artist",
    "rating": 4.5,
    "review": "Amazing performance!",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "averageRating": {
    "avgRating": "4.3",
    "totalRatings": 15
  }
}
```

#### Get Average Rating
```javascript
// Request
GET /api/ratings/average/artist/123

// Response
{
  "avgRating": "4.3",
  "totalRatings": 15
}
```

## Frontend Components

### 1. StarRating Component

A reusable star rating component with interactive and read-only modes.

```jsx
import StarRating from '../components/UI/StarRating';

// Interactive rating
<StarRating
  rating={0}
  onRatingChange={(rating) => console.log('Rating:', rating)}
  size="lg"
  showValue={true}
/>

// Read-only rating
<StarRating
  rating={4.2}
  readonly={true}
  size="md"
/>
```

**Props:**
- `rating` (number): Current rating value (0-5)
- `onRatingChange` (function): Callback when rating changes
- `readonly` (boolean): Whether rating is interactive
- `size` (string): 'sm', 'md', 'lg', 'xl'
- `showValue` (boolean): Show numeric value next to stars
- `className` (string): Additional CSS classes

### 2. RatingCard Component

A beautiful card component that displays rating information with a frosted glass effect.

```jsx
import RatingCard from '../components/UI/RatingCard';

<RatingCard
  rating={4.8}
  totalRatings={124}
  label="Artist Rating"
  size="md"
  showTotal={true}
/>
```

**Props:**
- `rating` (number): Average rating value
- `totalRatings` (number): Total number of ratings
- `label` (string): Label text (e.g., "Artist Rating")
- `size` (string): 'sm', 'md', 'lg'
- `showTotal` (boolean): Show total ratings count
- `className` (string): Additional CSS classes

### 3. RatingForm Component

A form component for submitting ratings and reviews.

```jsx
import RatingForm from '../components/UI/RatingForm';

<RatingForm
  onSubmit={handleRatingSubmit}
  onCancel={() => setShowForm(false)}
  initialRating={userRating?.rating || 0}
  initialReview={userRating?.review || ''}
  rateableType="artist"
  rateableId={artistId}
/>
```

**Props:**
- `onSubmit` (function): Callback when form is submitted
- `onCancel` (function): Callback when form is cancelled
- `initialRating` (number): Initial rating value
- `initialReview` (string): Initial review text
- `rateableType` (string): Type of item being rated
- `rateableId` (number): ID of item being rated
- `className` (string): Additional CSS classes

### 4. RatingSystem Component

A comprehensive component that combines all rating functionality.

```jsx
import RatingSystem from '../components/UI/RatingSystem';

<RatingSystem
  rateableType="artist"
  rateableId={artistId}
  label="Artist Rating"
  showForm={true}
  showReviews={true}
/>
```

**Props:**
- `rateableType` (string): Type of item ('artist', 'event', 'venue', 'organiser')
- `rateableId` (number): ID of the item
- `label` (string): Label for the rating
- `showForm` (boolean): Show rating form
- `showReviews` (boolean): Show reviews section
- `className` (string): Additional CSS classes

## Integration Examples

### Artist Page Integration

```jsx
// In your artist page component
import RatingSystem from '../components/UI/RatingSystem';

function ArtistPage({ artistId }) {
  return (
    <div>
      {/* Artist info */}
      <h1>{artist.name}</h1>
      
      {/* Rating display in header */}
      <RatingSystem
        rateableType="artist"
        rateableId={artistId}
        label="Artist Rating"
        showForm={true}
        showReviews={false}
      />
      
      {/* Reviews section */}
      <div className="mt-8">
        <h2>Reviews & Ratings</h2>
        <RatingSystem
          rateableType="artist"
          rateableId={artistId}
          label="Artist Rating"
          showForm={true}
          showReviews={true}
        />
      </div>
    </div>
  );
}
```

### Event Page Integration

```jsx
// In your event page component
function EventPage({ eventId }) {
  return (
    <div>
      {/* Event info */}
      <h1>{event.name}</h1>
      
      {/* Rating display */}
      <RatingSystem
        rateableType="event"
        rateableId={eventId}
        label="Event Rating"
        showForm={true}
        showReviews={true}
      />
    </div>
  );
}
```

### Venue Page Integration

```jsx
// In your venue page component
function VenuePage({ venueId }) {
  return (
    <div>
      {/* Venue info */}
      <h1>{venue.name}</h1>
      
      {/* Rating display */}
      <RatingSystem
        rateableType="venue"
        rateableId={venueId}
        label="Venue Rating"
        showForm={true}
        showReviews={false}
      />
    </div>
  );
}
```

## Service Layer

The rating system includes a service layer for API communication:

```javascript
import ratingService from '../services/ratingService';

// Create or update a rating
const result = await ratingService.createOrUpdateRating({
  rateableId: 123,
  rateableType: 'artist',
  rating: 4.5,
  review: 'Great performance!'
});

// Get average rating
const avgRating = await ratingService.getAverageRating('artist', 123);

// Get user's rating
const userRating = await ratingService.getUserRating('artist', 123);

// Get all ratings for an item
const allRatings = await ratingService.getItemRatings('artist', 123, 1, 10);

// Delete rating
await ratingService.deleteRating('artist', 123);
```

## Styling

The rating system uses Tailwind CSS and includes:

- **Responsive design** that works on all screen sizes
- **Hover effects** and smooth transitions
- **Frosted glass effect** for rating cards
- **Consistent color scheme** matching your app's design
- **Accessibility features** with proper ARIA labels

## Demo Page

Visit `/rating-demo` to see all components in action and explore their functionality.

## Database Setup

### Option 1: Automated Setup (Recommended)

Run the comprehensive setup script:

```bash
cd backend
node scripts/setup_rating_database.js
```

This script will:
- ✅ Create the ratings table with proper structure
- ✅ Set up all necessary indexes and constraints
- ✅ Add sample data for testing
- ✅ Verify the setup is working correctly

### Option 2: Manual SQL Setup

If you prefer to run SQL manually, use the provided SQL script:

```bash
# In your MySQL client or phpMyAdmin
source backend/migrations/ratings_table.sql
```

### Option 3: Using Existing Migration

If you already have the favorites migration, you can run:

```bash
cd backend
node scripts/create_new_favorites_and_ratings.js
```

### Verify Setup

After setup, verify everything is working:

```bash
cd backend
node scripts/verify_rating_database.js
```

This will check:
- ✅ Database connection
- ✅ Table structure
- ✅ Indexes and constraints
- ✅ Sample data
- ✅ API functionality

## Security Considerations

- All rating endpoints (except public read endpoints) require authentication
- Users can only modify their own ratings
- Input validation ensures ratings are between 1.0 and 5.0
- Rate limiting can be added to prevent spam

## Performance Considerations

- Database indexes on frequently queried fields
- Caching can be implemented for average ratings
- Pagination for large review lists
- Lazy loading for review sections

## Future Enhancements

- **Rating analytics** (rating distribution, trends)
- **Moderation tools** for reviews
- **Rating notifications** when items are rated
- **Rating badges** for highly-rated items
- **Rating export** functionality
- **Rating comparison** between similar items

