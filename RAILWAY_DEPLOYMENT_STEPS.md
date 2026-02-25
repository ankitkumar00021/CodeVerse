# Railway Deployment - Step by Step

## Prerequisites
- ✅ GitHub account with code pushed
- ✅ Railway account (just created)
- ⏳ Clerk production keys (get from dashboard)
- ⏳ This credential: Your GitHub repo URL

## Deployment Steps

### 1. Create New Project in Railway (Do this now)
- Go to **https://railway.app/dashboard**
- Click **+ Create New** → **Project**
- Click **Deploy from GitHub repo**
- Select your **CodeVerse** repository
- Click **Deploy Now**
- Railway will automatically detect it's a monorepo and ask about services
- Select **Add Services** and add both backend and frontend

### 2. Configure Backend Service
Railway will create services automatically. For the **backend** service:

**Environment Variables to Set:**
```
PORT=3000
NODE_ENV=production
DB_URL=mongodb+srv://ak0196274_db_user:8s9qTOoyqMmvZAS3@cluster0.inpyfps.mongodb.net/?appName=Cluster0
STREAM_API_KEY=4mxsbzmhcv2c
STREAM_API_SECRET=xz38rdh7u5tqk5zn8x5gubvpt8khf7c7s23p3e578tneq7tvu8h5m7nerf853pct
CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PRODUCTION_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_CLERK_PRODUCTION_SECRET_HERE
CLIENT_URL=${{ RAILWAY_DOMAIN }}
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

**How to Set Them in Railway:**
1. Go to Backend Service → **Variables**
2. Paste each line into the variables tab
3. Go back and look at the **Domain** section - Railway assigns you a domain like `codeverse-backend.up.railway.app`
4. Copy this domain for frontend setup

### 3. Configure Frontend Service
For the **frontend** service:

**Environment Variables to Set:**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PRODUCTION_KEY_HERE
VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api
VITE_STREAM_API_KEY=4mxsbzmhcv2c
```

Replace `YOUR_BACKEND_DOMAIN` with the domain you got from step 2.

### 4. Review and Deploy
- Railway will automatically deploy on git push
- Wait for both services to show ✅ **Success**
- Check the **Deployments** tab to see build logs

### 5. Get Your Frontend URL
- Go to Frontend Service → **Domain**
- Click the domain (example: `codeverse-frontend.up.railway.app`)
- Your app is LIVE! 🎉

## Troubleshooting During Deployment

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs in Railway. Usually missing env vars. |
| 502 Bad Gateway | Backend not running. Check backend logs in Railway. |
| MongoDB connection error | DB_URL is invalid. Verify credentials in MongoDB Atlas. |
| Clerk authentication fails | Using test keys instead of production keys. Replace with pk_live_ keys. |
| Frontend shows "Cannot connect to API" | VITE_API_URL is wrong. Should be your Railway backend domain. |

## Quick Verification (After Deployment)
1. Open your frontend URL
2. Sign in with a test account (Clerk will let you sign in)
3. Create a new session
4. You should see the code editor and output panel
5. No errors in browser console (F12)

**You're Live! 🚀**
