/**
 * BookVerse API - Comprehensive Endpoint Testing Suite
 * Auto-executes all Tasks 1-9 with retry logic and detailed reporting
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5001/api/v1';
const RESPONSES_DIR = path.join(__dirname, 'responses');
const MAX_RETRIES = 2;

// Test results storage
const testResults = [];
let passedTests = 0;
let failedTests = 0;

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Save response to JSON file
 */
async function saveResponse(filename, data) {
  try {
    await fs.mkdir(RESPONSES_DIR, { recursive: true });
    const filepath = path.join(RESPONSES_DIR, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    return filepath;
  } catch (error) {
    console.error(`Failed to save response: ${error.message}`);
  }
}

/**
 * Make HTTP request with retry logic
 */
async function makeRequest(config, retries = MAX_RETRIES) {
  const startTime = Date.now();
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios(config);
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        status: response.status,
        data: response.data,
        responseTime,
        attempt: attempt + 1
      };
    } catch (error) {
      if (attempt === retries) {
        const responseTime = Date.now() - startTime;
        return {
          success: false,
          status: error.response?.status || 0,
          data: error.response?.data || { error: error.message },
          responseTime,
          attempt: attempt + 1,
          error: error.message
        };
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * Record test result
 */
function recordTest(taskNum, name, method, endpoint, result) {
  const passed = result.success && result.status >= 200 && result.status < 300;
  
  if (passed) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  testResults.push({
    task: taskNum,
    name,
    method,
    endpoint,
    status: result.status,
    responseTime: result.responseTime,
    passed,
    timestamp: new Date().toISOString()
  });
  
  const icon = passed ? '✅' : '❌';
  const statusColor = passed ? 'green' : 'red';
  log(`${icon} Task ${taskNum}: ${name} (${result.status} ${result.responseTime}ms)`, statusColor);
  
  return result;
}

/**
 * Run all endpoint tests
 */
async function runTests() {
  log('\n========================================', 'blue');
  log('  BookVerse API - Automated QA Suite', 'blue');
  log('========================================\n', 'blue');
  log(`Environment: ${process.env.NODE_ENV || 'development'}`, 'yellow');
  log(`Base URL: ${BASE_URL}`, 'yellow');
  log(`Timestamp: ${new Date().toISOString()}\n`, 'yellow');
  
  let authToken = '';
  let reviewId = '';
  
  try {
    // Task 1: Get All Books
    log('[Test 1/9] Task 1 - Get All Books', 'magenta');
    const task1 = await makeRequest({
      method: 'GET',
      url: `${BASE_URL}/books`
    });
    recordTest(1, 'Get All Books', 'GET', '/books', task1);
    await saveResponse('task1_getAllBooks.json', task1.data);
    
    // Task 2: Get Book by ISBN
    log('\n[Test 2/9] Task 2 - Get Book by ISBN', 'magenta');
    const task2 = await makeRequest({
      method: 'GET',
      url: `${BASE_URL}/books/978-0-13-235088-4`
    });
    recordTest(2, 'Get Book by ISBN', 'GET', '/books/:isbn', task2);
    await saveResponse('task2_getBookByISBN.json', task2.data);
    
    // Task 3: Get Books by Author
    log('\n[Test 3/9] Task 3 - Get Books by Author', 'magenta');
    const task3 = await makeRequest({
      method: 'GET',
      url: `${BASE_URL}/books`,
      params: { author: 'Robert C. Martin' }
    });
    recordTest(3, 'Get Books by Author', 'GET', '/books?author=', task3);
    await saveResponse('task3_getBooksByAuthor.json', task3.data);
    
    // Task 4: Get Books by Title
    log('\n[Test 4/9] Task 4 - Get Books by Title', 'magenta');
    const task4 = await makeRequest({
      method: 'GET',
      url: `${BASE_URL}/books`,
      params: { title: 'Clean Code' }
    });
    recordTest(4, 'Get Books by Title', 'GET', '/books?title=', task4);
    await saveResponse('task4_getBooksByTitle.json', task4.data);
    
    // Task 5: Get Book Reviews
    log('\n[Test 5/9] Task 5 - Get Book Reviews', 'magenta');
    const task5 = await makeRequest({
      method: 'GET',
      url: `${BASE_URL}/books/978-0-13-235088-4/reviews`
    });
    recordTest(5, 'Get Book Reviews', 'GET', '/books/:isbn/reviews', task5);
    await saveResponse('task5_getBookReviews.json', task5.data);
    
    // Task 6: Register New User
    log('\n[Test 6/9] Task 6 - Register New User', 'magenta');
    const testUsername = `test${Date.now().toString().slice(-8)}`;
    const testPassword = 'testpass123';
    
    const task6 = await makeRequest({
      method: 'POST',
      url: `${BASE_URL}/auth/register`,
      data: {
        username: testUsername,
        password: testPassword,
        email: `${testUsername}@test.com`
      }
    });
    recordTest(6, 'Register New User', 'POST', '/auth/register', task6);
    await saveResponse('task6_registerUser.json', task6.data);
    
    if (task6.success && task6.data && task6.data.data) {
      authToken = task6.data.data.token;
    }
    
    // Task 7: Login User
    log('\n[Test 7/9] Task 7 - Login User', 'magenta');
    const task7 = await makeRequest({
      method: 'POST',
      url: `${BASE_URL}/auth/login`,
      data: {
        username: testUsername,
        password: testPassword
      }
    });
    recordTest(7, 'Login User', 'POST', '/auth/login', task7);
    await saveResponse('task7_loginUser.json', task7.data);
    
    if (task7.success && task7.data && task7.data.data) {
      authToken = task7.data.data.token;
    }
    
    // Task 8: Add Book Review (Protected)
    log('\n[Test 8/9] Task 8 - Add Book Review', 'magenta');
    const task8 = await makeRequest({
      method: 'POST',
      url: `${BASE_URL}/books/978-0-13-235088-4/reviews`,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      data: {
        rating: 5,
        comment: 'Automated test review - Excellent book!'
      }
    });
    recordTest(8, 'Add Book Review', 'POST', '/books/:isbn/reviews', task8);
    await saveResponse('task8_addReview.json', task8.data);
    
    if (task8.success) {
      reviewId = task8.data.data.review.reviewId;
    }
    
    // Task 9: Delete Book Review (Protected)
    log('\n[Test 9/9] Task 9 - Delete Book Review', 'magenta');
    const task9 = await makeRequest({
      method: 'DELETE',
      url: `${BASE_URL}/reviews/${reviewId}`,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    recordTest(9, 'Delete Book Review', 'DELETE', '/reviews/:reviewId', task9);
    await saveResponse('task9_deleteReview.json', { 
      status: task9.status, 
      success: task9.success 
    });
    
    // Generate Summary
    await generateSummary();
    
    // Exit with appropriate code
    if (failedTests === 0) {
      log('\n✅ All tests passed!', 'green');
      process.exit(0);
    } else {
      log(`\n⚠️  ${failedTests} test(s) failed!`, 'red');
      process.exit(1);
    }
    
  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Generate summary table and report
 */
async function generateSummary() {
  log('\n========================================', 'blue');
  log('  Test Results Summary', 'blue');
  log('========================================\n', 'blue');
  
  // Console table
  console.table(testResults.map(t => ({
    Task: t.task,
    Name: t.name,
    Method: t.method,
    Status: t.status,
    'Time (ms)': t.responseTime,
    Result: t.passed ? '✅ PASS' : '❌ FAIL'
  })));
  
  log(`\nTotal Tests: ${testResults.length}`, 'yellow');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passedTests / testResults.length) * 100).toFixed(1)}%\n`, 'blue');
  
  // Save detailed report
  const report = {
    metadata: {
      project: 'BookVerse API v1.5',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL
    },
    summary: {
      totalTests: testResults.length,
      passed: passedTests,
      failed: failedTests,
      successRate: `${((passedTests / testResults.length) * 100).toFixed(1)}%`
    },
    results: testResults
  };
  
  await saveResponse('_SUMMARY_REPORT.json', report);
  log(`📄 Detailed report saved: tests/responses/_SUMMARY_REPORT.json\n`, 'blue');
}

// Run tests
if (require.main === module) {
  log('⏳ Starting automated test suite...', 'yellow');
  log('📡 Waiting for server to be ready...\n', 'yellow');
  
  setTimeout(() => {
    runTests().catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
  }, 2000);
}

module.exports = { runTests };

