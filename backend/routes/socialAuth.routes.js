const express = require('express');
const router = express.Router();
const socialAuthController = require('../controllers/socialAuth.controller');

// Google Authentication
router.post('/google', socialAuthController.googleAuth);

// Facebook Authentication
router.post('/facebook', socialAuthController.facebookAuth);

module.exports = router;
