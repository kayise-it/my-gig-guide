// File: backend/middleware/majesty.middleware.js
const jwt = require('jsonwebtoken');
const db = require('../models');
const Majesty = db.majesty;

exports.verifyMajestyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789');
    
    // Check if this is a majesty token
    if (decoded.type !== 'majesty') {
      return res.status(403).json({ message: 'Invalid token type' });
    }

    // Verify majesty still exists and is active
    const majesty = await Majesty.findOne({
      where: {
        id: decoded.id,
        is_active: true,
      },
    });

    if (!majesty) {
      return res.status(403).json({ message: 'Majesty not found or inactive' });
    }

    req.majesty = majesty;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


