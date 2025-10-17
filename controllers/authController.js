/**
 * Authentication Controller
 * Handles user registration and login
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { readData, writeData } = require('../utils/fileManager');
const { 
  isValidUsername, 
  isValidPassword, 
  sanitizeText 
} = require('../utils/validation');
const { logAuthEvent } = require('../utils/logger');

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} username - Username
 * @returns {string} - JWT token
 */
const generateToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
};

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;

  // Validate input
  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }

  // Validate username format
  if (!isValidUsername(username)) {
    return next(
      new AppError(
        'Username must be 3-20 characters and contain only letters, numbers, and underscores',
        400
      )
    );
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    return next(
      new AppError('Password must be at least 6 characters long', 400)
    );
  }

  // Read users data
  const data = await readData('users');

  // Check if user already exists
  const existingUser = data.users.find((u) => u.username === username);
  if (existingUser) {
    logAuthEvent('register', username, false, req.ip);
    return next(new AppError('Username already exists', 409));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const newUser = {
    userId: uuidv4(),
    username: sanitizeText(username),
    password: hashedPassword,
    email: email ? sanitizeText(email) : null,
    createdAt: new Date().toISOString()
  };

  // Add user to data
  data.users.push(newUser);

  // Write data back to file
  await writeData('users', data);

  // Generate token
  const token = generateToken(newUser.userId, newUser.username);

  // Log successful registration
  logAuthEvent('register', username, true, req.ip);

  // Send response
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      userId: newUser.userId,
      username: newUser.username,
      token
    }
  });
});

/**
 * Login user
 * POST /api/v1/auth/login
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }

  // Read users data
  const data = await readData('users');

  // Find user
  const user = data.users.find((u) => u.username === username);

  // Check if user exists and password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    logAuthEvent('login', username, false, req.ip);
    return next(new AppError('Incorrect username or password', 401));
  }

  // Generate token
  const token = generateToken(user.userId, user.username);

  // Log successful login
  logAuthEvent('login', username, true, req.ip);

  // Send response
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      userId: user.userId,
      username: user.username,
      token
    }
  });
});

