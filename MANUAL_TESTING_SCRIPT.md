# 🧪 CodeVerse - Complete Manual Testing Script

**Date:** February 25, 2026  
**Purpose:** Pre-deployment verification  
**Estimated Duration:** 40 minutes  
**Status:** Required before going live

---

## ⏱️ TIMELINE

- **Part 1: Setup & Server Check** (5 minutes)
- **Part 2: Frontend Testing** (10 minutes)
- **Part 3: Backend API Testing** (10 minutes)
- **Part 4: Integration Testing** (10 minutes)
- **Part 5: Error Handling** (5 minutes)
- **TOTAL:** ~40 minutes

---

# 📋 PART 1: SETUP & SERVER CHECK (5 minutes)

## 1.1 Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js version (should be 14+)
node --version
# Expected: v18.x.x or higher ✅

# Check npm version
npm --version
# Expected: 8.x.x or higher ✅

# Check MongoDB connection string is set
echo %DB_URL%
# Expected: mongodb+srv://... (not empty) ✅
```

## 1.2 Clear Terminal & Dependencies

```bash
# Option 1: If first time, install everything fresh
cd backend
npm install
npm start

# Option 2: If already installed, just start
npm start
```

### ✅ Expected Output:
```
> backend@1.0.0 start
> node src/server.js

✅ Connected to MongoDB: ac-prczmdn-shard-00-01.inpyfps.mongodb.net
Server is running on port: 3000
```

**❌ If you see MongoDB error:**
- Check DB_URL in backend/.env
- Verify MongoDB Atlas IP whitelist includes your IP
- Verify credentials are correct

## 1.3 Start Frontend in New Terminal

```bash
cd frontend
npm install
npm run dev
```

### ✅ Expected Output:
```
  VITE v7.1.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

# ✅ PART 2: FRONTEND TESTING (10 minutes)

## 2.1 Initial Page Load

**Action:**
- Open http://localhost:5173 in your browser

**Expected Result:**
- ✅ Page loads without white screen
- ✅ No red errors in DevTools console
- ✅ Welcome section visible
- ✅ Navigation bar at top
- ✅ Some content is visible (not blank)

**Check DevTools (F12):**
- Click Console tab
- Should show NO red errors
- May show yellow warnings (acceptable)

### ❌ If Issues:
```
Problem: Blank white page
Solution: 
  1. Check browser console for errors (F12)
  2. Check terminal for build errors
  3. Clear cache: Ctrl+Shift+Delete in Chrome

Problem: "Cannot GET /api/..."
Solution:
  1. Ensure backend is running on port 3000
  2. Check CORS in backend/src/server.js
```

---

## 2.2 Navigation Test

**Action:** Click on each navbar item

**Expected Results:**
- [ ] Logo click → Goes to home
- [ ] "Problems" link → Shows problem list
- [ ] "Dashboard" link → Shows dashboard
- [ ] Sign in button → Opens Clerk modal
- [ ] No 404 errors in console

---

## 2.3 Home/Welcome Section

**Test the Welcome Section:**

- [ ] Hero text visible: "Welcome to CodeVerse"
- [ ] Description text visible
- [ ] "Get Started" button visible and clickable
- [ ] Button click highlights (hover effect works)

**Expected:** Professional looking welcome page

---

## 2.4 Problems Page

**Action:** Click "Problems" in navbar

**Expected:**
- [ ] Page loads without errors
- [ ] Problem cards display in grid
- [ ] Each card shows:
  - Problem title
  - Difficulty badge (Easy/Medium/Hard)
  - Description preview
- [ ] Can see at least 10 problems
- [ ] Cards are clickable
- [ ] No layout breaks

---

## 2.5 Sign In Flow

**Action:** Click "Sign In" button

**Expected:**
- [ ] Clerk authentication modal appears
- [ ] Modal has input field for email/username
- [ ] "Sign Up" option visible
- [ ] Modal closes when clicking outside (optional)

**Test Sign In:**
- [ ] Enter email
- [ ] Enter password (or sign up)
- [ ] Click Submit

**After Sign In:**
- [ ] Redirects to dashboard
- [ ] Profile picture/name appears in navbar
- [ ] "Sign Out" option visible instead of "Sign In"
- [ ] No authentication errors in console

### ✅ Check DevTools Network Tab:
```
Should see requests to:
- /api/sessions/my-recent   → 200 OK
- /api/sessions/active      → 200 OK
```

---

## 2.6 Dashboard Page

**After signing in, verify dashboard:**

