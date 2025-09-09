// File: backend/controllers/admin.controller.js
const db = require("../models");
const bcrypt = require('bcryptjs');
const { verifyMajestyToken } = require("../middleware/majesty.middleware");

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts for all entities
    const [
      totalUsers,
      totalArtists,
      totalOrganisers,
      totalVenues,
      totalEvents,
      activeEvents,
      upcomingEvents
    ] = await Promise.all([
      db.user.count(),
      db.artist.count(),
      db.organiser.count(),
      db.venue.count(),
      db.event.count(),
      db.event.count({ where: { status: 'active' } }),
      db.event.count({ 
        where: { 
          date: { [db.Sequelize.Op.gte]: new Date() },
          status: 'scheduled'
        } 
      })
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await db.user.count({
      where: {
        createdAt: { [db.Sequelize.Op.gte]: sevenDaysAgo }
      }
    });

    const recentEvents = await db.event.count({
      where: {
        createdAt: { [db.Sequelize.Op.gte]: sevenDaysAgo }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalArtists,
        totalOrganisers,
        totalVenues,
        totalEvents,
        activeEvents,
        upcomingEvents,
        recentUsers,
        recentEvents
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get all users with pagination
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [db.Sequelize.Op.or]: [
        { username: { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: users } = await db.user.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.acl_trust,
        as: 'aclInfo',
        attributes: ['acl_name', 'acl_display']
      }],
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get all artists with pagination
exports.getArtists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [db.Sequelize.Op.or]: [
        { stage_name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { real_name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { genre: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: artists } = await db.artist.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      artists,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artists',
      error: error.message
    });
  }
};

// Get all organisers with pagination
exports.getOrganisers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { contact_email: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: organisers } = await db.organiser.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }],
      limit,
      offset,
      order: [['createdDate', 'DESC']]
    });

    res.json({
      success: true,
      organisers,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching organisers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organisers',
      error: error.message
    });
  }
};

// Get all venues with pagination
exports.getVenues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { location: { [db.Sequelize.Op.like]: `%${search}%` } },
        { address: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: venues } = await db.venue.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.user,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      venues,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch venues',
      error: error.message
    });
  }
};

// Get all events with pagination
exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { description: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: events } = await db.event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.venue,
          as: 'venue',
          attributes: ['id', 'name', 'location']
        },
        {
          model: db.artist,
          as: 'artists',
          attributes: ['id', 'stage_name'],
          through: { attributes: [] }
        }
      ],
      limit,
      offset,
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      events,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// ===== USER CRUD OPERATIONS =====

// Get single user
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.user.findByPk(id, {
      include: [{
        model: db.acl_trust,
        as: 'aclInfo',
        attributes: ['acl_name', 'acl_display']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, full_name, role = 6 } = req.body;
    
    // Check if user already exists
    const existingUser = await db.user.findOne({
      where: { [db.Sequelize.Op.or]: [{ email }, { username }] }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await db.user.create({
      username,
      email,
      password: hashedPassword,
      full_name,
      role
    });
    
    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, role, password } = req.body;
    
    const user = await db.user.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const updateData = { username, email, full_name, role };
    
    // Only hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    
    await user.update(updateData);
    
    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await db.user.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.destroy();
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// ===== ARTIST CRUD OPERATIONS =====

// Get single artist
exports.getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await db.artist.findByPk(id, {
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }]
    });
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }
    
    res.json({
      success: true,
      artist
    });
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artist',
      error: error.message
    });
  }
};

