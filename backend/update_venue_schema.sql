-- Update Venue Table Schema to Allow Null Owner Fields
-- Run this script in your MySQL database to update the venue table

-- First, update existing venues that might have null owner_id to have 'unclaimed' type
UPDATE venues 
SET owner_type = 'unclaimed' 
WHERE owner_id IS NULL OR owner_type IS NULL;

-- Modify the owner_id column to allow null
ALTER TABLE venues 
MODIFY COLUMN owner_id INT NULL 
COMMENT 'ID of the owner (artist or organiser). Null for unclaimed venues.';

-- Modify the owner_type column to allow null and add 'unclaimed' enum value
-- First, we need to create a new enum type and then change the column
ALTER TABLE venues 
MODIFY COLUMN owner_type ENUM('artist', 'organiser', 'unclaimed') NULL 
DEFAULT 'unclaimed'
COMMENT 'Type of owner. "unclaimed" for venues without owners.';

-- Verify the changes
DESCRIBE venues;

-- Show sample data to confirm the changes
SELECT id, name, owner_id, owner_type FROM venues LIMIT 10;
