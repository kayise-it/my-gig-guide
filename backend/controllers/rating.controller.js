// controllers/rating.controller.js
const db = require('../models');
const Rating = db.rating;
const User = db.user;

// Create or update a rating
exports.createOrUpdateRating = async (req, res) => {
  try {
    const { rateableId, rateableType, rating, review } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!rateableId || !rateableType || !rating) {
      return res.status(400).json({ 
        message: 'rateableId, rateableType, and rating are required' 
      });
    }

    if (!['artist', 'event', 'venue', 'organiser'].includes(rateableType)) {
      return res.status(400).json({ 
        message: 'rateableType must be artist, event, venue, or organiser' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if user has already rated this item
    const existingRating = await Rating.findOne({
      where: {
        userId,
        rateableId,
        rateableType
      }
    });

    let result;
    if (existingRating) {
      // Update existing rating
      result = await existingRating.update({
        rating,
        review: review || null
      });
    } else {
      // Create new rating
      result = await Rating.create({
        userId,
        rateableId,
        rateableType,
        rating,
        review: review || null
      });
    }

    // Get updated average rating
    const avgRating = await Rating.getAverageRating(rateableType, rateableId);

    res.status(200).json({
      message: existingRating ? 'Rating updated successfully' : 'Rating created successfully',
      rating: result,
      averageRating: avgRating
    });

  } catch (error) {
    console.error('Rating creation/update error:', error);
    res.status(500).json({ 
      message: 'Failed to create/update rating',
      error: error.message 
    });
  }
};

// Get average rating for an item
exports.getAverageRating = async (req, res) => {
  try {
    const { rateableId, rateableType } = req.params;

    if (!['artist', 'event', 'venue', 'organiser'].includes(rateableType)) {
      return res.status(400).json({ 
        message: 'rateableType must be artist, event, venue, or organiser' 
      });
    }

    const avgRating = await Rating.getAverageRating(rateableType, rateableId);

    res.status(200).json(avgRating);

  } catch (error) {
    console.error('Get average rating error:', error);
    res.status(500).json({ 
      message: 'Failed to get average rating',
      error: error.message 
    });
  }
};

// Get user's rating for an item
exports.getUserRating = async (req, res) => {
  try {
    const { rateableId, rateableType } = req.params;
    const userId = req.user.id;

    if (!['artist', 'event', 'venue', 'organiser'].includes(rateableType)) {
      return res.status(400).json({ 
        message: 'rateableType must be artist, event, venue, or organiser' 
      });
    }

    const rating = await Rating.findOne({
      where: {
        userId,
        rateableId,
        rateableType
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
    });

    res.status(200).json({ rating });

  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ 
      message: 'Failed to get user rating',
      error: error.message 
    });
  }
};

// Get all ratings for an item
exports.getItemRatings = async (req, res) => {
  try {
    const { rateableId, rateableType } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!['artist', 'event', 'venue', 'organiser'].includes(rateableType)) {
      return res.status(400).json({ 
        message: 'rateableType must be artist, event, venue, or organiser' 
      });
    }

    const offset = (page - 1) * limit;

    const ratings = await Rating.findAndCountAll({
      where: {
        rateableId,
        rateableType
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const avgRating = await Rating.getAverageRating(rateableType, rateableId);

    res.status(200).json({
      ratings: ratings.rows,
      totalRatings: ratings.count,
      averageRating: avgRating,
      currentPage: parseInt(page),
      totalPages: Math.ceil(ratings.count / limit)
    });

  } catch (error) {
    console.error('Get item ratings error:', error);
    res.status(500).json({ 
      message: 'Failed to get item ratings',
      error: error.message 
    });
  }
};

// Delete user's rating
exports.deleteRating = async (req, res) => {
  try {
    const { rateableId, rateableType } = req.params;
    const userId = req.user.id;

    if (!['artist', 'event', 'venue', 'organiser'].includes(rateableType)) {
      return res.status(400).json({ 
        message: 'rateableType must be artist, event, venue, or organiser' 
      });
    }

    const rating = await Rating.findOne({
      where: {
        userId,
        rateableId,
        rateableType
      }
    });

    if (!rating) {
      return res.status(404).json({ 
        message: 'Rating not found' 
      });
    }

    await rating.destroy();

    // Get updated average rating
    const avgRating = await Rating.getAverageRating(rateableType, rateableId);

    res.status(200).json({
      message: 'Rating deleted successfully',
      averageRating: avgRating
    });

  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ 
      message: 'Failed to delete rating',
      error: error.message 
    });
  }
};

// Get user's all ratings
exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;

    const whereClause = { userId };
    if (type && ['artist', 'event', 'venue', 'organiser'].includes(type)) {
      whereClause.rateableType = type;
    }

    const offset = (page - 1) * limit;

    const ratings = await Rating.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      ratings: ratings.rows,
      totalRatings: ratings.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(ratings.count / limit)
    });

  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ 
      message: 'Failed to get user ratings',
      error: error.message 
    });
  }
};


