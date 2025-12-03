const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    
    console.log('✅ Authenticated user:', decoded.email);
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid or expired token.' 
    });
  }
};

// Middleware to check if user is a manager
const requireManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ 
      error: 'Access denied. Manager role required.' 
    });
  }
  next();
};

module.exports = { authenticateToken, requireManager };