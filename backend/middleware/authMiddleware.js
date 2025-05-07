// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  console.log("Auth headers:", req.headers.authorization);
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      console.log("Verifying token:", token.substring(0, 10) + "...");
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log("Token verified, decoded user ID:", decoded.id);
      
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-passwordHash');
      
      if (!req.user) {
        console.log("User not found with ID:", decoded.id);
        res.status(401);
        throw new Error('User not found');
      }
      
      console.log("User authenticated:", req.user._id);
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    console.log("No authorization header found");
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };