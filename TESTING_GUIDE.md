# CodeVerse Platform - Testing Guide

## Prerequisites

1. **Node.js** (v14+)
2. **MongoDB Atlas** account with valid credentials
3. **Clerk** account with API keys
4. **Stream.io** account with API keys
5. Both `.env` files configured in backend and frontend

---

## Step 1: Verify Environment Configuration

### Backend Environment Check

```bash
cd backend

# Verify all required variables are set
echo "Checking backend environment variables..."
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "DB_URL: $([[ ! -z $DB_URL ]] && echo 'Set' || echo 'Missing')"
echo "CLERK_SECRET_KEY: $([[ ! -z $CLERK_SECRET_KEY ]] && echo 'Set' || echo 'Missing')"
echo "STREAM_API_KEY: $([[ ! -z $STREAM_API_KEY ]] && echo 'Set' || echo 'Missing')"
```

### Frontend Environment Check

```bash
cd frontend

# Verify variables
echo "VITE_CLERK_PUBLISHABLE_KEY: $([[ ! -z $VITE_CLERK_PUBLISHABLE_KEY ]] && echo 'Set' || echo 'Missing')"
echo "VITE_API_URL: $VITE_API_URL"
echo "VITE_STREAM_API_KEY: $([[ ! -z $VITE_STREAM_API_KEY ]] && echo 'Set' || echo 'Missing')"
```

---

## Step 2: Install Dependencies

From the root directory:

```bash
# Install all dependencies
npm install --prefix backend
npm install --prefix frontend
```

---

## Step 3: Test Backend Server

### Start Backend in Development Mode

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connected to MongoDB: cluster0.mongodb.net
Server is running on port: 3000
```

### Test Health Endpoint

In another terminal:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "msg": "api is up and running"
}
```

### Test Protected Routes

```bash
# These should return 401 Unauthorized (expected without auth)
curl -X GET http://localhost:3000/api/sessions/active
curl -X GET http://localhost:3000/api/sessions/my-recent
```

Expected response:
```json
{
  "code": "MISSING_AUTH_HEADER",
  "message": "Unauthorized"
}
```

---

## Step 4: Test Frontend Build

```bash
cd frontend

# Run linting
npm run lint

# Build for production
npm run build

# Preview build
npm run preview
```

Expected output for build:
```
✓ built in XX.XXs
dist/index.html           0.XX kB │ gzip: 0.XX kB
```

---

## Step 5: Test Frontend in Development Mode

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

**Manual Testing:**

1. **Authentication:**
   - Click sign-in
   - Verify Clerk authentication modal appears
   - Sign up with test account
   - Verify redirect to dashboard

2. **Dashboard Features:**
   - ✅ Recent sessions display
   - ✅ Stats cards show data
   - ✅ "Create Session" button works
   - ✅ Problems tab loads

3. **Session Creation:**
   - Click "Create Session"
   - Select a coding problem
   - Click "Create"
   - Verify session is created and shows session ID

4. **Code Editor:**
   - Verify Monaco editor loads
   - Try typing code
   - Select different programming languages
   - Click "Run Code"
   - Verify output

5. **Navigation:**
   - Test all page transitions
   - Verify routing works
   - Test "Logout" functionality

---

## Step 6: Integration Test (Frontend + Backend)

#### Test 1: Create Session
```bash
# From backend test script or Postman
POST http://localhost:3000/api/sessions
Headers:
  Authorization: Bearer <CLERK_SESSION_TOKEN>
  Content-Type: application/json

Body:
{
  "problem": "Two Sum",
  "difficulty": "Easy"
}

Expected: 201 Created with session object
```

#### Test 2: Get Active Sessions
```bash
GET http://localhost:3000/api/sessions/active
Headers:
  Authorization: Bearer <CLERK_SESSION_TOKEN>

Expected: 200 OK with array of sessions
```

#### Test 3: Browser Integration
1. Open http://localhost:5173 in browser
2. Sign in with Clerk
3. Click "Create Session"
4. Open session in new tab
5. Verify both users can see session
6. Test real-time code sync (if implemented)
7. Test chat functionality

---

## Step 7: Full Stack Test

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: Testing
1. Open http://localhost:5173 in two browser windows
2. Sign in with different accounts
3. Create session from account 1
4. Join session from account 2
5. Test collaborative features

---

## Step 8: Production Build Test

```bash
# Build both
npm run build

# Run production build
cd backend
NODE_ENV=production npm start

# In another terminal, serve frontend
cd frontend
npx serve -s dist -l 3000
```

---

## Automated Test Script

Create `test-all.js` in project root:

```javascript
const http = require('http');

const tests = [
  { name: 'Health Check', method: 'GET', path: '/health', port: 3000 },
  { name: 'Active Sessions', method: 'GET', path: '/api/sessions/active', port: 3000 },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const req = http.request({
    hostname: 'localhost',
    port: test.port,
    path: test.path,
    method: test.method,
  }, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 500) {
      console.log(`✅ ${test.name}: ${res.statusCode}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}: ${res.statusCode}`);
      failed++;
    }
  });

  req.on('error', (error) => {
    console.log(`❌ ${test.name}: ${error.message}`);
    failed++;
  });

  req.end();
});

setTimeout(() => {
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}, 1000);
```

---

## Troubleshooting

### MongoDB Connection Error
**Error:** `bad auth : authentication failed`

**Solution:**
1. Verify credentials in MongoDB Atlas
2. Check IP whitelist includes your IP
3. Update DB_URL in `.env`
4. Test connection with MongoDB Compass

### Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### CORS Error in Browser
**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
1. Verify `CLIENT_URL` in backend `.env`
2. Update CORS config in [backend/src/server.js](../backend/src/server.js)
3. Ensure frontend is on allowed domain

### Clerk Authentication Failed
**Error:** `Clerk Publishable Key is missing`

**Solution:**
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` in frontend `.env`
2. Get key from Clerk Dashboard
3. Ensure key matches current environment

---

## Performance Checklist

- [ ] Frontend build time < 30 seconds
- [ ] Backend health check responds < 100ms
- [ ] Database queries complete < 500ms
- [ ] Frontend bundle size analyzed
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Image assets optimized
- [ ] API responses gzipped

---

## Security Checklist

- [ ] All secrets in `.env` (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured for production domain
- [ ] Authentication required for protected routes
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive data
- [ ] HTTPS enforced in production
- [ ] Rate limiting implemented if needed

---

## Deployment Verification

After deploying to production:

```bash
# Test production health
curl https://yourdomain.com/health

# Test API endpoint
curl -X GET https://yourdomain.com/api/sessions/active

# Check certificate
curl -I https://yourdomain.com

# Performance test
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
```

---

**Once all tests pass, your deployment is ready!** 🎉
