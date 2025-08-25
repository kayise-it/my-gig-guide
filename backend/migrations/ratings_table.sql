-- Ratings Table SQL Script
-- Run this script in your MySQL database to create the ratings table

-- Drop existing table if it exists
DROP TABLE IF EXISTS ratings;

-- Create ratings table
CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  rateableId INT NOT NULL,
  rateableType ENUM('artist', 'event', 'venue', 'organiser') NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  review TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint for user
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Unique constraint to prevent duplicate ratings from same user
  UNIQUE KEY unique_user_rating (userId, rateableId, rateableType),
  
  -- Indexes for better query performance
  INDEX idx_rateable (rateableType, rateableId),
  INDEX idx_rating (rating),
  INDEX idx_user (userId),
  INDEX idx_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional - uncomment if you want sample data)
/*
INSERT INTO ratings (userId, rateableId, rateableType, rating, review) VALUES
(1, 1, 'artist', 4.5, 'Amazing performance! Really enjoyed the show.'),
(2, 1, 'artist', 5.0, 'Incredible talent! Will definitely see again.'),
(1, 1, 'event', 4.2, 'Great event! Good atmosphere and music.'),
(1, 1, 'venue', 4.8, 'Excellent venue with great acoustics!'),
(1, 1, 'organiser', 4.0, 'Well organized events. Professional team.');
*/

-- Verify table structure
DESCRIBE ratings;

-- Show indexes
SHOW INDEX FROM ratings;

