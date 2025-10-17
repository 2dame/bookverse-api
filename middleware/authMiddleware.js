/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

/**
 * Protect routes - require valid JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});

/**
 * Check if user owns the review (for modify/delete operations)
 */
const checkReviewOwnership = (review, userId) => {
  return review.userId === userId;
};

module.exports = {
  protect,
  checkReviewOwnership
};