// Create artist
exports.createArtist = async (req, res) => {
  try {
    const artistData = req.body || {};
    // Accept common alias field names from various frontends
    // Only accept a valid positive integer as userId; otherwise treat as undefined
    const rawUserId = artistData.userId ?? artistData.user_id;
    const parsedUserId = Number.parseInt(rawUserId, 10);
    const incomingUserId = Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : undefined;
    const stage_name = artistData.stage_name || artistData.stageName || artistData.name;
    const contact_email = artistData.contact_email || artistData.contactEmail || artistData.email;
    const phone_number = artistData.phone_number || artistData.phoneNumber;

    // Helper to slugify names
    const slugify = (text) =>
      (text || '')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_\-]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');

    let resolvedUserId = incomingUserId;

    // If userId not provided, try to find or create a user by contact_email
    if (!resolvedUserId) {
      const normalizedEmail = (contact_email || '').toString().trim();
      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: 'Either userId or contact_email is required to create an artist'
        });
      }

      const existingUser = await db.user.findOne({ where: { email: normalizedEmail } });
      if (existingUser) {
        resolvedUserId = existingUser.id;
      } else {
        const generatedUsername = `${slugify(stage_name) || 'artist'}_${Math.floor(Math.random() * 9000 + 1000)}`;
        const tempPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(tempPassword, 12);
        const newUser = await db.user.create({
          username: generatedUsername,
          email: normalizedEmail,
          password: hashedPassword,
          full_name: stage_name || generatedUsername,
          role: 3,
        });
        resolvedUserId = newUser.id;
      }
    }

    const folderName = `5_${slugify(stage_name) || 'artist'}_${Math.floor(Math.random() * 9000 + 1000)}`;
    const settings = {
      setting_name: stage_name || 'artist',
      path: 'frontend/public/artists',
      folder_name: folderName,
    };

    const artist = await db.artist.create({
      userId: resolvedUserId,
      stage_name: stage_name || 'New Artist',
      contact_email: (contact_email || '').toString().trim() || null,
      phone_number: phone_number || null,
      settings: JSON.stringify(settings),
    });

    // Create folder structure (best-effort)
    try {
      const { createFolderStructure } = require('../helpers/createFolderStructure');
      await createFolderStructure(settings);
      const subfolders = ['events', 'venues', 'profile', 'gallery'];
      for (const subfolder of subfolders) {
        await createFolderStructure({
          path: `${settings.path}/${folderName}`,
          folder_name: subfolder,
        });
      }
    } catch (folderErr) {
      console.warn('Artist folder structure creation failed (non-fatal):', folderErr.message);
    }

    const artistWithUser = await db.artist.findByPk(artist.id, {
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }]
    });

    res.status(201).json({
      success: true,
      artist: artistWithUser
    });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create artist',
      error: error.message
    });
  }
};

// Update artist
exports.updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const artist = await db.artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }
    
    await artist.update(updateData);
    
    const artistWithUser = await db.artist.findByPk(id, {
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }]
    });
    
    res.json({
      success: true,
      artist: artistWithUser
    });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update artist',
      error: error.message
    });
  }
};

// Delete artist
exports.deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artist = await db.artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }
    
    await artist.destroy();
    res.json({
      success: true,
      message: 'Artist deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete artist',
      error: error.message
    });
  }
};

// ===== ORGANISER CRUD OPERATIONS =====

// Get single organiser
exports.getOrganiser = async (req, res) => {
  try {
    const { id } = req.params;
    const organiser = await db.organiser.findByPk(id, {
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }]
    });
    
    if (!organiser) {
      return res.status(404).json({
        success: false,
        message: 'Organiser not found'
      });
    }
    
    res.json({
      success: true,
      organiser
    });
  } catch (error) {
    console.error('Error fetching organiser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organiser',
      error: error.message
    });
  }
};

// Create organiser
exports.createOrganiser = async (req, res) => {
  try {
    const organiserData = req.body || {};
    // Accept common alias field names from various frontends
    const incomingUserId = organiserData.userId || organiserData.user_id;
    const name = organiserData.name;
    const contact_email = organiserData.contact_email || organiserData.contactEmail || organiserData.email;
    const phone_number = organiserData.phone_number || organiserData.phoneNumber;

    // Helper to slugify names
    const slugify = (text) =>
      (text || '')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_\-]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');

    let resolvedUserId = incomingUserId;

    // If userId not provided, try to find or create a user by contact_email
    if (!resolvedUserId) {
      if (!contact_email) {
        return res.status(400).json({
          success: false,
          message: 'Either userId or contact_email is required to create an organiser'
        });
      }

      // Find existing user by email
      const existingUser = await db.user.findOne({ where: { email: contact_email } });

      if (existingUser) {
        resolvedUserId = existingUser.id;
      } else {
        // Create a new user with role=4 (organiser)
        const generatedUsername = `${slugify(name) || 'organiser'}_${Math.floor(Math.random() * 9000 + 1000)}`;
        const tempPassword = Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        const newUser = await db.user.create({
          username: generatedUsername,
          email: contact_email,
          password: hashedPassword,
          full_name: name || generatedUsername,
          role: 4,
        });

        resolvedUserId = newUser.id;
      }
    }

    // Ensure organiser settings and folder structure similar to registration flow
    const folderName = `4_${slugify(name) || 'organiser'}_${Math.floor(Math.random() * 9000 + 1000)}`;
    const settings = {
      setting_name: name || 'organiser',
      path: 'frontend/public/organisers',
      folder_name: folderName,
    };

    // Create organiser
    const organiser = await db.organiser.create({
      userId: resolvedUserId,
      name: name || 'New Organiser',
      contact_email,
      phone_number: phone_number || null,
      settings: JSON.stringify(settings),
    });

    // Create folder structure (best-effort)
    try {
      const { createFolderStructure } = require('../helpers/createFolderStructure');
      await createFolderStructure(settings);
      const subfolders = ['events', 'venues', 'profile'];
      for (const subfolder of subfolders) {
        await createFolderStructure({
          path: `${settings.path}/${folderName}`,
          folder_name: subfolder,
        });
      }
    } catch (folderErr) {
      console.warn('Organiser folder structure creation failed (non-fatal):', folderErr.message);
    }

    const organiserWithUser = await db.organiser.findByPk(organiser.id, {
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }]
    });

    res.status(201).json({
      success: true,
      organiser: organiserWithUser
    });
  } catch (error) {
    console.error('Error creating organiser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create organiser',
      error: error.message
    });
  }
};

// Update organiser
exports.updateOrganiser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const organiser = await db.organiser.findByPk(id);
    if (!organiser) {
      return res.status(404).json({
        success: false,
        message: 'Organiser not found'
      });
    }
    
    await organiser.update(updateData);
    
    const organiserWithUser = await db.organiser.findByPk(id, {
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['id', 'username', 'email', 'createdAt']
      }]
    });
    
    res.json({
      success: true,
      organiser: organiserWithUser
    });
  } catch (error) {
    console.error('Error updating organiser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update organiser',
      error: error.message
    });
  }
};

// Delete organiser
exports.deleteOrganiser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const organiser = await db.organiser.findByPk(id);
    if (!organiser) {
      return res.status(404).json({
        success: false,
        message: 'Organiser not found'
      });
    }
    
    await organiser.destroy();
    res.json({
      success: true,
      message: 'Organiser deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organiser:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete organiser',
      error: error.message
    });
  }
};

// ===== VENUE CRUD OPERATIONS =====

// Get single venue
exports.getVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await db.venue.findByPk(id, {
      include: [{
        model: db.user,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      }]
    });
    
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    res.json({
      success: true,
      venue
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch venue',
      error: error.message
    });
  }
};

// Create venue
exports.createVenue = async (req, res) => {
  try {
    const venueData = req.body;
    const venue = await db.venue.create(venueData);
    
    const venueWithUser = await db.venue.findByPk(venue.id, {
      include: [{
        model: db.user,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      }]
    });
    
    res.status(201).json({
      success: true,
      venue: venueWithUser
    });
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create venue',
      error: error.message
    });
  }
};

// Update venue
exports.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const venue = await db.venue.findByPk(id);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    await venue.update(updateData);
    
    const venueWithUser = await db.venue.findByPk(id, {
      include: [{
        model: db.user,
        as: 'creator',
        attributes: ['id', 'username', 'email']
      }]
    });
    
    res.json({
      success: true,
      venue: venueWithUser
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update venue',
      error: error.message
    });
  }
};

// Delete venue
exports.deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await db.venue.findByPk(id);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    await venue.destroy();
    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting venue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete venue',
      error: error.message
    });
  }
};

// ===== EVENT CRUD OPERATIONS =====

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.event.findByPk(id, {
      include: [
        {
          model: db.venue,
          as: 'venue',
          attributes: ['id', 'name', 'location']
        },
        {
          model: db.artist,
          as: 'artists',
          attributes: ['id', 'stage_name'],
          through: { attributes: [] }
        }
      ]
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const event = await db.event.create(eventData);
    
    const eventWithRelations = await db.event.findByPk(event.id, {
      include: [
        {
          model: db.venue,
          as: 'venue',
          attributes: ['id', 'name', 'location']
        },
        {
          model: db.artist,
          as: 'artists',
          attributes: ['id', 'stage_name'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      event: eventWithRelations
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const event = await db.event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await event.update(updateData);
    
    const eventWithRelations = await db.event.findByPk(id, {
      include: [
        {
          model: db.venue,
          as: 'venue',
          attributes: ['id', 'name', 'location']
        },
        {
          model: db.artist,
          as: 'artists',
          attributes: ['id', 'stage_name'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.json({
      success: true,
      event: eventWithRelations
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await db.event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await event.destroy();
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};
