// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789');
    req.user = decoded; // Store decoded payload (e.g., { id, role }) in request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

exports.restrictTo = (allowed) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Support string role names or arrays of numeric role IDs
    if (Array.isArray(allowed)) {
      if (!allowed.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      // Backward compatibility: if a string is provided, map common names
      const nameToId = { superuser: 1, admin: 2, artist: 3, organiser: 4, venue: 5, user: 6 };
      const requiredId = nameToId[allowed] ?? allowed; // if passed numeric, use as-is
      if (req.user.role !== requiredId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    next();
  };
};