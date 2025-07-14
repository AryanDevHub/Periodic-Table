// FILE: server/middleware/auth.js (Corrected and Final Version)

const jwt = require('jsonwebtoken');

// This function will be used to protect our routes
module.exports = function(req, res, next) {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    // --- THE FIX IS HERE ---
    // Use the exact same secret from your .env file that was used to sign the token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user payload to the request object so subsequent routes can use it
    req.user = decoded.user;
    
    // Move on to the next function (the actual route handler)
    next();
    
  } catch (e) {
    // This `catch` block runs if the token is malformed or the secret doesn't match.
    // We send a 401 status because the user is not authorized.
    res.status(401).json({ message: 'Token is not valid' });
  }
};