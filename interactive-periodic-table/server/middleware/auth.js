// FILE: server/middleware/auth.js (Corrected and Final Version)

const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
  
  const token = req.header('x-auth-token');

 
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  
  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.user = decoded.user;
    
    
    next();
    
  } catch (e) {
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};