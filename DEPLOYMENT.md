# 🚀 Deployment Guide - Render.com

This guide walks you through deploying the Motor backend API to Render, a modern cloud platform that makes deployment simple and automatic.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ A [Render account](https://render.com) (free tier available)
- ✅ Your GitHub repository connected to Render
- ✅ Basic understanding of environment variables

## 🎯 What is Render?

Render is a modern cloud platform that provides:
- **Free PostgreSQL database** (with limits)
- **Free web services** (with sleep after inactivity)
- **Automatic deployments** from Git
- **Built-in SSL certificates**
- **Easy environment variable management**

## 🚀 Quick Start - Deploy with Blueprint (Recommended)

The easiest way to deploy is using Render's Blueprint feature, which automatically sets up both your API and database.

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create New Blueprint in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click **"Apply"** to create all services

That's it! Render will:
- ✅ Create a PostgreSQL database
- ✅ Create a web service for your API
- ✅ Set up all environment variables automatically
- ✅ Deploy your application
- ✅ Provide you with a public URL

### Step 3: Monitor Deployment

1. Watch the build logs in the Render dashboard
2. Once deployed, your API will be available at: `https://motor-api.onrender.com`
3. Test the health endpoint: `https://motor-api.onrender.com/health`

---

## 📖 Manual Deployment (Alternative Method)

If you prefer to set things up manually, follow these steps:

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name**: `motor-db`
   - **Database**: `motor_db`
   - **Plan**: Free
   - **Region**: Choose closest to your users
4. Click **"Create Database"**
5. Save the **Internal Database URL** (starts with `postgresql://`)

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `motor-api`
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or use `server` if you want)
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

### Step 3: Configure Environment Variables

In the web service settings, add these environment variables:

#### Required Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `3000` | Port number (Render overrides this) |
| `DATABASE_URL` | `[Your DB Internal URL]` | From Step 1 |
| `CORS_ORIGIN` | `*` | Allow all origins (or specify your app URL) |

#### Optional Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `JWT_SECRET` | `[Your Secret]` | If using JWT authentication |
| `JWT_EXPIRE` | `7d` | Token expiration time |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your TypeScript code
   - Start the server
3. Monitor the deployment in the logs

---

## 🔒 Security Best Practices

### Environment Variables

Never commit sensitive data to your repository:
- ❌ DO NOT commit `.env` files
- ✅ DO use Render's environment variables
- ✅ DO use strong passwords for production
- ✅ DO limit CORS origins in production

### CORS Configuration

Update your `CORS_ORIGIN` in production:

```env
# Development (local)
CORS_ORIGIN=*

# Production (specific origins)
CORS_ORIGIN=https://your-mobile-app.com,https://your-website.com
```

### Database Security

- Use Render's **Internal Database URL** for best security
- The database is not publicly accessible by default
- Render handles SSL/TLS certificates automatically

---

## 🧪 Testing Your Deployment

### Test Health Endpoint

```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Motor API is running"
}
```

### Test API Endpoints

```bash
# Create a car
curl -X POST https://your-app-name.onrender.com/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Car",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020
  }'

# Get all cars
curl https://your-app-name.onrender.com/api/cars
```

---

## 📱 Connecting Your Mobile App

### Update API Configuration

In your Expo app, update `expo-app/src/config/api.ts`:

```typescript
export const API_CONFIG = {
  USE_BACKEND: true,
  API_URL: 'https://your-app-name.onrender.com',
};
```

### Rebuild Your Mobile App

```bash
cd expo-app
npm start
```

---

## 🔄 Automatic Deployments

Render automatically deploys when you push to your repository:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Render will:
1. Detect the push
2. Start a new build
3. Run tests (if configured)
4. Deploy the new version
5. Replace the old version (zero downtime)

---

## 📊 Monitoring and Logs

### View Logs

1. Go to your service in Render Dashboard
2. Click on **"Logs"** tab
3. Real-time logs will appear

### Common Log Messages

✅ Successful deployment:
```
✅ Database connection established successfully.
✅ Database models synchronized (production mode).
🚗 Motor API server is running on port 3000
📍 Environment: production
```

❌ Common errors:
- `Unable to connect to the database` - Check DATABASE_URL
- `Port 3000 is already in use` - Render handles ports automatically
- `Module not found` - Run build command again

---

## 🎛️ Environment-Specific Settings

### Development vs Production

The app automatically detects the environment:

| Feature | Development | Production |
|---------|-------------|------------|
| Logging | Verbose | Minimal |
| DB Sync | `alter: true` | `alter: false` |
| SSL | Disabled | Enabled |
| CORS | `*` | Specific origins |

---

## 💰 Pricing

### Render Free Tier

**PostgreSQL:**
- 1 GB storage
- Expires after 90 days (requires upgrade to keep)
- Shared CPU and RAM

**Web Service:**
- 512 MB RAM
- Shared CPU
- Spins down after 15 minutes of inactivity
- Spins up automatically when accessed (takes ~30 seconds)

### Paid Tiers

For production use, consider upgrading:
- **Starter**: $7/month (always on, 512 MB RAM)
- **Standard**: $25/month (1 GB RAM, better performance)
- **Pro**: $85/month (4 GB RAM, dedicated CPU)

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Verify DATABASE_URL is set correctly
2. Check database is in the same region as web service
3. Ensure database is running (check Render dashboard)

### Issue: Service Not Starting

**Solution:**
1. Check build logs for errors
2. Verify `package.json` scripts exist
3. Ensure all dependencies are in `dependencies`, not `devDependencies`

### Issue: API Returns 503

**Solution:**
- Free tier services sleep after inactivity
- First request wakes up the service (~30 seconds)
- Consider upgrading for always-on service

### Issue: Module Not Found

**Solution:**
```bash
# In server/package.json, move required packages from devDependencies to dependencies
npm install --save typescript ts-node @types/node @types/express
```

---

## 🔧 Advanced Configuration

### Custom Domain

1. Go to service settings in Render
2. Click **"Custom Domains"**
3. Add your domain
4. Update DNS records as instructed

### Health Checks

Render automatically checks `/health` endpoint:
- Interval: 30 seconds
- Timeout: 5 seconds
- Success codes: 200-299

### Scaling

Render can scale your application:
1. Go to service settings
2. Increase RAM/CPU in **"Instance Type"**
3. Or add multiple instances (paid plans)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Status](https://status.render.com)
- [Render Community](https://community.render.com)
- [PostgreSQL on Render](https://render.com/docs/databases)

---

## 🎉 Success!

Your Motor API is now deployed and accessible from anywhere! Your mobile app can now sync data to the cloud.

### Next Steps:

1. ✅ Test all API endpoints
2. ✅ Connect your mobile app
3. ✅ Set up monitoring
4. ✅ Configure backups (paid plans)
5. ✅ Add custom domain (optional)

---

## 💡 Tips

- **Free Tier**: Perfect for development and testing
- **Upgrade**: Required for production apps with traffic
- **Backups**: Enable for production databases
- **Monitoring**: Use Render's built-in monitoring or integrate external tools
- **Security**: Review environment variables regularly

---

## 📧 Support

Having issues? Check:
1. Render Dashboard logs
2. This deployment guide
3. [Render Community](https://community.render.com)
4. [GitHub Issues](https://github.com/Touseef-ahmad/motor/issues)

---

**Happy Deploying! 🚀**
