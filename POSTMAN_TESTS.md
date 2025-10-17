# 🧪 Postman Testing Guide - BookVerse API

Complete guide for testing all API endpoints with Postman.

---

## 📋 Setup

1. **Base URL:** `http://localhost:5000/api/v1`
2. **Create Environment Variable:** `baseUrl = http://localhost:5000/api/v1`
3. **Token Storage:** Save JWT token after login for protected routes

---

## 🔐 Authentication Tests

### Test 1: Register New User (Task 6 - 3 pts)

**Request:**
```http
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "username": "testuser1",
  "password": "password123",
  "email": "test1@example.com"
}
```

**Expected Response:** `201 Created`
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "userId": "generated-uuid",
    "username": "testuser1",
    "token": "jwt-token-here"
  }
}
```

**Save Token:**
- Go to Tests tab in Postman
- Add:
  ```javascript
  pm.environment.set("token", pm.response.json().data.token);
  ```

---

### Test 2: Login User (Task 7 - 3 pts)

**Request:**
```http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "testuser1",
  "password": "password123"
}
```

**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "userId": "uuid",
    "username": "testuser1",
    "token": "jwt-token-here"
  }
}
```

**Save Token:**
```javascript
pm.environment.set("token", pm.response.json().data.token);
```

---

## 📚 Book Endpoints Tests

### Test 3: Get All Books (Task 1 - 2 pts)

**Request:**
```http
GET {{baseUrl}}/books
```

**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "books": [
      {
        "isbn": "978-0-13-235088-4",
        "author": "Robert C. Martin",
        "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
        "reviews": []
      }
      // ... more books
    ]
  }
}
```

---

### Test 4: Get Book by ISBN (Task 2 - 2 pts)

**Request:**
```http
GET {{baseUrl}}/books/978-0-13-235088-4
```

**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "book": {
      "isbn": "978-0-13-235088-4",
      "author": "Robert C. Martin",
      "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
      "reviews": []
    }
  }
}
```

**Test 404:**
```http
GET {{baseUrl}}/books/invalid-isbn
```

Expected: `404 Not Found`

---

### Test 5: Get Books by Author (Task 3 - 2 pts)

**Request:**
```http
GET {{baseUrl}}/books?author=Robert C. Martin
```

**Alternative (URL Encoded):**
```http
GET {{baseUrl}}/books?author=Robert%20C.%20Martin
```

**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "books": [
      {
        "isbn": "978-0-13-235088-4",
        "author": "Robert C. Martin",
        "title": "Clean Code: A Handbook of Agile Software Craftsmanship"
      },
      {
        "isbn": "978-0-13-468599-1",
        "author": "Robert C. Martin",
        "title": "Clean Architecture"
      }
    ]
  }
}
```

---

### Test 6: Get Books by Title (Task 4 - 2 pts)

**Request:**
```http
GET {{baseUrl}}/books?title=Clean Code
```

**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "books": [
      {
        "isbn": "978-0-13-235088-4",
        "author": "Robert C. Martin",
        "title": "Clean Code: A Handbook of Agile Software Craftsmanship"
      }
    ]
  }
}
```

**Test Partial Match:**
```http
GET {{baseUrl}}/books?title=JavaScript
```

Should return all books with "JavaScript" in title.

---

### Test 7: Get Book Reviews (Task 5 - 2 pts)

**Request:**
```http
GET {{baseUrl}}/books/978-0-13-235088-4/reviews
```

**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "results": 0,
  "data": {
    "isbn": "978-0-13-235088-4",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "reviews": []
  }
}
```

---

## ⭐ Review Endpoints Tests (Protected)

**Important:** All review endpoints require JWT token in Authorization header.

**Header Setup:**
```
Authorization: Bearer {{token}}
```

In Postman:
1. Go to Authorization tab
2. Select "Bearer Token"
3. Enter: `{{token}}`

---

### Test 8: Add Book Review (Task 8 - 2 pts)

**Request:**
```http
POST {{baseUrl}}/books/978-0-13-235088-4/reviews
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent book! Must-read for every developer."
}
```

**Expected Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Review added successfully",
  "data": {
    "review": {
      "reviewId": "generated-uuid",
      "isbn": "978-0-13-235088-4",
      "userId": "user-uuid",
      "username": "testuser1",
      "rating": 5,
      "comment": "Excellent book! Must-read for every developer.",
      "createdAt": "2024-10-16T..."
    }
  }
}
```

