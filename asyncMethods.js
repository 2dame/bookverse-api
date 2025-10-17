/**
 * Async Methods Module using Axios
 * Demonstrates Tasks 10-13: async/await, Promises, callbacks
 * This module shows different async patterns for making HTTP requests
 */
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5001/api/v1';

/**
 * Task 10: Get all books using async callback
 * Uses traditional callback pattern
 * @param {Function} callback - Callback function (err, data)
 */
function getAllBooksCallback(callback) {
  axios
    .get(`${BASE_URL}/books`)
    .then((response) => {
      callback(null, response.data);
    })
    .catch((error) => {
      callback(error, null);
    });
}

/**
 * Task 11: Search by ISBN using Promise
 * Returns a Promise for chaining
 * @param {string} isbn - Book ISBN
 * @returns {Promise} - Promise resolving to book data
 */
function searchByISBNPromise(isbn) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/books/${isbn}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Task 12: Search by Author using async/await
 * Modern async/await pattern
 * @param {string} author - Author name
 * @returns {Promise} - Book data
 */
async function searchByAuthorAsync(author) {
  try {
    const response = await axios.get(`${BASE_URL}/books`, {
      params: { author }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error searching by author: ${error.message}`);
  }
}

/**
 * Task 13: Search by Title using async/await
 * Modern async/await pattern
 * @param {string} title - Book title
 * @returns {Promise} - Book data
 */
async function searchByTitleAsync(title) {
  try {
    const response = await axios.get(`${BASE_URL}/books`, {
      params: { title }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error searching by title: ${error.message}`);
  }
}

/**
 * Demo function to test all async methods
 */
async function demonstrateAsyncMethods() {
  console.log('\n=== BookVerse Async Methods Demo ===\n');

  // Task 10: Callback pattern
  console.log('Task 10: Get all books (Callback)');
  getAllBooksCallback((err, data) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log(`✅ Found ${data.results} books using callback`);
    }
  });

  // Wait a bit for callback to complete
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Task 11: Promise pattern
  console.log('\nTask 11: Search by ISBN (Promise)');
  searchByISBNPromise('978-0-13-235088-4')
    .then((data) => {
      console.log(`✅ Found book: ${data.data.book.title}`);
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Task 12: Async/await pattern - Author
  console.log('\nTask 12: Search by Author (Async/Await)');
  try {
    const authorData = await searchByAuthorAsync('Robert C. Martin');
    console.log(`✅ Found ${authorData.results} books by author`);
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Task 13: Async/await pattern - Title
  console.log('\nTask 13: Search by Title (Async/Await)');
  try {
    const titleData = await searchByTitleAsync('Clean Code');
    console.log(`✅ Found ${titleData.results} books matching title`);
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n=== Demo Complete ===\n');
}

// Export functions
module.exports = {
  getAllBooksCallback,
  searchByISBNPromise,
  searchByAuthorAsync,
  searchByTitleAsync,
  demonstrateAsyncMethods
};

// Run demo if executed directly
if (require.main === module) {
  const port = process.env.PORT || '5001';
  console.log(`Starting server must be running at http://localhost:${port}`);
  console.log('Waiting 2 seconds for server to be ready...\n');
  
  setTimeout(() => {
    demonstrateAsyncMethods().catch((error) => {
      console.error('Demo error:', error.message);
    });
  }, 2000);
}

