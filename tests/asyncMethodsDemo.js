/**
 * BookVerse API - Async Methods Demonstration (Tasks 10-13)
 * Demonstrates: Callbacks, Promises, async/await patterns
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5001/api/v1';
const RESPONSES_DIR = path.join(__dirname, 'responses');

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

async function saveAsyncResponse(filename, data) {
  try {
    await fs.mkdir(RESPONSES_DIR, { recursive: true });
    const filepath = path.join(RESPONSES_DIR, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Failed to save: ${error.message}`);
  }
}

/**
 * TASK 10: Get All Books using Async Callback Pattern
 * Demonstrates traditional callback-style async programming
 */
function getAllBooksCallback(callback) {
  log('\n[Task 10] Get All Books - Callback Pattern', 'magenta');
  
  axios.get(`${BASE_URL}/books`)
    .then(response => {
      const result = {
        task: 10,
        pattern: 'callback',
        success: true,
        results: response.data.results,
        timestamp: new Date().toISOString()
      };
      
      saveAsyncResponse('async_task10_callback.json', result)
        .then(() => {
          log(`✅ Callback: Found ${response.data.results} books`, 'green');
          callback(null, result);
        });
    })
    .catch(error => {
      const result = {
        task: 10,
        pattern: 'callback',
        success: false,
        error: error.message
      };
      log(`❌ Callback Error: ${error.message}`, 'red');
      callback(error, null);
    });
}

/**
 * TASK 11: Search by ISBN using Promise Pattern
 * Demonstrates Promise chaining
 */
