# 📦 GitHub Setup Instructions

## Quick Setup Guide

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Fill in details:
   - **Repository name:** `bookverse-api`
   - **Description:** `Online Book Review REST API - IBM Final Project`
   - **Visibility:** Public ✅
   - **Initialize:** ❌ DO NOT initialize with README (we already have one)
4. Click **"Create repository"**

### Step 2: Link Local Repository to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bookverse-api.git

# Verify remote
git remote -v

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all 25 files
3. README.md should display automatically
4. Check that .gitignore is working (no node_modules/)

### Step 4: Get Repository URL

Your submission URL will be:
```
https://github.com/YOUR_USERNAME/bookverse-api
```

Copy this URL for submission to IBM Coursera platform.

---

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create bookverse-api --public --source=. --remote=origin --push

# Your repository is now created and pushed!
```

---

## Alternative: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose the `bookverse-api` folder
4. Click "Publish repository"
5. Make sure "Keep this code private" is **unchecked**
6. Click "Publish Repository"

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/bookverse-api.git
```

### Error: "branch 'main' does not exist"
```bash
git branch -M main
```

### Error: Authentication failed
```bash
# Use GitHub token instead of password
# Generate token at: https://github.com/settings/tokens
# Use token as password when prompted
```

---

## After Pushing to GitHub

### Add Repository Topics (Recommended)

On your GitHub repository page:
1. Click "⚙️ Settings" next to "About"
2. Add topics:
   - `nodejs`
   - `express`
   - `rest-api`
   - `jwt`
   - `ibm-project`
   - `book-review`

### Update Repository Description

Set description:
```
Online Book Review REST API - IBM Final Project | Node.js + Express.js + JWT Authentication
```

### Add GitHub Repository Link to README

Edit README.md on GitHub and add at the top:
```markdown
**🔗 GitHub Repository:** [bookverse-api](https://github.com/YOUR_USERNAME/bookverse-api)
```

---

## 🎯 Submission Checklist

Before submitting to IBM Coursera:

- [ ] Repository is **public** (not private)
- [ ] All files are visible on GitHub
- [ ] README.md displays correctly
- [ ] Repository URL copied
- [ ] Tested cloning: `git clone https://github.com/YOUR_USERNAME/bookverse-api.git`
- [ ] Project runs after clone: `npm install && npm start`

---

## 📄 Repository URL Format

Your final submission should be in this format:

```
https://github.com/YOUR_USERNAME/bookverse-api
```

**Example:**
```
https://github.com/damionbroussard/bookverse-api
```

---

## ✅ Ready for Submission!

Once pushed to GitHub:
1. Copy your repository URL
2. Go to IBM Coursera Final Project submission
3. Paste the URL in the "GitHub Repository" field
4. Submit for peer review

**Good luck! 🚀**

