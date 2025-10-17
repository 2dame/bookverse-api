/**
 * Authentication Routes
 * Defines routes for user registration and login
 */
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Task 6 - Register new user (3 pts)
 */
router.post('/register', authController.register);

/**
 * POST /api/v1/auth/login
 * Task 7 - Login user (3 pts)
 */
router.post('/login', authController.login);

module.exports = router;

