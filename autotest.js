/**
 * BookVerse API - Auto-Test Runner
 * Automatically runs tests when server starts and generates reports
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Run a test script
 */
function runTest(scriptPath, name) {
  return new Promise((resolve, reject) => {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`  Running: ${name}`, 'bright');
    log(`${'='.repeat(60)}`, 'cyan');
    
    const test = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    });
    
    test.on('close', (code) => {
      if (code === 0) {
        log(`\n✅ ${name} completed successfully`, 'green');
        resolve(true);
      } else {
        log(`\n⚠️  ${name} completed with warnings/errors`, 'yellow');
        resolve(false);
      }
    });
    
    test.on('error', (error) => {
      log(`\n❌ ${name} failed: ${error.message}`, 'red');
      reject(error);
    });
  });
}

/**
 * Generate RESULTS.md report
 */
async function generateResultsReport() {
  try {
    const summaryPath = path.join(__dirname, 'tests', 'responses', '_SUMMARY_REPORT.json');
    const asyncSummaryPath = path.join(__dirname, 'tests', 'responses', '_ASYNC_SUMMARY.json');
    
    const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf8'));
    const asyncData = JSON.parse(await fs.readFile(asyncSummaryPath, 'utf8'));
    
    const totalTests = summaryData.summary.totalTests + asyncData.summary.total;
    const totalPassed = summaryData.summary.passed + asyncData.summary.passed;
    const totalFailed = summaryData.summary.failed + asyncData.summary.failed;
    
    const report = `# BookVerse API v1.5 — Automated QA Report

## Project Metadata

- **Project:** BookVerse API v1.5
- **Description:** Online Book Review REST API - IBM Final Project
- **Environment:** ${summaryData.metadata.environment}
- **Test Date:** ${new Date().toLocaleString()}
- **Base URL:** ${summaryData.metadata.baseUrl}

---

## Test Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | ${totalTests} |
| **Passed** | ✅ ${totalPassed} |
| **Failed** | ❌ ${totalFailed} |
| **Success Rate** | ${((totalPassed / totalTests) * 100).toFixed(1)}% |
| **Test Duration** | ~${(summaryData.results.reduce((sum, r) => sum + r.responseTime, 0) / 1000).toFixed(2)}s |

---

## Endpoint Tests (Tasks 1-9)

### Test Results

${summaryData.results.map(r => `
#### Task ${r.task}: ${r.name}
- **Method:** \`${r.method}\`
- **Endpoint:** \`${r.endpoint}\`
- **Status Code:** ${r.status}
- **Response Time:** ${r.responseTime}ms
- **Result:** ${r.passed ? '✅ PASSED' : '❌ FAILED'}
- **Timestamp:** ${new Date(r.timestamp).toLocaleString()}
`).join('\n')}

---

## Async Methods Tests (Tasks 10-13)

