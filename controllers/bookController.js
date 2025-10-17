/**
 * Book Controller
 * Handles book-related operations
 */
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { readData } = require('../utils/fileManager');

/**
 * Get all books
 * GET /api/v1/books
 * Task 1 - Get book list (2 pts)
 */
exports.getAllBooks = asyncHandler(async (req, res, next) => {
  const data = await readData('books');

  res.status(200).json({
    status: 'success',
    results: data.books.length,
    data: {
      books: data.books
    }
  });
});

/**
 * Get book by ISBN
 * GET /api/v1/books/:isbn
 * Task 2 - Get book by ISBN (2 pts)
 */
exports.getBookByISBN = asyncHandler(async (req, res, next) => {
  const { isbn } = req.params;
  const data = await readData('books');

  const book = data.books.find((b) => b.isbn === isbn);

  if (!book) {
    return next(new AppError('No book found with that ISBN', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book
    }
  });
});

/**
 * Get books by author (query param)
 * GET /api/v1/books?author=authorName
 * Task 3 - Get all books by Author (2 pts)
 */
exports.getBooksByAuthor = asyncHandler(async (req, res, next) => {
  const { author } = req.query;

  if (!author) {
    return next(new AppError('Please provide author name', 400));
  }

  const data = await readData('books');

  // Case-insensitive search
  const books = data.books.filter((b) =>
    b.author.toLowerCase().includes(author.toLowerCase())
  );

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books
    }
  });
});

/**
 * Get books by title (query param)
 * GET /api/v1/books?title=bookTitle
 * Task 4 - Get all books by Title (2 pts)
 */
exports.getBooksByTitle = asyncHandler(async (req, res, next) => {
  const { title } = req.query;

  if (!title) {
    return next(new AppError('Please provide book title', 400));
  }

  const data = await readData('books');

  // Case-insensitive search
  const books = data.books.filter((b) =>
    b.title.toLowerCase().includes(title.toLowerCase())
  );

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books
    }
  });
});

/**
 * Get book reviews by ISBN
 * GET /api/v1/books/:isbn/reviews
 * Task 5 - Get book Review (2 pts)
 */
exports.getBookReviews = asyncHandler(async (req, res, next) => {
  const { isbn } = req.params;
  const booksData = await readData('books');

  const book = booksData.books.find((b) => b.isbn === isbn);

  if (!book) {
    return next(new AppError('No book found with that ISBN', 404));
  }

  const reviewsData = await readData('reviews');
  const bookReviews = reviewsData.reviews.filter((r) => r.isbn === isbn);

  res.status(200).json({
    status: 'success',
    results: bookReviews.length,
    data: {
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      reviews: bookReviews
    }
  });
});

