# 🚀 Quick Deploy to Render

## One-Click Deploy (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Deploy with Blueprint**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repo: `Touseef-ahmad/motor`
   - Click **"Apply"**
   - Wait 3-5 minutes for deployment

3. **Your API is live!**
   - URL: `https://motor-api.onrender.com`
   - Test: `https://motor-api.onrender.com/health`

## What Gets Created

✅ **PostgreSQL Database** (`motor-db`)
- Free tier: 1 GB storage
- Automatically connected to API

✅ **Web Service** (`motor-api`)
- Free tier: 512 MB RAM
- Auto-deploy on git push
- SSL certificate included

## Environment Variables (Auto-Configured)

The `render.yaml` file automatically sets:
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL` (from database)
- `CORS_ORIGIN=*`

## Connect Your Mobile App

Update `expo-app/src/config/api.ts`:

```typescript
export const API_CONFIG = {
  USE_BACKEND: true,
  API_URL: 'https://motor-api.onrender.com', // Replace with your URL
};
```

## Important Notes

⚠️ **Free Tier Limitations:**
- Service sleeps after 15 min inactivity
- First request takes ~30 seconds to wake up
- Database expires after 90 days (upgrade to keep)

💡 **For Production:**
- Upgrade to paid tier ($7/month minimum)
- Add custom domain
- Enable backups

## Next Steps

📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Detailed deployment guide
- Manual setup instructions
- Troubleshooting tips
- Security best practices

## Need Help?

- [Render Docs](https://render.com/docs)
- [GitHub Issues](https://github.com/Touseef-ahmad/motor/issues)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