### Task 10: Get All Books (Callback Pattern)
- **Pattern:** Traditional callback(err, data)
- **Implementation:** \`axios.get().then().catch()\` with callback
- **Result:** ${asyncData.results[0].passed ? '✅ PASSED' : '❌ FAILED'}
- **File:** \`tests/responses/async_task10_callback.json\`

### Task 11: Search by ISBN (Promise Pattern)  
- **Pattern:** Promise chaining with .then()/.catch()
- **Implementation:** \`new Promise((resolve, reject) => {...})\`
- **Result:** ${asyncData.results[1].passed ? '✅ PASSED' : '❌ FAILED'}
- **File:** \`tests/responses/async_task11_promise.json\`

### Task 12: Search by Author (Async/Await)
- **Pattern:** Modern async/await syntax
- **Implementation:** \`async function\` with \`await axios.get()\`
- **Result:** ${asyncData.results[2].passed ? '✅ PASSED' : '❌ FAILED'}
- **File:** \`tests/responses/async_task12_asyncawait_author.json\`

### Task 13: Search by Title (Async/Await)
- **Pattern:** Modern async/await with error handling  
- **Implementation:** \`async function\` with try/catch
- **Result:** ${asyncData.results[3].passed ? '✅ PASSED' : '❌ FAILED'}
- **File:** \`tests/responses/async_task13_asyncawait_title.json\`

---

## API Endpoints Documentation

### Public Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | \`/api/v1/books\` | Get all books | ${summaryData.results[0].status} |
| GET | \`/api/v1/books/:isbn\` | Get book by ISBN | ${summaryData.results[1].status} |
| GET | \`/api/v1/books?author=name\` | Get books by author | ${summaryData.results[2].status} |
| GET | \`/api/v1/books?title=name\` | Get books by title | ${summaryData.results[3].status} |
| GET | \`/api/v1/books/:isbn/reviews\` | Get book reviews | ${summaryData.results[4].status} |
| POST | \`/api/v1/auth/register\` | Register new user | ${summaryData.results[5].status} |
| POST | \`/api/v1/auth/login\` | Login user | ${summaryData.results[6].status} |

### Protected Endpoints (JWT Required)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | \`/api/v1/books/:isbn/reviews\` | Add/modify review | ${summaryData.results[7].status} |
| DELETE | \`/api/v1/reviews/:reviewId\` | Delete review | ${summaryData.results[8].status} |

---

## Response Files

All test responses are saved in \`tests/responses/\` directory:

- \`task1_getAllBooks.json\` - All books response
- \`task2_getBookByISBN.json\` - Single book by ISBN
- \`task3_getBooksByAuthor.json\` - Books by author search
- \`task4_getBooksByTitle.json\` - Books by title search
- \`task5_getBookReviews.json\` - Book reviews
- \`task6_registerUser.json\` - User registration response
- \`task7_loginUser.json\` - Login response with JWT token
- \`task8_addReview.json\` - Add review response
- \`task9_deleteReview.json\` - Delete review response
- \`async_task10_callback.json\` - Callback pattern demo
- \`async_task11_promise.json\` - Promise pattern demo
- \`async_task12_asyncawait_author.json\` - Async/await author search
- \`async_task13_asyncawait_title.json\` - Async/await title search
- \`_SUMMARY_REPORT.json\` - Complete endpoint test report
- \`_ASYNC_SUMMARY.json\` - Complete async methods report

---

## Next Steps

### For Peer Review Submission:

1. ✅ **Take Postman Screenshots**
   - Test each endpoint in Postman
   - Capture request and response for all 9 tasks
   - Save screenshots for submission

2. ✅ **Prepare GitHub Repository**
   - Push code to GitHub
   - Ensure README.md is clear and complete
   - Verify all files are committed

3. ✅ **Submit to IBM Coursera**
   - Upload this RESULTS.md
   - Include Postman screenshots
   - Provide GitHub repository URL

---

## Notes

- All endpoints tested with retry logic (max 2 retries)
- JWT token automatically generated and used for protected routes
- Response times measured in milliseconds
- All responses saved as JSON for verification
- Tests run automatically on server startup

---

**Report Generated:** ${new Date().toLocaleString()}  
**BookVerse API v1.5** - IBM Final Project  
© 2025 Damion Broussard
`;
    
    await fs.writeFile(path.join(__dirname, 'RESULTS.md'), report);
    log('\n📄 RESULTS.md generated successfully!', 'green');
    
  } catch (error) {
    log(`\n⚠️  Could not generate RESULTS.md: ${error.message}`, 'yellow');
  }
}

/**
 * Main auto-test runner
 */
async function runAutoTests() {
  log('\n', 'reset');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                            ║', 'cyan');
  log('║       BookVerse API v1.5 - Automated QA Suite             ║', 'cyan');
  log('║       Auto-executing all endpoint and async tests         ║', 'cyan');
  log('║                                                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log('\n', 'reset');
  
  const startTime = Date.now();
  
  try {
    // Run endpoint tests
    const endpointSuccess = await runTest(
      path.join(__dirname, 'tests', 'testAllEndpoints.js'),
      'Endpoint Tests (Tasks 1-9)'
    );
    
    // Wait between test suites
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Run async methods tests
    const asyncSuccess = await runTest(
      path.join(__dirname, 'tests', 'asyncMethodsDemo.js'),
      'Async Methods Demo (Tasks 10-13)'
    );
    
    // Generate RESULTS.md
    await generateResultsReport();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                  Auto-Test Summary                         ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');
    log(`\n⏱️  Total Duration: ${duration}s`, 'blue');
    log(`📊 Endpoint Tests: ${endpointSuccess ? '✅ PASSED' : '⚠️  WARNINGS'}`, endpointSuccess ? 'green' : 'yellow');
    log(`🔄 Async Tests: ${asyncSuccess ? '✅ PASSED' : '⚠️  WARNINGS'}`, asyncSuccess ? 'green' : 'yellow');
    log(`📄 Reports: tests/responses/ & RESULTS.md`, 'blue');
    log('\n🎯 Server ready for manual testing and submission!\n', 'green');
    
  } catch (error) {
    log(`\n❌ Auto-test failed: ${error.message}`, 'red');
    console.error(error);
  }
}

// Export for use
module.exports = { runAutoTests };

// Run if executed directly
if (require.main === module) {
  runAutoTests().catch(console.error);
}

