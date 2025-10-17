# 📚 BookVerse API v1.5

**Online Book Review REST API** - IBM Final Project

A fully-featured RESTful web service for managing an online bookstore with user authentication, book catalog, and review system.

---

## 🚀 Features

- ✅ Complete REST API with Express.js and Node.js
- ✅ JWT-based authentication and authorization
- ✅ User registration and login
- ✅ Book catalog management
- ✅ Review system (add, modify, delete)
- ✅ Concurrent request handling with async/await, Promises, and callbacks
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Thread-safe file operations with Mutex
- ✅ Input validation and sanitization
- ✅ Structured logging

---

## 📋 Project Requirements (30 Points)

### General Users
- [x] **Task 1** - Get book list (2 pts)
- [x] **Task 2** - Get book by ISBN (2 pts)
- [x] **Task 3** - Get all books by Author (2 pts)
- [x] **Task 4** - Get all books by Title (2 pts)
- [x] **Task 5** - Get book Review (2 pts)
- [x] **Task 6** - Register new user (3 pts)
- [x] **Task 7** - Login user (3 pts)

### Registered Users
- [x] **Task 8** - Add/Modify book review (2 pts)
- [x] **Task 9** - Delete book review (2 pts)

### Node.js Async Methods
- [x] **Task 10** - Get all books (async callback) (2 pts)
- [x] **Task 11** - Search by ISBN (Promise) (2 pts)
- [x] **Task 12** - Search by Author (async/await) (2 pts)
- [x] **Task 13** - Search by Title (async/await) (2 pts)

---

## 🏗️ Architecture

```
bookverse-api/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── bookController.js
│   └── reviewController.js
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── reviewRoutes.js
├── middleware/           # Custom middleware
│   ├── authMiddleware.js
│   ├── asyncHandler.js
│   └── errorHandler.js
├── utils/                # Utility functions
│   ├── AppError.js
│   ├── fileManager.js
│   ├── validation.js
│   └── logger.js
├── data/                 # JSON data storage
│   ├── books.json
│   ├── users.json
│   └── reviews.json
├── asyncMethods.js       # Async patterns demo (Tasks 10-13)
├── server.js             # Main server file
├── package.json
├── .env
└── README.md
```

---

## 🛠️ Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookverse-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=bookverse_super_secret_key_2024_ibm_project_final
   TOKEN_EXPIRY=24h
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start the server**
   
   Development mode (with nodemon):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

5. **Verify server is running**
   
   Open browser to: `http://localhost:5000/`
   
   You should see:
   ```json
   {
     "message": "Welcome to BookVerse API v1.5"
   }
   ```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register New User (Task 6)
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "userId": "uuid",
    "username": "johndoe",
    "token": "jwt-token-here"
  }
}
```

#### Login User (Task 7)
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "userId": "uuid",
    "username": "johndoe",
    "token": "jwt-token-here"
  }
}
```

---

### Book Endpoints

#### Get All Books (Task 1)
```http
GET /api/v1/books
```

#### Get Book by ISBN (Task 2)
```http
GET /api/v1/books/978-0-13-235088-4
```

#### Get Books by Author (Task 3)
```http
GET /api/v1/books?author=Robert%20C.%20Martin
```

#### Get Books by Title (Task 4)
```http
GET /api/v1/books?title=Clean%20Code
```

#### Get Book Reviews (Task 5)
```http
GET /api/v1/books/978-0-13-235088-4/reviews
```

---

### Review Endpoints (Protected - Require JWT)

#### Add/Modify Review (Task 8)
```http
POST /api/v1/books/978-0-13-235088-4/reviews
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent book on clean coding practices!"
}
```

#### Update Review
```http
PUT /api/v1/reviews/<reviewId>
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review text"
}
```

#### Delete Review (Task 9)
```http
DELETE /api/v1/reviews/<reviewId>
Authorization: Bearer <jwt-token>
```

---

## 🔄 Async Methods Demo (Tasks 10-13)

Run the async methods demonstration:

```bash
# Start the server first
npm start

# In another terminal, run:
node asyncMethods.js
```

This demonstrates:
- **Task 10**: Callback pattern for getting all books
- **Task 11**: Promise pattern for searching by ISBN
- **Task 12**: Async/await pattern for searching by author
- **Task 13**: Async/await pattern for searching by title

---

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with `baseUrl = http://localhost:5000/api/v1`
3. Test authentication endpoints first
4. Save the JWT token from login response
5. Use token in Authorization header for protected routes

### Example Postman Tests

**Test Flow:**
1. Register a new user
2. Login with credentials
3. Get all books
4. Get book by ISBN
5. Search books by author
6. Add a review (with token)
7. Modify the review
8. Delete the review

---

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevents abuse (100 requests per 15 min)
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Sanitization and validation
- **Mutex Locks** - Thread-safe file operations

---

## 📊 Data Models

### User
```javascript
{
  userId: "uuid",
  username: "string",
  password: "hashed-password",
  email: "string",
  createdAt: "ISO-timestamp"
}
```

### Book
```javascript
{
  isbn: "string",
  author: "string",
  title: "string",
  reviews: []
}
```

### Review
```javascript
{
  reviewId: "uuid",
  isbn: "string",
  userId: "uuid",
  username: "string",
  rating: 1-5,
  comment: "string",
  createdAt: "ISO-timestamp",
  updatedAt: "ISO-timestamp"
}
```

---

## 🐛 Error Handling

The API uses consistent error responses:

```json
{
  "status": "fail",
  "message": "Error description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (delete)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 👨‍💻 Development

### Scripts
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT signing
- `TOKEN_EXPIRY` - Token expiration time (default: 24h)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

---

## 📝 License

ISC

---

## 👤 Author

**Damion Broussard**

---

## 📚 References

- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## ✅ Submission Checklist

- [x] All 14 tasks implemented and tested
- [x] JWT authentication working
- [x] All endpoints return proper status codes
- [x] Async methods module created
- [x] Security middleware configured
- [x] Input validation implemented
- [x] Error handling complete
- [x] README documentation
- [x] Code committed to GitHub
- [x] Server runs on http://localhost:5000

---

**BookVerse API v1.5** - Built for IBM Final Project 🚀

