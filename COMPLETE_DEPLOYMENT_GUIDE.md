# 🚀 CodeVerse Complete Deployment Guide (Scratch to Production)

**Date:** February 25, 2026  
**Duration:** 2-3 hours total  
**Recommended Platform:** Railway (simplest for MERN stack)

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Choose Your Platform](#choose-your-platform)
3. [Prepare Code for Deployment](#prepare-code-for-deployment)
4. [Platform-Specific Deployment](#platform-specific-deployment)
5. [Post-Deployment Testing](#post-deployment-testing)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

# ✅ PREREQUISITES

Before deploying, ensure you have:

## Required Accounts (Create if you don't have)

- [ ] **MongoDB Atlas** - Database
  - Sign up: https://www.mongodb.com/cloud/atlas
  - Create a cluster (free tier available)
  - Create database user with credentials
  - Get connection string

- [ ] **Clerk** - Authentication  
  - Sign up: https://clerk.com
  - Create project
  - Get production API keys (pk_live_*, sk_live_*)

- [ ] **Stream.io** - Video & Chat
  - Sign up: https://getstream.io
  - Get API key and secret
  - Keep these handy

- [ ] **Deployment Platform** (Choose ONE):
  - [ ] **Railway** (RECOMMENDED) - https://railway.app
  - [ ] Vercel - https://vercel.app (frontend only)
  - [ ] Heroku - https://heroku.com
  - [ ] Render - https://render.com

- [ ] **GitHub Account** (for deployment)
  - Sign up: https://github.com
  - Push your code to GitHub

---

## Required Credentials Checklist

Before starting, have these ready:

```
MongoDB:
  ✅ DB_URL = mongodb+srv://username:password@cluster...
  ✅ Cluster name
  ✅ IP Whitelist configured

Clerk (Production):
  ✅ CLERK_PUBLISHABLE_KEY = pk_live_...
  ✅ CLERK_SECRET_KEY = sk_live_...

Stream.io:
  ✅ STREAM_API_KEY = ...
  ✅ STREAM_API_SECRET = ...

Domain (Optional but recommended):
  ✅ Custom domain (e.g., codeverse.app)
```

---

# 🎯 CHOOSE YOUR PLATFORM

## Option 1: RAILWAY (⭐ RECOMMENDED - Easiest)

**Pros:**
- ✅ Full MERN stack support
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Auto-deploys on push
- ✅ Built-in database support
- ✅ Simple environment config

**Cons:**
- Free tier has limits
- Slightly more expensive than Heroku at scale

**Best for:** MERN projects, automatic deployments

**Estimated Setup Time:** 30 minutes

---

## Option 2: VERCEL (Frontend) + RAILWAY (Backend)

**Pros:**
- ✅ Vercel optimized for React
- ✅ Best frontend performance
- ✅ Separate scaling for frontend/backend

**Cons:**
- More complex setup
- Two different platforms to manage

**Best for:** High-traffic frontend with separate backend

**Estimated Setup Time:** 45 minutes

---

## Option 3: HEROKU

**Pros:**
- ✅ Single platform for full stack
- ✅ Well-established, lots of docs
- ✅ Add-ons marketplace

**Cons:**
- Costly compared to Railway
- Slower free tier
- Free tier removed (paid only now)

**Best for:** Teams with Heroku expertise

**Estimated Setup Time:** 45 minutes

---

## ⭐ RECOMMENDED: RAILWAY

I'll provide detailed Railway instructions below. It's the easiest for MERN stacks.

---

# 📦 PREPARE CODE FOR DEPLOYMENT

## Step 1: Verify Code is Git-Ready

```bash
# Check git status
git status

# If not initialized
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

## Step 2: Verify .env Files Are NOT Committed

```bash
# Check .gitignore
cat .gitignore

# Must include:
*.env
.env.local
.env.*.local
node_modules/
```

**CRITICAL:** If .env files are in git history:
```bash
git rm --cached .env
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove sensitive .env files"
```

## Step 3: Push Code to GitHub

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/codeverse.git
git branch -M main
git push -u origin main
```

---

# 🚀 PLATFORM-SPECIFIC DEPLOYMENT

## RAILWAY DEPLOYMENT (Recommended)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login" → "Sign up with GitHub"
3. Authorize Railway
4. Create new project

### Step 2: Connect GitHub Repository

1. In Railway dashboard, click "New Project"
2. Click "Deploy from GitHub"
3. Select your repository
4. Authorize Railway to access GitHub
5. Select `codeverse` repository

### Step 3: Configure Railway Services

Railway should auto-detect both backend and frontend. If not:

**Backend Service:**
```
Service: Backend
Root Directory: backend/
Start Command: npm start
Port: 3000
```

**Frontend Service:**
```
Service: Frontend
Root Directory: frontend/
Build Command: npm run build
Port: 3000
Start Command: npm preview (for static serving)
```

### Step 4: Set Environment Variables

**In Railway Dashboard:**

1. Click on **Backend** service
2. Go to **Variables** tab
3. Add these variables (get values from your services):

```
PORT = 3000
NODE_ENV = production

# MongoDB
DB_URL = mongodb+srv://username:password@cluster.mongodb.net/codeverse?retryWrites=true&w=majority

# Clerk (Get from Clerk Dashboard - Production Keys!)
CLERK_PUBLISHABLE_KEY = pk_live_YOUR_KEY_HERE
CLERK_SECRET_KEY = sk_live_YOUR_KEY_HERE

# Stream.io
STREAM_API_KEY = your_stream_key
STREAM_API_SECRET = your_stream_secret

# Client URL (will be your Railway frontend domain)
CLIENT_URL = https://your-railway-frontend-domain.up.railway.app
```

4. Click **Frontend** service
5. Go to **Variables** tab
6. Add these variables:

```
VITE_CLERK_PUBLISHABLE_KEY = pk_live_YOUR_KEY_HERE
VITE_API_URL = https://your-railway-backend-domain.up.railway.app/api
VITE_STREAM_API_KEY = your_stream_key
```

### Step 5: Deploy

1. Railway auto-deploys on push
2. Or manually trigger deploy in dashboard
3. Watch logs in **Deployments** tab
4. Wait for both services to show "Success" ✅

**Check deployment status:**
- Backend: Should show "Connected to MongoDB" in logs
- Frontend: Should show build completed successfully

### Step 6: Get Your Deployment URLs

After successful deploy:

1. Go to Backend service settings
2. Copy the public domain URL (e.g., `https://codeverse-backend.up.railway.app`)
3. Go to Frontend service settings
4. Copy the public domain URL (e.g., `https://codeverse-frontend.up.railway.app`)

---

## ALTERNATIVE: HEROKU DEPLOYMENT

### Step 1: Create Heroku Account

1. Go to https://www.heroku.com
2. Sign up
3. Install Heroku CLI: `npm install -g heroku`

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create App

```bash
# Navigate to project root
cd C:\ALL PROGRAM\MERN PROJECT(INTERN)\CodeVerse_Platform\CodeVerse

# Create Heroku app
heroku create codeverse-app

# Or use custom name
heroku create your-custom-app-name
```

### Step 4: Add Buildpacks

```bash
# For Node.js backend
heroku buildpacks:add heroku/nodejs

# For static frontend
heroku buildpacks:add heroku/static
```

### Step 5: Create Procfile

Create `Procfile` in project root:

```
web: npm start --prefix backend
release: npm run build --prefix frontend
```

### Step 6: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
heroku config:set DB_URL=mongodb+srv://user:pass@cluster...
heroku config:set CLERK_PUBLISHABLE_KEY=pk_live_...
heroku config:set CLERK_SECRET_KEY=sk_live_...
heroku config:set STREAM_API_KEY=...
heroku config:set STREAM_API_SECRET=...
heroku config:set VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
heroku config:set VITE_API_URL=https://your-app.herokuapp.com/api
heroku config:set VITE_STREAM_API_KEY=...
```

### Step 7: Deploy

```bash
git push heroku main
```

### Step 8: View Your App

```bash
heroku open
```

---

## ALTERNATIVE: VERCEL + RAILWAY

### Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select `codeverse` repository
5. Set Root Directory: `frontend`
6. Add environment variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_API_URL=https://your-railway-backend.railway.app/api
   VITE_STREAM_API_KEY=...
   ```
7. Click Deploy

### Deploy Backend to Railway

Follow Railway deployment steps above (skip frontend)

---

# ✅ POST-DEPLOYMENT TESTING

## Step 1: Test Production URLs

```bash
# Test backend health
curl https://your-backend-domain/health

# Expected response:
# {"msg":"api is up and running"}
```

## Step 2: Test in Browser

1. Visit your frontend URL: `https://your-frontend-domain`
2. Should load without errors
3. Check browser console (F12)
4. Should see no red errors

## Step 3: Manual Feature Testing

**In your deployment:**

- [ ] Sign in with Clerk
- [ ] Create a coding session
- [ ] Run some code
- [ ] Check output
- [ ] Sign out
- [ ] All works without errors?

## Step 4: Check Network Tab (F12)

- [ ] API calls to `/api/...` are successful (200/201)
- [ ] No CORS errors
- [ ] No 401 Unauthorized errors (unless expected)

## Step 5: Monitor Logs

**For Railway:**
```
Dashboard → Your Project → Live Logs
Watch for errors in real-time
```

**For Heroku:**
```bash
heroku logs --tail
```

---

# 🔧 CONFIGURE CUSTOM DOMAIN (Optional)

### Add Custom Domain to Railway

1. Go to your deployed service
2. Click "Settings"
3. Scroll to "Domains"
4. Click "Add Domain"
5. Enter your domain (e.g., codeverse.app)
6. Follow DNS configuration steps
7. Wait for SSL certificate (5-10 minutes)

### Add Custom Domain to Heroku

```bash
heroku domains:add www.codeverse.app
heroku domains:add codeverse.app
```

Then update your DNS records with your domain registrar.

---

# 📊 MONITORING & MAINTENANCE

## Set Up Error Tracking (Sentry)

1. Go to https://sentry.io
2. Sign up
3. Create project
4. Add to backend `.env`:
   ```
   SENTRY_DSN=...
   ```
5. Installations will help you integrate

## Monitor Database

**MongoDB Atlas:**
1. Go to your cluster
2. Click "Monitoring"
3. Watch for slow queries
4. Set up alerts for high CPU/memory

## Monitor Performance

**For Railway:**
- Dashboard shows CPU/Memory usage
- Logs show request times
- Set up email alerts

## Backup Database

**MongoDB Atlas:**
1. Click "Backup" on your cluster
2. Enable daily backups
3. Set retention period to 7+ days

---

# ⚠️ TROUBLESHOOTING DEPLOYMENT

## Problem: MongoDB Connection Failed

**Solution:**
1. Check connection string format
2. Verify username/password in URI
3. Check IP whitelist in MongoDB Atlas
4. Test connection string locally
5. Add your deployment platform IP to Atlas IP whitelist

## Problem: CORS Errors in Production

**Solution:**
1. Update `CLIENT_URL` environment variable
2. Must match exact domain (https:// required)
3. Restart backend after changing

## Problem: Clerk Authentication Failed

**Solution:**
1. Verify production keys are used (pk_live_, sk_live_)
2. Add deployment domain to Clerk allowed origins:
   - Clerk Dashboard → Settings → Allowed Origins
   - Add your frontend URL
3. Restart servers

## Problem: 404 Frontend Not Found

**Solution:**
1. Verify build command ran successfully
2. Check `dist/` folder exists and has index.html
3. Backend should serve static files in production
4. Check `backend/src/server.js` serves frontend files

## Problem: Code Execution Not Working

**Solution:**
1. Verify Piston API is accessible
2. Check Stream.io keys are correct
3. Monitor backend logs for errors
4. Test with simple code first

---

# 📋 FINAL CHECKLIST

Before going live, verify:

## Environment Configuration
- [ ] MongoDB connection string is valid
- [ ] All Clerk keys are production keys
- [ ] Stream.io API key and secret set
- [ ] CLIENT_URL matches production domain
- [ ] All env vars are in platform dashboard

## Code Quality
- [ ] Frontend builds successfully
- [ ] No console errors in production
- [ ] Backend starts without errors
- [ ] Database connects on startup

## Testing
- [ ] Tested in local environment first
- [ ] Manual feature testing completed
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Authentication works
- [ ] Code execution works

## Deployment
- [ ] Code pushed to GitHub
- [ ] .env files NOT in git
- [ ] Deployment logs show success
- [ ] Public URLs are accessible
- [ ] Both frontend and backend responding

## Post-Deployment
- [ ] Visited frontend URL in browser
- [ ] Tested sign in
- [ ] Tested code execution
- [ ] Checked browser console (no errors)
- [ ] Monitored logs for errors
- [ ] Database backups enabled

---

# 🎉 SUCCESS INDICATORS

Your deployment is working correctly if:

✅ Frontend loads without 404 errors  
✅ Sign in with Clerk works  
✅ Can create sessions  
✅ Code editor loads without errors  
✅ Code execution produces output  
✅ Browser console shows no red errors  
✅ API calls show 200 status codes  
✅ Database queries return data  
✅ No timeout errors  
✅ Pages load in < 3 seconds  

---

# 📞 QUICK REFERENCE - Deployment Commands

```bash
# Railway
railway login
railway init
railway up

# Heroku
heroku login
heroku create app-name
git push heroku main
heroku logs --tail

# Vercel
vercel
vercel --prod

# Check environment
echo $DB_URL
echo $CLERK_SECRET_KEY
echo $NODE_ENV
```

---

# 🔐 SECURITY CHECKLIST

- [ ] All secrets are in environment variables (not code)
- [ ] .env files are in .gitignore
- [ ] HTTPS is enabled (auto with Railway/Vercel/Heroku)
- [ ] Database user has restricted permissions
- [ ] API keys are rotated regularly
- [ ] CORS only allows your domain
- [ ] Rate limiting configured (if available)
- [ ] SQL injection prevention (Mongoose handles this)
- [ ] XSS protection (React escapes by default)

---

# 📈 SCALING CONSIDERATIONS

### If you need to scale later:

1. **Horizontal Scaling:** Add more backend instances
2. **Database Optimization:** Create indexes, archive old data
3. **Frontend Optimization:** Implement lazy loading, code splitting
4. **CDN:** Use Cloudflare or similar for static assets
5. **Caching:** Implement Redis for session storage

For now, single instance is sufficient for small user base.

---

# ✨ DEPLOYMENT COMPLETE!

Once all steps are done:

```
🎉 Your app is live!
✅ Database connected
✅ Authentication working
✅ Backend responding
✅ Frontend loaded
✅ Users can sign in
✅ Sessions can be created
✅ Code can be executed
```

**Share your live URL:** https://your-deployed-domain.app

---

**Need help?**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Heroku Docs: https://devcenter.heroku.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Clerk Docs: https://clerk.com/docs

**Question? Error?** Check the troubleshooting section above or review logs in your deployment platform dashboard.

---

**Good luck with your deployment! 🚀**
