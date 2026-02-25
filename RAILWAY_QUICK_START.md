# 🚂 Railway Deployment - Quick Visual Guide

**Estimated Time:** 30 minutes  
**Difficulty:** Easy ⭐⭐☆☆☆  
**Best For:** MERN projects

---

## 🎯 DEPLOYMENT FLOW

```
Step 1: Prepare Code
   ↓
Step 2: Push to GitHub
   ↓
Step 3: Create Railway Account
   ↓
Step 4: Connect GitHub Repo
   ↓
Step 5: Configure Environment Variables
   ↓
Step 6: Deploy (Auto or Manual)
   ↓
Step 7: Test Live URL
```

---

## ✅ STEP-BY-STEP INSTRUCTIONS

### STEP 1️⃣: Prepare Your Code (5 min)

**Open Terminal:**

```bash
# Navigate to project root
cd C:\ALL PROGRAM\MERN PROJECT(INTERN)\CodeVerse_Platform\CodeVerse

# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Check .gitignore has .env files
cat .gitignore
# Must contain: *.env, .env.local

# If .env is in git history, remove it
git rm --cached .env
git rm --cached backend/.env  
git rm --cached frontend/.env
git commit -m "Remove .env files"
```

---

### STEP 2️⃣: Push Code to GitHub (3 min)

**If you don't have GitHub repo yet:**

```bash
# Initialize git
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/codeverse.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you already have GitHub:**

```bash
# Just push
git push origin main
```

---

### STEP 3️⃣: Create Railway Account (2 min)

1. Go to https://railway.app
2. Click "Login" → "Sign up with GitHub"
3. Authorize Railway with GitHub
4. Dashboard opens
5. ✅ Account ready!

---

### STEP 4️⃣: Create New Project (5 min)

**In Railway Dashboard:**

1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Click "Configure GitHub App"
4. Select your GitHub account
5. Select `codeverse` repository
6. Click "Install"
7. Back in Railway, select the repo from dropdown
8. Railway auto-detects backend & frontend ✅

---

### STEP 5️⃣: Set Environment Variables (10 min)

**For Backend Service:**

1. In Railway, click **Backend** service
2. Click **Variables** tab
3. Add these variables one by one:

```
KEY                           VALUE
────────────────────────────────────────────────
PORT                          3000
NODE_ENV                       production
DB_URL                        mongodb+srv://username:password@cluster.mongodb.net/codeverse
CLERK_PUBLISHABLE_KEY         pk_live_xxxxx (from Clerk)
CLERK_SECRET_KEY              sk_live_xxxxx (from Clerk)
STREAM_API_KEY                xxxxx (from Stream.io)
STREAM_API_SECRET             xxxxx (from Stream.io)
CLIENT_URL                    https://your-frontend-url.up.railway.app
```

⚠️ **Get values from your services:**
- MongoDB: https://cloud.mongodb.com → Connect → Copy string
- Clerk: https://dashboard.clerk.com → API Keys → Copy prod keys
- Stream.io: https://getstream.io → Keys

**For Frontend Service:**

1. Click **Frontend** service
2. Click **Variables** tab
3. Add these variables:

```
KEY                                VALUE
───────────────────────────────────────────────────────
VITE_CLERK_PUBLISHABLE_KEY         pk_live_xxxxx
VITE_STREAM_API_KEY                xxxxx
VITE_API_URL                       https://your-backend-url.up.railway.app/api
```

---

### STEP 6️⃣: Deploy (5 min)

**Option A: Auto Deploy (Recommended)**

Railway auto-deploys when you push to GitHub:

```bash
# Make a change and push
git add .
git commit -m "Update config"
git push origin main

# Railway automatically deploys! Watch logs...
```

**Option B: Manual Deploy**

1. In Railway dashboard
2. Click Backend → Deployments
3. Click "Deploy" button
4. Wait for ✅ Success
5. Click Frontend → Deployments
6. Click "Deploy" button
7. Wait for ✅ Success

**Watch the logs:**
```
Expected for Backend:
✅ npm install completed
✅ node src/server.js started
✅ Connected to MongoDB
✅ Server running on port 3000

Expected for Frontend:
✅ npm install completed
✅ npm run build completed
✅ Output in dist/
```

---

### STEP 7️⃣: Test Your Deployment (5 min)

**Get Your URLs:**

1. Backend service → Settings → Domain
   - Copy: `https://xxx.up.railway.app`
   
2. Frontend service → Settings → Domain
   - Copy: `https://xxx.up.railway.app`

**Test Backend Health:**

```bash
curl https://YOUR-BACKEND-DOMAIN/health
# Expected: {"msg":"api is up and running"}
```

**Test Frontend:**

1. Open frontend URL in browser
2. Check console (F12) for errors
3. Try to sign in
4. Try to create a session
5. Try to run code

---

## 🎛️ WHERE TO FIND THINGS IN RAILWAY

```
Dashboard
├── Your Project
    ├── Backend Service
    │   ├── Variables (← Set env vars here)
    │   ├── Settings (← Find domain here)
    │   └── Logs (← Watch deployment here)
    └── Frontend Service
        ├── Variables (← Set env vars here)
        ├── Settings (← Find domain here)
        └── Logs (← Watch deployment here)
```

