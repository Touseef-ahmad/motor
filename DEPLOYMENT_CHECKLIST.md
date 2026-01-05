# ✅ Deployment Checklist

Use this checklist to deploy your Motor backend to Render.com.

## 📋 Pre-Deployment Checklist

- [ ] ✅ Code is committed to GitHub
- [ ] ✅ `render.yaml` exists in root directory
- [ ] ✅ `server/build.sh` is executable
- [ ] ✅ `server/package.json` has TypeScript in dependencies
- [ ] ✅ Database configuration supports `DATABASE_URL`
- [ ] ✅ Build command works locally (`cd server && npm run build`)

## 🚀 Deployment Steps

### Step 1: Prepare Repository
- [ ] Push all changes to GitHub
  ```bash
  git add .
  git commit -m "Ready for Render deployment"
  git push origin main
  ```

### Step 2: Sign Up for Render
- [ ] Go to https://render.com
- [ ] Sign up or log in (GitHub OAuth recommended)
- [ ] Connect your GitHub account

### Step 3: Deploy with Blueprint
- [ ] Click **"New +"** in Render Dashboard
- [ ] Select **"Blueprint"**
- [ ] Choose repository: `Touseef-ahmad/motor`
- [ ] Render detects `render.yaml` automatically
- [ ] Review the Blueprint (motor-api + motor-db)
- [ ] Click **"Apply"**

### Step 4: Wait for Deployment
- [ ] Watch build logs (takes 3-5 minutes)
- [ ] Check for successful deployment message
- [ ] Note your API URL (e.g., `https://motor-api.onrender.com`)

### Step 5: Test Your API
- [ ] Test health endpoint:
  ```bash
  curl https://motor-api.onrender.com/health
  ```
- [ ] Expected response:
  ```json
  {
    "status": "ok",
    "message": "Motor API is running"
  }
  ```

### Step 6: Test Database Connection
- [ ] Check logs for "Database connection established"
- [ ] Create a test car:
  ```bash
  curl -X POST https://motor-api.onrender.com/api/cars \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Car","make":"Toyota","model":"Camry","year":2020}'
  ```

### Step 7: Connect Mobile App
- [ ] Update `expo-app/src/config/api.ts`:
  ```typescript
  export const API_CONFIG = {
    USE_BACKEND: true,
    API_URL: 'https://motor-api.onrender.com',
  };
  ```
- [ ] Restart Expo app: `npm start`
- [ ] Test creating/reading data from mobile app

## 🔍 Verification Checklist

### Backend API
- [ ] ✅ Service is running (green status in Render)
- [ ] ✅ Health endpoint returns 200 OK
- [ ] ✅ API endpoints respond correctly
- [ ] ✅ No errors in logs
- [ ] ✅ Build completed successfully

### Database
- [ ] ✅ Database is running
- [ ] ✅ Connection established
- [ ] ✅ Tables created automatically
- [ ] ✅ Data persists between requests

### Mobile App
- [ ] ✅ API URL updated in config
- [ ] ✅ App connects to backend
- [ ] ✅ Can create cars
- [ ] ✅ Can read cars
- [ ] ✅ Can add oil changes
- [ ] ✅ Can add fuel logs
- [ ] ✅ Can add expenses

## 📊 Post-Deployment Tasks

### Monitoring
- [ ] Bookmark Render Dashboard
- [ ] Check logs regularly
- [ ] Monitor error rates
- [ ] Set up alerts (if available)

### Documentation
- [ ] Document your API URL
- [ ] Save environment variables
- [ ] Note database connection details
- [ ] Keep backup of configuration

### Security
- [ ] Review CORS settings (change `*` to specific origins in production)
- [ ] Add authentication (JWT) if needed
- [ ] Set up rate limiting (future)
- [ ] Enable database backups (paid plan)

### Performance
- [ ] Test API response times
- [ ] Monitor service wake-up time (free tier sleeps)
- [ ] Consider upgrading for production use
- [ ] Add caching if needed (future)

## 🆘 Troubleshooting

### If Build Fails
- [ ] Check build logs in Render Dashboard
- [ ] Verify `npm run build` works locally
- [ ] Ensure TypeScript is in dependencies
- [ ] Check all imports are correct

### If Database Connection Fails
- [ ] Verify `DATABASE_URL` is set in environment
- [ ] Check database is running
- [ ] Ensure database and service are in same region
- [ ] Review SSL/TLS configuration

### If Service Won't Start
- [ ] Check start command is correct
- [ ] Verify `npm start` works locally
- [ ] Ensure `dist/index.js` exists after build
- [ ] Check for port conflicts

### If API Returns Errors
- [ ] Check application logs
- [ ] Verify database connection
- [ ] Test endpoints locally first
- [ ] Check CORS configuration

## 💰 Cost Considerations

### Free Tier (Current)
- ✅ $0/month
- ✅ Good for development
- ⚠️ Service sleeps after 15 min
- ⚠️ Database expires in 90 days

### When to Upgrade
- 🎯 Production deployment
- 🎯 Need always-on service
- 🎯 Want permanent database
- 🎯 Need better performance
- 🎯 Require backups

### Paid Plans
- **Starter**: $7/month (always on, 512 MB RAM)
- **Standard**: $25/month (1 GB RAM)
- **Pro**: $85/month (4 GB RAM)

## 📚 Resources

Quick Links:
- [ ] [Quick Deploy Guide](./RENDER_DEPLOY.md)
- [ ] [Full Deployment Guide](./DEPLOYMENT.md)
- [ ] [Setup Complete Guide](./RENDER_SETUP_COMPLETE.md)
- [ ] [Architecture Documentation](./ARCHITECTURE.md)
- [ ] [Render Dashboard](https://dashboard.render.com)
- [ ] [Render Documentation](https://render.com/docs)

## 🎉 Success Criteria

You've successfully deployed when:
- ✅ Service status is "Live" (green)
- ✅ Health endpoint returns 200 OK
- ✅ Database connection is established
- ✅ Mobile app can communicate with API
- ✅ Data persists in database
- ✅ No errors in logs

## 🎯 Next Steps After Deployment

1. **Test Thoroughly**
   - [ ] Test all API endpoints
   - [ ] Test from mobile app
   - [ ] Test error cases
   - [ ] Test with real data

2. **Monitor**
   - [ ] Check logs daily
   - [ ] Monitor performance
   - [ ] Track errors
   - [ ] Review usage

3. **Optimize**
   - [ ] Review and optimize queries
   - [ ] Add indexes if needed
   - [ ] Implement caching
   - [ ] Optimize API responses

4. **Enhance**
   - [ ] Add authentication (JWT)
   - [ ] Implement rate limiting
   - [ ] Add API documentation (Swagger)
   - [ ] Set up CI/CD pipeline

5. **Plan for Production**
   - [ ] Upgrade to paid plan
   - [ ] Add custom domain
   - [ ] Enable backups
   - [ ] Set up monitoring/alerting
   - [ ] Implement CDN for assets

## 📝 Notes

**Deployment Date**: _______________
**API URL**: _______________
**Database Name**: motor-db
**Service Name**: motor-api
**Region**: Oregon (US West)

---

**Status**: Ready for deployment! 🚀

Print this checklist and mark items as you complete them.
