# ⚡ BookVerse API - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Server
```bash
npm start
```

Server will start at: **http://localhost:5001/**

### 3️⃣ Test API
Open browser to: http://localhost:5001/

You should see:
```json
{
  "message": "Welcome to BookVerse API v1.5"
}
```

---

## 🧪 Run Tests

### Test All Endpoints (Tasks 1-9)
```bash
node test-api.js
```

Expected output:
```
✅ All Core Tests Passed!
Tasks 1-9: 22 points earned
```

### Test Async Methods (Tasks 10-13)
```bash
node asyncMethods.js
```

Expected output:
```
✅ Found 10 books using callback
✅ Found book via Promise
✅ Found books by author
✅ Found books by title
```

---

## 📡 Try API Endpoints

### Get All Books
```bash
curl http://localhost:5001/api/v1/books
```

### Register User
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"john\",\"password\":\"pass123\"}"
```

### Login
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"john\",\"password\":\"pass123\"}"
```

---

## 🔑 Environment Variables

Create `.env` file (already exists):
```env
PORT=5001
JWT_SECRET=bookverse_super_secret_key_2024_ibm_project_final
TOKEN_EXPIRY=24h
```

---

## 📚 Full Documentation

- **README.md** - Complete documentation
- **POSTMAN_TESTS.md** - Postman testing guide
- **PROJECT_COMPLETION.md** - Project completion report
- **GITHUB_SETUP.md** - GitHub setup instructions

---

## ✅ Verification Checklist

- [ ] `npm install` completed successfully
- [ ] Server starts without errors
- [ ] Root endpoint returns welcome message
- [ ] `node test-api.js` passes all tests
- [ ] `node asyncMethods.js` passes all async tests

---

## 🆘 Troubleshooting

### Port Already in Use
Edit `.env` and change PORT to another number (e.g., 5002)

### Module Not Found
Run `npm install` again

### Tests Failing
Make sure server is running before running tests

---

## 🎯 Ready for Submission!

All 14 tasks completed and tested ✅

See **GITHUB_SETUP.md** for GitHub submission instructions.

---

**Happy Coding! 🚀**

