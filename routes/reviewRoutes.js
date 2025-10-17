/**
 * Review Routes
 * Defines routes for review operations (protected)
 */
const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require authentication
router.use(protect);

/**
 * POST /api/v1/books/:isbn/reviews
 * Task 8 - Add/Modify review (2 pts)
 */
router.post('/books/:isbn/reviews', reviewController.addOrModifyReview);

/**
 * PUT /api/v1/reviews/:reviewId
 * Update review by ID
 */
router.put('/:reviewId', reviewController.updateReview);

/**
 * DELETE /api/v1/reviews/:reviewId
 * Task 9 - Delete review (2 pts)
 */
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;

