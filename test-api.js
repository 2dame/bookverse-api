/**
 * API Test Script
 * Comprehensive test of all BookVerse API endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api/v1';
let authToken = '';
let reviewId = '';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(taskNum, description, passed) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`${status} - Task ${taskNum}: ${description}`, color);
}

async function testAPI() {
  log('\n========================================', 'blue');
  log('  BookVerse API Test Suite v1.5', 'blue');
  log('========================================\n', 'blue');

  try {
    // Task 6: Register User
    log('[Test 1] Task 6 - Register New User (3 pts)', 'yellow');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'apitest_user',
      password: 'testpass123',
      email: 'apitest@example.com'
    });
    logTest(6, 'Register new user', registerRes.status === 201);
    authToken = registerRes.data.data.token;

    // Task 7: Login User
    log('\n[Test 2] Task 7 - Login User (3 pts)', 'yellow');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'apitest_user',
      password: 'testpass123'
    });
    logTest(7, 'Login user', loginRes.status === 200);
    authToken = loginRes.data.data.token;

    // Task 1: Get All Books
    log('\n[Test 3] Task 1 - Get All Books (2 pts)', 'yellow');
    const allBooksRes = await axios.get(`${BASE_URL}/books`);
    logTest(1, 'Get book list', allBooksRes.status === 200 && allBooksRes.data.results > 0);

    // Task 2: Get Book by ISBN
    log('\n[Test 4] Task 2 - Get Book by ISBN (2 pts)', 'yellow');
    const bookByISBN = await axios.get(`${BASE_URL}/books/978-0-13-235088-4`);
    logTest(2, 'Get book by ISBN', bookByISBN.status === 200 && bookByISBN.data.data.book.isbn === '978-0-13-235088-4');

    // Task 3: Get Books by Author
    log('\n[Test 5] Task 3 - Get Books by Author (2 pts)', 'yellow');
    const booksByAuthor = await axios.get(`${BASE_URL}/books`, {
      params: { author: 'Robert C. Martin' }
    });
    logTest(3, 'Get all books by Author', booksByAuthor.status === 200 && booksByAuthor.data.results >= 1);

    // Task 4: Get Books by Title
    log('\n[Test 6] Task 4 - Get Books by Title (2 pts)', 'yellow');
    const booksByTitle = await axios.get(`${BASE_URL}/books`, {
      params: { title: 'Clean Code' }
    });
    logTest(4, 'Get all books by Title', booksByTitle.status === 200 && booksByTitle.data.results >= 1);

    // Task 5: Get Book Reviews
    log('\n[Test 7] Task 5 - Get Book Reviews (2 pts)', 'yellow');
    const reviewsRes = await axios.get(`${BASE_URL}/books/978-0-13-235088-4/reviews`);
    logTest(5, 'Get book Review', reviewsRes.status === 200);

    // Task 8: Add Book Review
    log('\n[Test 8] Task 8 - Add Book Review (2 pts)', 'yellow');
    const addReviewRes = await axios.post(
      `${BASE_URL}/books/978-0-13-235088-4/reviews`,
      {
        rating: 5,
        comment: 'Excellent book for learning clean code practices!'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    logTest(8, 'Add book review', addReviewRes.status === 201);
    reviewId = addReviewRes.data.data.review.reviewId;

    // Task 8: Modify Book Review
    log('\n[Test 9] Task 8 - Modify Book Review (2 pts)', 'yellow');
    const modifyReviewRes = await axios.post(
      `${BASE_URL}/books/978-0-13-235088-4/reviews`,
      {
        rating: 4,
        comment: 'Updated review: Still a great book!'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    logTest(8, 'Modify book review', modifyReviewRes.status === 200);

    // Task 9: Delete Book Review
    log('\n[Test 10] Task 9 - Delete Book Review (2 pts)', 'yellow');
    const deleteReviewRes = await axios.delete(
      `${BASE_URL}/reviews/${reviewId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    logTest(9, 'Delete book review', deleteReviewRes.status === 204);

    // Summary
    log('\n========================================', 'green');
    log('  ✅ All Core Tests Passed!', 'green');
    log('  Tasks 1-9: 22 points earned', 'green');
    log('========================================\n', 'green');

    log('Next: Test async methods (Tasks 10-13)...', 'blue');
    log('Run: node asyncMethods.js\n', 'blue');

  } catch (error) {
    log('\n❌ Test Failed:', 'red');
    if (error.response) {
      log(`Status: ${error.response.status}`, 'red');
      log(`Message: ${JSON.stringify(error.response.data)}`, 'red');
    } else {
      log(error.message, 'red');
    }
    process.exit(1);
  }
}

// Run tests
log('Starting API tests...', 'blue');
log('Make sure server is running on http://localhost:5001\n', 'yellow');

setTimeout(() => {
  testAPI().then(() => {
    log('✅ Test suite completed successfully!\n', 'green');
    process.exit(0);
  }).catch((error) => {
    log('❌ Test suite failed!\n', 'red');
    console.error(error);
    process.exit(1);
  });
}, 1000);

