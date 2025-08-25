// routes/rating.routes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Create or update a rating (requires authentication)
router.post('/', verifyToken, ratingController.createOrUpdateRating);

// Get average rating for an item (public)
router.get('/average/:rateableType/:rateableId', ratingController.getAverageRating);

// Get user's rating for an item (requires authentication)
router.get('/user/:rateableType/:rateableId', verifyToken, ratingController.getUserRating);

// Get all ratings for an item (public)
router.get('/:rateableType/:rateableId', ratingController.getItemRatings);

// Delete user's rating (requires authentication)
router.delete('/:rateableType/:rateableId', verifyToken, ratingController.deleteRating);

// Get user's all ratings (requires authentication)
router.get('/user/ratings', verifyToken, ratingController.getUserRatings);

module.exports = router;


