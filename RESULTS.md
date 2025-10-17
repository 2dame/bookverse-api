# BookVerse API v1.5 — Automated QA Report

## Project Metadata

- **Project:** BookVerse API v1.5
- **Description:** Online Book Review REST API - IBM Final Project
- **Environment:** development
- **Test Date:** 10/16/2025, 11:30:43 PM
- **Base URL:** http://localhost:5001/api/v1

---

## Test Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | 13 |
| **Passed** | ✅ 13 |
| **Failed** | ❌ 0 |
| **Success Rate** | 100.0% |
| **Test Duration** | ~0.73s |

---

## Endpoint Tests (Tasks 1-9)

### Test Results


#### Task 1: Get All Books
- **Method:** `GET`
- **Endpoint:** `/books`
- **Status Code:** 200
- **Response Time:** 58ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:37 PM


#### Task 2: Get Book by ISBN
- **Method:** `GET`
- **Endpoint:** `/books/:isbn`
- **Status Code:** 200
- **Response Time:** 5ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:37 PM


#### Task 3: Get Books by Author
- **Method:** `GET`
- **Endpoint:** `/books?author=`
- **Status Code:** 200
- **Response Time:** 6ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:37 PM


#### Task 4: Get Books by Title
- **Method:** `GET`
- **Endpoint:** `/books?title=`
- **Status Code:** 200
- **Response Time:** 5ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:37 PM


#### Task 5: Get Book Reviews
- **Method:** `GET`
- **Endpoint:** `/books/:isbn/reviews`
- **Status Code:** 200
- **Response Time:** 7ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:37 PM


#### Task 6: Register New User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Status Code:** 201
- **Response Time:** 310ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:38 PM


#### Task 7: Login User
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Status Code:** 200
- **Response Time:** 323ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:38 PM


#### Task 8: Add Book Review
- **Method:** `POST`
- **Endpoint:** `/books/:isbn/reviews`
- **Status Code:** 201
- **Response Time:** 11ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:38 PM


#### Task 9: Delete Book Review
- **Method:** `DELETE`
- **Endpoint:** `/reviews/:reviewId`
- **Status Code:** 204
- **Response Time:** 7ms
- **Result:** ✅ PASSED
- **Timestamp:** 10/16/2025, 11:30:38 PM


---

## Async Methods Tests (Tasks 10-13)

### Task 10: Get All Books (Callback Pattern)
- **Pattern:** Traditional callback(err, data)
- **Implementation:** `axios.get().then().catch()` with callback
- **Result:** ✅ PASSED
- **File:** `tests/responses/async_task10_callback.json`

### Task 11: Search by ISBN (Promise Pattern)  
- **Pattern:** Promise chaining with .then()/.catch()
- **Implementation:** `new Promise((resolve, reject) => {...})`
- **Result:** ✅ PASSED
- **File:** `tests/responses/async_task11_promise.json`

### Task 12: Search by Author (Async/Await)
- **Pattern:** Modern async/await syntax
- **Implementation:** `async function` with `await axios.get()`
- **Result:** ✅ PASSED
- **File:** `tests/responses/async_task12_asyncawait_author.json`

### Task 13: Search by Title (Async/Await)
- **Pattern:** Modern async/await with error handling  
- **Implementation:** `async function` with try/catch
- **Result:** ✅ PASSED
- **File:** `tests/responses/async_task13_asyncawait_title.json`

---

## API Endpoints Documentation

### Public Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/v1/books` | Get all books | 200 |
| GET | `/api/v1/books/:isbn` | Get book by ISBN | 200 |
| GET | `/api/v1/books?author=name` | Get books by author | 200 |
| GET | `/api/v1/books?title=name` | Get books by title | 200 |
| GET | `/api/v1/books/:isbn/reviews` | Get book reviews | 200 |
| POST | `/api/v1/auth/register` | Register new user | 201 |
| POST | `/api/v1/auth/login` | Login user | 200 |

### Protected Endpoints (JWT Required)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/v1/books/:isbn/reviews` | Add/modify review | 201 |
| DELETE | `/api/v1/reviews/:reviewId` | Delete review | 204 |

---

## Response Files

All test responses are saved in `tests/responses/` directory:

- `task1_getAllBooks.json` - All books response
- `task2_getBookByISBN.json` - Single book by ISBN
- `task3_getBooksByAuthor.json` - Books by author search
- `task4_getBooksByTitle.json` - Books by title search
- `task5_getBookReviews.json` - Book reviews
- `task6_registerUser.json` - User registration response
- `task7_loginUser.json` - Login response with JWT token
- `task8_addReview.json` - Add review response
- `task9_deleteReview.json` - Delete review response
- `async_task10_callback.json` - Callback pattern demo
- `async_task11_promise.json` - Promise pattern demo
- `async_task12_asyncawait_author.json` - Async/await author search
- `async_task13_asyncawait_title.json` - Async/await title search
- `_SUMMARY_REPORT.json` - Complete endpoint test report
- `_ASYNC_SUMMARY.json` - Complete async methods report

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

**Report Generated:** 10/16/2025, 11:30:43 PM  
**BookVerse API v1.5** - IBM Final Project  
© 2025 Damion Broussard
