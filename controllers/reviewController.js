/**
 * Review Controller
 * Handles book review operations (add, modify, delete)
 */
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { readData, writeData } = require('../utils/fileManager');
const { isValidRating, sanitizeText } = require('../utils/validation');
const { checkReviewOwnership } = require('../middleware/authMiddleware');

/**
 * Add or modify a book review
 * POST /api/v1/books/:isbn/reviews
 * Task 8 - Add/Modify book review (2 pts)
 */
exports.addOrModifyReview = asyncHandler(async (req, res, next) => {
  const { isbn } = req.params;
  const { rating, comment } = req.body;
  const { userId, username } = req.user;

  // Validate rating
  if (!rating || !isValidRating(rating)) {
    return next(new AppError('Please provide a valid rating (1-5)', 400));
  }

  // Verify book exists
  const booksData = await readData('books');
  const book = booksData.books.find((b) => b.isbn === isbn);

  if (!book) {
    return next(new AppError('No book found with that ISBN', 404));
  }

  // Read reviews data
  const reviewsData = await readData('reviews');

  // Check if user already reviewed this book
  const existingReviewIndex = reviewsData.reviews.findIndex(
    (r) => r.isbn === isbn && r.userId === userId
  );

  if (existingReviewIndex !== -1) {
    // Modify existing review
    reviewsData.reviews[existingReviewIndex] = {
      ...reviewsData.reviews[existingReviewIndex],
      rating,
      comment: comment ? sanitizeText(comment) : '',
      updatedAt: new Date().toISOString()
    };

    await writeData('reviews', reviewsData);

    return res.status(200).json({
      status: 'success',
      message: 'Review updated successfully',
      data: {
        review: reviewsData.reviews[existingReviewIndex]
      }
    });
  } else {
    // Add new review
    const newReview = {
      reviewId: uuidv4(),
      isbn,
      userId,
      username,
      rating,
      comment: comment ? sanitizeText(comment) : '',
      createdAt: new Date().toISOString()
    };

    reviewsData.reviews.push(newReview);
    await writeData('reviews', reviewsData);

    return res.status(201).json({
      status: 'success',
      message: 'Review added successfully',
      data: {
        review: newReview
      }
    });
  }
});

/**
 * Delete a book review
 * DELETE /api/v1/reviews/:reviewId
 * Task 9 - Delete book review (2 pts)
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const { userId } = req.user;

  // Read reviews data
  const reviewsData = await readData('reviews');

  // Find review
  const reviewIndex = reviewsData.reviews.findIndex(
    (r) => r.reviewId === reviewId
  );

  if (reviewIndex === -1) {
    return next(new AppError('No review found with that ID', 404));
  }

  const review = reviewsData.reviews[reviewIndex];

  // Check ownership
  if (!checkReviewOwnership(review, userId)) {
    return next(
      new AppError('You do not have permission to delete this review', 403)
    );
  }

  // Delete review
  reviewsData.reviews.splice(reviewIndex, 1);
  await writeData('reviews', reviewsData);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Update a book review (alternative route for PUT)
 * PUT /api/v1/reviews/:reviewId
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const { userId } = req.user;

  // Validate rating if provided
  if (rating && !isValidRating(rating)) {
    return next(new AppError('Please provide a valid rating (1-5)', 400));
  }

  // Read reviews data
  const reviewsData = await readData('reviews');

  // Find review
  const reviewIndex = reviewsData.reviews.findIndex(
    (r) => r.reviewId === reviewId
  );

  if (reviewIndex === -1) {
    return next(new AppError('No review found with that ID', 404));
  }

  const review = reviewsData.reviews[reviewIndex];

  // Check ownership
  if (!checkReviewOwnership(review, userId)) {
    return next(
      new AppError('You do not have permission to update this review', 403)
    );
  }

  // Update review
  if (rating) reviewsData.reviews[reviewIndex].rating = rating;
  if (comment !== undefined) {
    reviewsData.reviews[reviewIndex].comment = sanitizeText(comment);
  }
  reviewsData.reviews[reviewIndex].updatedAt = new Date().toISOString();

  await writeData('reviews', reviewsData);

  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    data: {
      review: reviewsData.reviews[reviewIndex]
    }
  });
});