function searchByISBNPromise(isbn) {
  log('\n[Task 11] Search by ISBN - Promise Pattern', 'magenta');
  
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/books/${isbn}`)
      .then(response => {
        const result = {
          task: 11,
          pattern: 'promise',
          success: true,
          book: response.data.data.book,
          timestamp: new Date().toISOString()
        };
        
        return saveAsyncResponse('async_task11_promise.json', result)
          .then(() => result);
      })
      .then(result => {
        log(`✅ Promise: Found book - ${result.book.title}`, 'green');
        resolve(result);
      })
      .catch(error => {
        const result = {
          task: 11,
          pattern: 'promise',
          success: false,
          error: error.message
        };
        log(`❌ Promise Error: ${error.message}`, 'red');
        reject(result);
      });
  });
}

/**
 * TASK 12: Search by Author using Async/Await Pattern
 * Demonstrates modern async/await syntax
 */
async function searchByAuthorAsync(author) {
  log('\n[Task 12] Search by Author - Async/Await Pattern', 'magenta');
  
  try {
    const response = await axios.get(`${BASE_URL}/books`, {
      params: { author }
    });
    
    const result = {
      task: 12,
      pattern: 'async/await',
      success: true,
      author: author,
      booksFound: response.data.results,
      books: response.data.data.books,
      timestamp: new Date().toISOString()
    };
    
    await saveAsyncResponse('async_task12_asyncawait_author.json', result);
    log(`✅ Async/Await: Found ${result.booksFound} books by ${author}`, 'green');
    
    return result;
  } catch (error) {
    const result = {
      task: 12,
      pattern: 'async/await',
      success: false,
      error: error.message
    };
    log(`❌ Async/Await Error: ${error.message}`, 'red');
    throw result;
  }
}

/**
 * TASK 13: Search by Title using Async/Await Pattern
 * Demonstrates modern async/await syntax with error handling
 */
async function searchByTitleAsync(title) {
  log('\n[Task 13] Search by Title - Async/Await Pattern', 'magenta');
  
  try {
    const response = await axios.get(`${BASE_URL}/books`, {
      params: { title }
    });
    
    const result = {
      task: 13,
      pattern: 'async/await',
      success: true,
      title: title,
      booksFound: response.data.results,
      books: response.data.data.books,
      timestamp: new Date().toISOString()
    };
    
    await saveAsyncResponse('async_task13_asyncawait_title.json', result);
    log(`✅ Async/Await: Found ${result.booksFound} books matching "${title}"`, 'green');
    
    return result;
  } catch (error) {
    const result = {
      task: 13,
      pattern: 'async/await',
      success: false,
      error: error.message
    };
    log(`❌ Async/Await Error: ${error.message}`, 'red');
    throw result;
  }
}

/**
 * Run all async demonstrations
 */
async function demonstrateAsyncMethods() {
  log('\n========================================', 'blue');
  log('  Async Methods Demonstration', 'blue');
  log('  Tasks 10-13: Callbacks, Promises, Async/Await', 'blue');
  log('========================================', 'blue');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  try {
    // Task 10: Callback
    await new Promise((resolve) => {
      getAllBooksCallback((err, result) => {
        if (err) {
          failed++;
          results.push({ task: 10, passed: false });
        } else {
          passed++;
          results.push({ task: 10, passed: true });
        }
        resolve();
      });
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Task 11: Promise
    try {
      await searchByISBNPromise('978-0-13-235088-4');
      passed++;
      results.push({ task: 11, passed: true });
    } catch (error) {
      failed++;
      results.push({ task: 11, passed: false });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Task 12: Async/Await - Author
    try {
      await searchByAuthorAsync('Robert C. Martin');
      passed++;
      results.push({ task: 12, passed: true });
    } catch (error) {
      failed++;
      results.push({ task: 12, passed: false });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Task 13: Async/Await - Title
    try {
      await searchByTitleAsync('Clean Code');
      passed++;
      results.push({ task: 13, passed: true });
    } catch (error) {
      failed++;
      results.push({ task: 13, passed: false });
    }
    
    // Summary
    log('\n========================================', 'blue');
    log('  Async Methods Summary', 'blue');
    log('========================================\n', 'blue');
    
    console.table([
      { Task: 10, Method: 'Callback', Pattern: 'callback(err, data)', Status: results[0].passed ? '✅ PASS' : '❌ FAIL' },
      { Task: 11, Method: 'Promise', Pattern: 'promise.then().catch()', Status: results[1].passed ? '✅ PASS' : '❌ FAIL' },
      { Task: 12, Method: 'Async/Await', Pattern: 'await axios.get()', Status: results[2].passed ? '✅ PASS' : '❌ FAIL' },
      { Task: 13, Method: 'Async/Await', Pattern: 'await axios.get()', Status: results[3].passed ? '✅ PASS' : '❌ FAIL' }
    ]);
    
    log(`\nTotal: 4 | Passed: ${passed} | Failed: ${failed}\n`, passed === 4 ? 'green' : 'yellow');
    
    // Save summary
    const summary = {
      metadata: {
        project: 'BookVerse API v1.5',
        testType: 'Async Methods Demonstration',
        timestamp: new Date().toISOString()
      },
      results,
      summary: {
        total: 4,
        passed,
        failed
      }
    };
    
    await saveAsyncResponse('_ASYNC_SUMMARY.json', summary);
    log('📄 Async methods report saved\n', 'blue');
    
    return passed === 4;
    
  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  log('⏳ Starting async methods demonstration...', 'yellow');
  log('📡 Waiting for server to be ready...\n', 'yellow');
  
  setTimeout(() => {
    demonstrateAsyncMethods()
      .then(success => {
        if (success) {
          log('✅ All async methods demonstrated successfully!\n', 'green');
          process.exit(0);
        } else {
          log('⚠️  Some async methods failed!\n', 'yellow');
          process.exit(1);
        }
      })
      .catch(error => {
        console.error('Demo failed:', error);
        process.exit(1);
      });
  }, 2000);
}

module.exports = {
  getAllBooksCallback,
  searchByISBNPromise,
  searchByAuthorAsync,
  searchByTitleAsync,
  demonstrateAsyncMethods
};

