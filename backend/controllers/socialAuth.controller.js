const db = require("../models");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const { slugify } = require("../utils/fileUtils");
const createFolderStructure = require("../helpers/createFolderStructure");

const User = db.user;
const Organiser = db.organiser;
const Artist = db.artist;

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate username from email
const generateUsername = (email, provider) => {
  const baseName = email.split('@')[0];
  const timestamp = Date.now().toString().slice(-4);
  return `${baseName}_${provider}_${timestamp}`;
};

// Helper function to create user profile
const createUserProfile = async (user, role, name, email, phone_number) => {
  if (role == 3) { // Artist
    const folderName = `${role}_${slugify(name || user.username)}_${Math.floor(Math.random() * 9000 + 1000)}`;
    
    const settings = {
      setting_name: name || user.username,
      path: "../frontend/public/artists/",
      folder_name: folderName
    };

    await Artist.create({
      userId: user.id,
      stage_name: name || user.username,
      contact_email: email,
      phone_number: phone_number || null,
      settings: JSON.stringify(settings)
    });

    await createFolderStructure(settings);
    
    const artistSubfolders = ['events', 'venues', 'profile', 'gallery'];
    for (const subfolder of artistSubfolders) {
      await createFolderStructure({
        path: `${settings.path}${folderName}`,
        folder_name: subfolder
      });
    }
  } else if (role == 4) { // Organiser
    const folderName = `${role}_${slugify(name || user.username)}_${Math.floor(Math.random() * 9000 + 1000)}`;
    
    const settings = {
      setting_name: name || user.username,
      path: "../frontend/public/organisers/",
      folder_name: folderName
    };

    await Organiser.create({
      userId: user.id,
      name: name || user.username,
      contact_email: email,
      phone_number: phone_number || null,
      settings: JSON.stringify(settings)
    });

    await createFolderStructure(settings);
    
    const organiserSubfolders = ['events', 'venues', 'profile'];
    for (const subfolder of organiserSubfolders) {
      await createFolderStructure({
        path: `${settings.path}${folderName}`,
        folder_name: subfolder
      });
    }
  }
};

// Google Authentication
exports.googleAuth = async (req, res) => {
  try {
    const { idToken, role = 3 } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email },
          { auth_provider_id: googleId, auth_provider: 'google' }
        ]
      }
    });

    if (user) {
      // Update existing user if needed
      if (!user.auth_provider_id) {
        await user.update({
          auth_provider: 'google',
          auth_provider_id: googleId,
          profile_picture: picture,
          email_verified: true
        });
      }
    } else {
      // Create new user
      const username = generateUsername(email, 'google');
      
      user = await User.create({
        username,
        email,
        auth_provider: 'google',
        auth_provider_id: googleId,
        profile_picture: picture,
        email_verified: true,
        role
      });

      // Create user profile
      await createUserProfile(user, role, name, email);
    }

    // Generate JWT token
    const token = jwt.sign({
      id: user.id,
      role: user.role,
      auth_provider: user.auth_provider
    }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789', {
      expiresIn: "1d"
    });

    // Add role-specific IDs
    const userData = user.get({ plain: true });
    delete userData.password;

    if (user.role === 4) {
      const organiser = await Organiser.findOne({ where: { userId: user.id } });
      if (organiser) userData.organiser_id = organiser.id;
    } else if (user.role === 3) {
      const artist = await Artist.findOne({ where: { userId: user.id } });
      if (artist) userData.artist_id = artist.id;
    }

    res.json({
      message: 'Google authentication successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      message: 'Google authentication failed',
      error: error.message
    });
  }
};

// Facebook Authentication
exports.facebookAuth = async (req, res) => {
  try {
    const { accessToken, role = 3 } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    // Verify Facebook token and get user data
    const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const { id: facebookId, name, email, picture } = response.data;

    if (!email) {
      return res.status(400).json({ message: 'Email is required from Facebook' });
    }

    // Check if user already exists
    let user = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email },
          { auth_provider_id: facebookId, auth_provider: 'facebook' }
        ]
      }
    });

    if (user) {
      // Update existing user if needed
      if (!user.auth_provider_id) {
        await user.update({
          auth_provider: 'facebook',
          auth_provider_id: facebookId,
          profile_picture: picture?.data?.url,
          email_verified: true
        });
      }
    } else {
      // Create new user
      const username = generateUsername(email, 'facebook');
      
      user = await User.create({
        username,
        email,
        auth_provider: 'facebook',
        auth_provider_id: facebookId,
        profile_picture: picture?.data?.url,
        email_verified: true,
        role
      });

      // Create user profile
      await createUserProfile(user, role, name, email);
    }

    // Generate JWT token
    const token = jwt.sign({
      id: user.id,
      role: user.role,
      auth_provider: user.auth_provider
    }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789', {
      expiresIn: "1d"
    });

    // Add role-specific IDs
    const userData = user.get({ plain: true });
    delete userData.password;

    if (user.role === 4) {
      const organiser = await Organiser.findOne({ where: { userId: user.id } });
      if (organiser) userData.organiser_id = organiser.id;
    } else if (user.role === 3) {
      const artist = await Artist.findOne({ where: { userId: user.id } });
      if (artist) userData.artist_id = artist.id;
    }

    res.json({
      message: 'Facebook authentication successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({
      message: 'Facebook authentication failed',
      error: error.message
    });
  }
};
