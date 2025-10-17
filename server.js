/**
 * BookVerse API Server
 * IBM Final Project - Online Book Review REST API
 * Version 1.5
 */

// Load environment variables
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const { logInfo } = require('./utils/logger');

// Initialize Express app
const app = express();

// =============================
// SECURITY MIDDLEWARE
// =============================

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// =============================
// BODY PARSER MIDDLEWARE
// =============================

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// =============================
// LOGGING MIDDLEWARE
// =============================

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// =============================
// API ROUTES
// =============================

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to BookVerse API v1.5',
    version: '1.5.0',
    description: 'Online Book Review REST API - IBM Final Project',
    endpoints: {
      auth: '/api/v1/auth',
      books: '/api/v1/books',
      reviews: '/api/v1/reviews'
    },
    documentation: {
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      getAllBooks: 'GET /api/v1/books',
      getBookByISBN: 'GET /api/v1/books/:isbn',
      getBooksByAuthor: 'GET /api/v1/books?author=name',
      getBooksByTitle: 'GET /api/v1/books?title=name',
      getBookReviews: 'GET /api/v1/books/:isbn/reviews',
      addReview: 'POST /api/v1/books/:isbn/reviews (Auth required)',
      updateReview: 'PUT /api/v1/reviews/:reviewId (Auth required)',
      deleteReview: 'DELETE /api/v1/reviews/:reviewId (Auth required)'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1', reviewRoutes); // Also mount at base for books/:isbn/reviews

// =============================
// ERROR HANDLING
// =============================

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

// =============================
// START SERVER
// =============================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logInfo(`BookVerse API v1.5 running on port ${PORT}`);
  logInfo(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logInfo(`Server started at ${new Date().toISOString()}`);
  console.log(`\n✅ Server is ready at http://localhost:${PORT}/\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

module.exports = app;

