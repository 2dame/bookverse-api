/**
 * Book Routes
 * Defines routes for book-related operations
 */
const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

/**
 * GET /api/v1/books
 * Handles both:
 * - Get all books (Task 1)
 * - Get books by author (Task 3) via ?author=name
 * - Get books by title (Task 4) via ?title=name
 */
router.get('/', (req, res, next) => {
  if (req.query.author) {
    return bookController.getBooksByAuthor(req, res, next);
  }
  if (req.query.title) {
    return bookController.getBooksByTitle(req, res, next);
  }
  return bookController.getAllBooks(req, res, next);
});

/**
 * GET /api/v1/books/:isbn
 * Task 2 - Get book by ISBN (2 pts)
 */
router.get('/:isbn', bookController.getBookByISBN);

/**
 * GET /api/v1/books/:isbn/reviews
 * Task 5 - Get book reviews (2 pts)
 */
router.get('/:isbn/reviews', bookController.getBookReviews);

module.exports = router;