---

## 🚨 COMMON ISSUES & FIXES

### ❌ "MongoDB Connection Failed"
```
✅ Fix:
1. Check DB_URL in Variables
2. Copy exact string from MongoDB Atlas
3. Verify format: mongodb+srv://user:pass@host/db
4. Redeploy
```

### ❌ "Clerk Authentication Failed"
```
✅ Fix:
1. Use PRODUCTION keys (pk_live_, sk_live_)
2. Not test keys (pk_test_)
3. Go to https://dashboard.clerk.com
4. Switch to Production environment
5. Copy correct keys
6. Update Variables
7. Redeploy
```

### ❌ "CORS Error in Browser"
```
✅ Fix:
1. Get your frontend URL from Railway
2. Set CLIENT_URL in backend Variables
3. Use exact URL: https://xxx.up.railway.app
4. Redeploy backend
```

### ❌ "404 - Frontend Not Found"
```
✅ Fix:
1. Check frontend build: npm run build succeeds
2. Verify dist/ folder has index.html
3. Check frontend logs for build errors
4. Redeploy frontend
```

### ❌ "Code Execution Not Working"
```
✅ Fix:
1. Check STREAM_API_KEY is set
2. Test Piston API is accessible
3. Check backend logs for errors
4. Verify Stream.io keys are correct
```

---

## ✅ VERIFICATION CHECKLIST

After deployment:

```
Backend Health:
  ☐ GET /health returns 200
  ☐ Logs show "Connected to MongoDB"
  ☐ No error messages in logs
  ☐ Service status shows "Running"

Frontend Load:
  ☐ Opens without 404
  ☐ No red errors in console (F12)
  ☐ Page layouts correctly
  ☐ Navigation works
  ☐ Clerk sign-in button visible

Feature Testing:
  ☐ Sign in works
  ☐ Can create session
  ☐ Code editor loads
  ☐ Can run code
  ☐ Output displays

Integration:
  ☐ No CORS errors in console
  ☐ API calls succeed (200 status)
  ☐ Data persists on refresh
  ☐ No undefined/null errors

Database:
  ☐ Can connect to MongoDB
  ☐ Sessions save and retrieve
  ☐ User data persists
  ☐ No connection timeouts
```

---

## 🎉 DEPLOYMENT SUCCESS!

When everything is working:

```
✅ Backend running on Railway
✅ Frontend running on Railway
✅ Database connected
✅ Authentication working
✅ Users can sign in
✅ Sessions create successfully
✅ Code executes properly
✅ No 404 or CORS errors

🎉 YOU'RE LIVE!
```

**Your app is now accessible at:**
- Frontend: `https://your-frontend.up.railway.app`
- Backend: `https://your-backend.up.railway.app`
- API: `https://your-backend.up.railway.app/api`

---

## 📊 MONITORING AFTER DEPLOYMENT

**In Railway Dashboard:**

1. **Logs Tab**
   - Watch for errors in real-time
   - Check request logs
   - Monitor startup messages

2. **Metrics Tab** 
   - CPU usage (should be < 50%)
   - Memory usage (should be < 256MB)
   - Network traffic

3. **Deployments Tab**
   - See deployment history
   - View each deployment status
   - Rollback if needed

---

## 🔄 UPDATING YOUR DEPLOYMENT

**When you make code changes:**

```bash
# Stage changes
git add .

# Commit
git commit -m "Update feature"

# Push to GitHub
git push origin main

# Railway auto-deploys! ✅
# Watch logs in Railway dashboard
```

**To manually redeploy:**

1. Railway dashboard
2. Service you want to redeploy
3. Deployments tab
4. Click "Deploy" button
5. Watch logs

---

## 🆘 GETTING HELP

**If something goes wrong:**

1. Check the logs in Railway dashboard
2. Read the error message carefully
3. Check this guide for common fixes
4. Verify all environment variables are set
5. Try redeploying
6. Check GitHub for recent changes

**Railway Docs:**
https://docs.railway.app

**Common Issues Guide:**
Check COMPLETE_DEPLOYMENT_GUIDE.md

---

## ⏱️ TIMELINE SUMMARY

- Step 1-2: Code & GitHub = 8 min
- Step 3-4: Railway Setup = 7 min  
- Step 5: Environment Variables = 10 min
- Step 6: Deploy = 5 min
- Step 7: Testing = 5 min

**TOTAL: ~35 minutes to live! 🚀**

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Monitor for 24 hours**
   - Watch logs for errors
   - Test features regularly
   - Check performance metrics

2. **Set up backups**
   - MongoDB Atlas backups
   - Code backups (GitHub has this)

3. **Add custom domain** (optional)
   - Buy domain from GoDaddy/Namecheap
   - Configure in Railway
   - Update Clerk allowed origins

4. **Enable monitoring** (optional)
   - Sentry for error tracking
   - DataDog for performance
   - Uptime monitoring

---

**You're ready to deploy! Follow these steps and you'll be live in 30 minutes.** 🚀

Need help? Review COMPLETE_DEPLOYMENT_GUIDE.md for more details.