- [ ] Welcome message with user's name displayed
- [ ] Stats cards visible (4 cards):
   - Total Sessions
   - (Check if other stats show)
- [ ] "Create Session" button visible
- [ ] Recent sessions section (empty or with data)
- [ ] Problems section showing problems

---

# 🔌 PART 3: BACKEND API TESTING (10 minutes)

## 3.1 Health Check Endpoint

**In a new terminal (or Postman):**

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "msg": "api is up and running"
}
```

✅ **Status Code:** 200 OK

---

## 3.2 Test Protected Routes (Require Authentication)

**Note:** These should return 401 (unauthorized) without auth token - this is CORRECT

```bash
# Test: Get Active Sessions
curl http://localhost:3000/api/sessions/active

# Expected: 401 Unauthorized
# Response: {"code":"MISSING_AUTH_HEADER","message":"Unauthorized"}
```

✅ **This is CORRECT behavior** - it means authentication is working

---

## 3.3 CORS Check

**Test CORS headers in browser DevTools:**

1. Open DevTools (F12)
2. Go to Network tab
3. Make a request from frontend

**Look for these headers in response:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

✅ **If present:** CORS is properly configured

---

# 🔄 PART 4: INTEGRATION TESTING (10 minutes)

## 4.1 Create Coding Session

**Action:** 
1. Sign in to http://localhost:5173
2. Click "Create Session" button
3. Select a problem from dropdown
4. Click "Create"

**Expected:**
- [ ] Form appears with problem dropdown
- [ ] Can select a problem
- [ ] Submit button enabled
- [ ] Loading spinner appears briefly
- [ ] Redirects to session page
- [ ] Session ID visible on page
- [ ] No console errors

### ✅ Check Network Tab:
```
POST /api/sessions → 201 Created
Response includes: session ID, problem, status
```

---

## 4.2 Code Editor Test

**On the session page:**

**Test 1: Editor Loads**
- [ ] Code editor appears with white/dark background
- [ ] Starter code is populated
- [ ] Cursor can type in editor
- [ ] No errors in console

**Test 2: Language Selection**
- [ ] Language dropdown has multiple options
  - [ ] JavaScript
  - [ ] Python
  - [ ] Java
  - [ ] C++
  - [ ] Others
- [ ] Can change language
- [ ] Starter code updates for each language
- [ ] No errors when switching

**Test 3: Code Execution**
- [ ] Type simple code:
  ```javascript
  console.log("Hello World");
  ```
- [ ] Click "Run Code" button
- [ ] Output appears below editor:
  ```
  Hello World
  ```
- [ ] No errors in console

### ❌ If Code Execution Fails:
```
Problem: "Cannot execute code" error
Solution:
  1. Check if Piston API is accessible
  2. Verify no API key issues
  3. Check backend logs for errors

Problem: Output doesn't appear
Solution:
  1. Check browser console for fetch errors
  2. Verify API response in Network tab
  3. Check backend is receiving request