**Save Review ID:**
```javascript
pm.environment.set("reviewId", pm.response.json().data.review.reviewId);
```

---

### Test 9: Modify Existing Review (Task 8 - 2 pts)

**Request:** (Same endpoint as add - will update if user already reviewed)
```http
POST {{baseUrl}}/books/978-0-13-235088-4/reviews
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Great book, slightly updated review."
}
```

**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Review updated successfully",
  "data": {
    "review": {
      "reviewId": "same-uuid",
      "rating": 4,
      "comment": "Great book, slightly updated review.",
      "updatedAt": "2024-10-16T..."
    }
  }
}
```

---

### Test 10: Update Review by ID

**Request:**
```http
PUT {{baseUrl}}/reviews/{{reviewId}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Updated via PUT endpoint"
}
```

**Expected Response:** `200 OK`

---

### Test 11: Delete Book Review (Task 9 - 2 pts)

**Request:**
```http
DELETE {{baseUrl}}/reviews/{{reviewId}}
Authorization: Bearer {{token}}
```

**Expected Response:** `204 No Content`

Body: (empty)

---

### Test 12: Verify Review Deleted

**Request:**
```http
GET {{baseUrl}}/books/978-0-13-235088-4/reviews
```

**Expected:** Review should no longer appear in the list.

---

## 🚫 Error Tests

### Test 13: Unauthorized Access (No Token)

**Request:**
```http
POST {{baseUrl}}/books/978-0-13-235088-4/reviews
Content-Type: application/json

{
  "rating": 5,
  "comment": "This should fail"
}
```

**Expected Response:** `401 Unauthorized`
```json
{
  "status": "fail",
  "message": "You are not logged in! Please log in to get access."
}
```

---

### Test 14: Invalid ISBN

**Request:**
```http
GET {{baseUrl}}/books/invalid-isbn-12345
```

**Expected Response:** `404 Not Found`
```json
{
  "status": "fail",
  "message": "No book found with that ISBN"
}
```

---

### Test 15: Delete Review Not Owned

1. Register second user
2. Login with second user
3. Try to delete first user's review

**Expected Response:** `403 Forbidden`
```json
{
  "status": "fail",
  "message": "You do not have permission to delete this review"
}
```

---

### Test 16: Invalid Rating

**Request:**
```http
POST {{baseUrl}}/books/978-0-13-235088-4/reviews
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "rating": 10,
  "comment": "Invalid rating"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "status": "fail",
  "message": "Please provide a valid rating (1-5)"
}
```

---

## 📊 Complete Test Collection

### Postman Collection JSON

Create a new collection in Postman and import these tests:

```json
{
  "info": {
    "name": "BookVerse API v1.5",
    "description": "Complete API test suite",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1"
    }
  ]
}
```

---

## ✅ Verification Checklist

- [ ] Test 1: Register user (201)
- [ ] Test 2: Login user (200)
- [ ] Test 3: Get all books (200)
- [ ] Test 4: Get book by ISBN (200)
- [ ] Test 5: Get books by author (200)
- [ ] Test 6: Get books by title (200)
- [ ] Test 7: Get book reviews (200)
- [ ] Test 8: Add review (201)
- [ ] Test 9: Modify review (200)
- [ ] Test 10: Update review by ID (200)
- [ ] Test 11: Delete review (204)
- [ ] Test 12: Unauthorized request (401)
- [ ] Test 13: Book not found (404)
- [ ] Test 14: Invalid rating (400)

---

## 🎯 Score Breakdown

- **Tasks 1-5** (General Users): 10 pts
- **Tasks 6-7** (Auth): 6 pts
- **Tasks 8-9** (Reviews): 4 pts
- **Tasks 10-13** (Async): 8 pts
- **Total:** 28 pts + 2 pts for GitHub = **30 pts**

---

**All tests passing = Full marks! 🎉**

