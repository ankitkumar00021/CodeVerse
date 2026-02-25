# CodeVerse Platform - Deployment Configuration Guide

## Environment Setup for Different Platforms

---

## 1. RAILWAY (Recommended for MERN Stack)

### Create `.railways.toml` in project root:

```toml
[build]
builder = "nixpacks"
buildCommand = "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend"

[[services]]
name = "codeverse-backend"
runtime = "node"
startCommand = "npm start --prefix backend"
port = 3000

[[services]]
name = "codeverse-frontend"
runtime = "static"
buildCommand = "npm run build --prefix frontend"
staticDir = "frontend/dist"
```

### Environment Variables to Set:
```
# Backend
PORT=3000
NODE_ENV=production
DB_URL=<your_mongodb_uri>
CLIENT_URL=https://yourdomain.com
CLERK_PUBLISHABLE_KEY=pk_live_<your_key>
CLERK_SECRET_KEY=sk_live_<your_key>
STREAM_API_KEY=<your_key>
STREAM_API_SECRET=<your_secret>
INNGEST_EVENT_KEY=<your_key>
INNGEST_SIGNING_KEY=<your_key>

# Frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_live_<your_key>
VITE_API_URL=https://yourdomain.com/api
VITE_STREAM_API_KEY=<your_key>
```

---

## 2. VERCEL (Frontend) + RAILWAY (Backend)

### Frontend Deployment (Vercel):

1. Connect GitHub repository to Vercel
2. Select `frontend/` as root directory
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_API_URL=https://api.yourdomain.com/api
VITE_STREAM_API_KEY=...
```

6. Deploy!

### Backend Deployment (Railway):

1. Create new Railway project
2. Connect GitHub repo
3. Select main branch
4. Working directory: `backend`
5. Start command: `npm start`
6. Environment Variables: (as listed above)
7. Add MongoDB plugin and configure

---

## 3. HEROKU (Full Stack)

### Procfile (in root):
```
web: npm start --prefix backend
release: npm run build --prefix frontend
```

### Deploy:
```bash
# Login
heroku login

# Create app
heroku create codeverse-app

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CLERK_SECRET_KEY=sk_live_...
# ... set all other variables

# Deploy
git push heroku main

# Serve frontend from backend
# Update backend/src/server.js to serve dist folder
```

---

## 4. RENDER.COM

### Create `render.yaml`:

```yaml
services:
  - type: web
    name: codeverse-backend
    env: node
    plan: starter
    buildCommand: npm install --prefix backend
    startCommand: npm start --prefix backend
    envVars:
      - key: PORT
        value: 3000
      - key: NODE_ENV
        value: production
      - key: DB_URL
        fromDatabase:
          name: mongodb
          property: connectionString

  - type: web
    name: codeverse-frontend
    staticSite:
      rootDir: frontend/dist
      buildCommand: npm install --prefix frontend && npm run build --prefix frontend
```

Deploy:
```bash
git push
# Render auto-deploys from GitHub
```

---

## 5. AWS / GCP / AZURE

### General Steps:

1. **Create Compute Instance** (EC2, App Engine, App Service)
2. **Setup Node.js Environment**
3. **Configure Database** (MongoDB Atlas or cloud MongoDB)
4. **Setup Environment Variables**
5. **Install Dependencies**
```bash
npm install --prefix backend
npm install --prefix frontend
npm run build --prefix frontend
```

6. **Start Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

7. **Serve Frontend:**
   - Option A: Use backend to serve static files (production config in server.js)
   - Option B: Deploy to CDN (CloudFront, GCS, etc.)

8. **Setup Domain & SSL**:
   - Configure DNS
   - Setup Let's Encrypt SSL certificate
   - Configure reverse proxy (nginx)

---

## Pre-Deployment Checklist

### Environment Variables
- [ ] All variables have production values
- [ ] No test/development keys
- [ ] Database credentials are secure
- [ ] API keys are restricted by domain

### Code Quality
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No console.error messages
- [ ] No hardcoded URLs (use env vars)

### Database
- [ ] MongoDB connection tested
- [ ] Collections created
- [ ] Indexes created for performance
- [ ] Backup strategy in place
- [ ] IP whitelist configured

### Security
- [ ] HTTPS enabled
- [ ] CORS restricted to production domain
- [ ] Authentication required for protected routes
- [ ] Sensitive data not logged
- [ ] Rate limiting configured
- [ ] Input validation in place

### Performance
- [ ] Frontend build optimized
- [ ] Images compressed
- [ ] Database queries indexed
- [ ] Caching headers configured
- [ ] CDN setup (optional)

### Monitoring
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Database monitoring enabled
- [ ] Logs centralized
- [ ] Alerts configured

---

## Post-Deployment Verification

```bash
# Test production health
curl https://yourdomain.com/health

# Test API
curl https://yourdomain.com/api/sessions/active

# Check response headers
curl -I https://yourdomain.com

# Monitor logs
heroku logs --tail  # for Heroku
railway logs        # for Railway
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer
- Run multiple backend instances
- Use session store (Redis) instead of in-memory
- Configure auto-scaling policies

### Database Optimization
- Create database indexes
- Monitor query performance
- Archive old sessions
- Use connection pooling

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Code-split large bundles

### Real-time Features
- Use Stream.io for scalability
- Configure message queue (Inngest)
- Implement WebSocket connection pooling
- Monitor concurrent connections

---

## Troubleshooting Deployment

### Application Won't Start
1. Check environment variables
2. Verify database connection
3. Review startup logs
4. Check port binding

### Database Connection Failed
1. Verify connection string
2. Check IP whitelist
3. Verify credentials
4. Test with MongoDB Compass

### CORS Errors in Production
1. Update `CLIENT_URL` environment variable
2. Verify domain matches exactly
3. Check browser console for actual URL

### Frontend Not Loading
1. Verify dist folder is created
2. Check static file serving config
3. Verify build command executed
4. Check HTTP status codes

### Performance Issues
1. Enable compression
2. Optimize images
3. Check database indexes
4. Monitor API response times
5. Check memory usage

---

## Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: |
          npm install --prefix backend
          npm install --prefix frontend
      
      - name: Run tests
        run: |
          npm run lint --prefix frontend
      
      - name: Build
        run: npm run build --prefix frontend
      
      - name: Deploy to Railway
        uses: railway-app/action@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE_ID }}
```

---

## Success Indicators

Your deployment is successful when:

✅ Frontend loads without errors  
✅ Users can sign in with Clerk  
✅ Sessions can be created  
✅ Code editor works  
✅ Code execution produces output  
✅ Video calls connect  
✅ Chat messages send/receive  
✅ Database queries are fast  
✅ No console errors  
✅ HTTPS is enabled  
✅ Monitoring/alerts are active  

---

**Deployment Complete!** 🚀