```

---

## 4.3 Session Page Features

**Verify all components on session page:**

- [ ] Problem title visible
- [ ] Problem description shows
- [ ] Difficulty badge visible
- [ ] Code editor with syntax highlighting
- [ ] Output panel at bottom
- [ ] Run code button works
- [ ] Language selector works
- [ ] No layout breaks

---

## 4.4 Refresh Page Test

**Action:** 
1. In session page, refresh browser (F5)

**Expected:**
- [ ] Page reloads without errors
- [ ] Session data still visible
- [ ] No authentication errors
- [ ] Editor state restored (or reset to starter code)
- [ ] User still logged in

---

# ⚠️ PART 5: ERROR HANDLING (5 minutes)

## 5.1 Network Error Handling

**Action:** Temporarily stop backend
1. Go to backend terminal
2. Press Ctrl+C
3. Wait 5 seconds
4. Try to run code in frontend

**Expected:**
- [ ] Error message displayed to user
- [ ] Not a blank white screen
- [ ] Helpful error message (e.g., "Network error")
- [ ] User can try again

---

## 5.2 Invalid Input Handling

**Action:** Try invalid operations

**Test 1: Empty Code Execution**
- [ ] Leave code editor empty
- [ ] Click Run Code
- [ ] Should show error or message

**Test 2: Invalid Code**
- [ ] Type syntax error:
  ```javascript
  console.log("missing semicolon)
  ```
- [ ] Click Run Code
- [ ] Should show error message from Piston

**Expected:**
- [ ] User-friendly error message
- [ ] Clear what went wrong
- [ ] Not a 500 server error crash

---

## 5.3 Session Join Test (Multiple Users)

**If you want to test joining sessions:**

1. Create session in Browser A (User A)
2. Open incognito/new browser and join session (User B)
3. Verify both see same session info

---

# ✅ CHECKLIST - FINAL VERIFICATION

Print this out and check off as you complete:

## Frontend Checks
- [ ] Page loads without errors
- [ ] All navigation works
- [ ] Sign in/out works
- [ ] Dashboard displays correctly
- [ ] Problem list loads
- [ ] Responsive design (works on mobile view)
- [ ] No console errors (F12 console)
- [ ] Page refresh doesn't break anything

## Backend Checks
- [ ] Server starts without errors
- [ ] Health endpoint responds (200)
- [ ] Database connected
- [ ] No console errors in backend terminal
- [ ] Response times acceptable (< 500ms)
- [ ] Error responses return proper codes

## Integration Checks
- [ ] Frontend connects to backend
- [ ] CORS headers correct
- [ ] Authentication flows end-to-end
- [ ] Session creation works
- [ ] Code execution works
- [ ] Data persists on refresh

## Error Handling Checks
- [ ] Network errors handled gracefully
- [ ] Invalid input shows error message
- [ ] Backend down doesn't crash frontend
- [ ] 404s return proper error pages
- [ ] No unhandled promise rejections

## Browser Console Checks
- [ ] No red errors
- [ ] No CORS warnings
- [ ] No "Cannot find module" errors
- [ ] No authentication-related errors

---

# 🚀 DEPLOYMENT READINESS

**After completing ALL tests above:**

## If ALL tests passed ✅
- You are **99% ready to deploy**
- Follow deployment guide in DEPLOYMENT_CONFIG.md
- Deploy with confidence

## If ANY test failed ❌
- [ ] Document the issue
- [ ] Check error message carefully
- [ ] Look in browser console (F12) for details
- [ ] Check backend terminal for logs
- [ ] Fix the issue before deploying

### Common Fixes:

**For Frontend Issues:**
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

**For Backend Issues:**
```bash
# Check MongoDB connection
# Update .env with correct DB_URL
# Restart server
npm start
```

**For CORS Issues:**
```bash
# Verify frontend URL matches in backend
# Check backend/src/server.js line 24
# Update CLIENT_URL in backend/.env
```

---

# 📊 TEST RESULTS TEMPLATE

Copy and fill this out after testing:

```
DATE: ___________
TESTER: ___________
ENVIRONMENT: localhost (5173 frontend, 3000 backend)

PART 1 (Setup): ✅ PASS / ❌ FAIL
PART 2 (Frontend): ✅ PASS / ❌ FAIL
PART 3 (Backend): ✅ PASS / ❌ FAIL
PART 4 (Integration): ✅ PASS / ❌ FAIL
PART 5 (Error Handling): ✅ PASS / ❌ FAIL

OVERALL: ✅ READY TO DEPLOY / ⚠️ NEEDS FIXES

Issues Found (if any):
1. ____________________________________
2. ____________________________________
3. ____________________________________

Fixes Applied:
1. ____________________________________
2. ____________________________________
3. ____________________________________

Final Status: ✅ APPROVED FOR DEPLOYMENT
```

---

# 🎯 NEXT STEPS AFTER TESTING

### If Ready to Deploy:
1. [ ] Save test results
2. [ ] Review DEPLOYMENT_CONFIG.md
3. [ ] Choose deployment platform (Railway recommended)
4. [ ] Follow platform-specific steps
5. [ ] Deploy to production
6. [ ] Test production URL (same tests as above)
7. [ ] Monitor for 24 hours for errors

### If Issues Found:
1. [ ] Fix issues locally
2. [ ] Re-run failed tests
3. [ ] Verify fix works
4. [ ] Continue to deployment

---

# 💡 QUICK REFERENCE - Common Issues & Fixes

| Problem | Symptom | Fix |
|---------|---------|-----|
| MongoDB not connected | "bad auth : authentication failed" | Update DB_URL in .env |
| Frontend can't reach backend | CORS errors in console | Check CORS config in server.js |
| Code execution fails | "Network request failed" | Verify Piston API keys in env |
| Sign in doesn't work | Blank Clerk modal | Verify Clerk keys in .env |
| Port already in use | "EADDRINUSE: port 3000" | Kill process on port 3000 |
| Blank screen on load | White page, no content | Clear cache, hard refresh (Ctrl+Shift+R) |

---

**Start testing now! Report back when complete.** ✅  
**Time to test: ~40 minutes**  
**Critical for deployment success!**
