# 🚀 Deployment Configuration Guide

## Complete Setup for Vercel (Frontend) + Railway (Backend)

This guide provides step-by-step instructions to fix CORS and "Failed to fetch" errors by properly configuring your deployment environments.

---

## ✅ **Current Configuration Summary**

### Frontend (Vercel)
- **URL**: `https://frontend-version1-l9pyym33x-thrilok7s-projects.vercel.app`
- **Required Environment Variable**: `NEXT_PUBLIC_API_URL`

### Backend (Railway)
- **URL**: `https://projectmanagementismo-production.up.railway.app`
- **Required Environment Variable**: `FRONTEND_URL`

---

## 📋 **Step 1: Configure Backend on Railway**

### Set Environment Variables

1. Go to your Railway project dashboard
2. Select your backend service
3. Navigate to **Variables** tab
4. Add the following environment variable:

```
FRONTEND_URL=https://frontend-version1-l9pyym33x-thrilok7s-projects.vercel.app
```

⚠️ **Important**: 
- **NO trailing slash** at the end of the URL
- Make sure this matches your exact Vercel deployment URL

### Existing Variables (Keep These)
Your Railway backend should already have these:
```
DATABASE_URL=postgresql://postgres.vcnuqjboqzkretocrukc:7396622783thrilokA%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.vcnuqjboqzkretocrukc:7396622783thrilokA%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=super_secret_jwt_key_for_development_purposes_only
```

### Redeploy
After adding the environment variable:
1. Railway will automatically redeploy
2. Wait for the deployment to complete
3. Check the deployment logs for any errors

---

## 📋 **Step 2: Configure Frontend on Vercel**

### Set Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:

```
NEXT_PUBLIC_API_URL=https://projectmanagementismo-production.up.railway.app
```

⚠️ **Important**: 
- **NO trailing slash** at the end of the URL
- The variable name **must** start with `NEXT_PUBLIC_` to be available in the browser
- Make sure this matches your exact Railway backend URL

### Apply to All Environments
When adding the variable, select:
- ✅ Production
- ✅ Preview
- ✅ Development

### Redeploy
After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **•••** menu on your latest deployment
3. Click **Redeploy**
4. Wait for the deployment to complete

---

## 🔍 **Step 3: Verify Configuration**

### Backend Verification (Railway)

1. Open your Railway deployment URL in a browser:
   ```
   https://projectmanagementismo-production.up.railway.app
   ```
   You should see: `API is running...`

2. Check CORS headers using browser DevTools:
   - Open DevTools (F12)
   - Go to Network tab
   - Make a request to your API
   - Check the response headers for:
     - `access-control-allow-origin: https://frontend-version1-l9pyym33x-thrilok7s-projects.vercel.app`
     - `access-control-allow-credentials: true`

### Frontend Verification (Vercel)

1. Open your Vercel deployment URL
2. Open browser DevTools (F12) → Console
3. Type the following to verify the API URL:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```
   You should see: `https://projectmanagementismo-production.up.railway.app`

4. Try logging in or registering a user
5. Check the Network tab to see if requests are going to the correct Railway URL

---

## 🛠️ **What This Configuration Does**

### The "Handshake" Between Frontend and Backend

1. **Frontend → Backend Communication**
   - Your frontend uses `NEXT_PUBLIC_API_URL` to know where to send API requests
   - All API calls go to: `https://projectmanagementismo-production.up.railway.app/api/...`
   - The API library (`frontend/src/lib/api.ts`) automatically prepends this URL to all endpoints

2. **Backend → Frontend Authorization (CORS)**
   - Your backend uses `FRONTEND_URL` to know which origin to trust
   - CORS middleware allows requests from: `https://frontend-version1-l9pyym33x-thrilok7s-projects.vercel.app`
   - This prevents other websites from making unauthorized requests to your API

### CORS Configuration Details

The backend CORS configuration (`backend/src/app.ts`) is set up to:
```typescript
cors({
  origin: process.env.FRONTEND_URL,           // Only allow requests from your Vercel URL
  credentials: true,                          // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed request headers
})
```

---

## 🐛 **Troubleshooting**

### Still Getting CORS Errors?

1. **Clear browser cache**:
   - Chrome: Settings → Privacy and security → Clear browsing data
   - Or use Incognito mode

2. **Check environment variables are loaded**:
   - Railway: Check the Variables tab shows `FRONTEND_URL`
   - Vercel: Check Settings → Environment Variables shows `NEXT_PUBLIC_API_URL`

3. **Verify both services redeployed**:
   - Both Railway and Vercel must redeploy after adding environment variables
   - Check deployment logs for any errors

4. **Check for typos**:
   - URLs must match exactly
   - No trailing slashes
   - HTTPS (not HTTP) for production

### Still Getting "Failed to fetch" Errors?

1. **Verify Railway backend is running**:
   - Visit `https://projectmanagementismo-production.up.railway.app`
   - You should see "API is running..."

2. **Check API endpoints**:
   - Try accessing: `https://projectmanagementismo-production.up.railway.app/api/auth/login`
   - You should get a response (even if it's an error, it means the backend is responding)

3. **Check Network tab in DevTools**:
   - See what URL the frontend is actually calling
   - Look for the exact error message

### Environment Variable Not Updating?

**For Vercel:**
- Environment variables only apply to NEW deployments
- You must redeploy after adding/changing variables
- Try: Deployments → Redeploy (not just "Visit")

**For Railway:**
- Railway auto-redeploys when you change variables
- Check the deployment logs to confirm the new deployment completed
- Look for "Build successful" and "Deployment live"

---

## 📝 **Local Development**

For local development, use these settings:

### Frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend `.env`:
```
FRONTEND_URL=http://localhost:3000
```

This allows you to develop locally without affecting production.

---

## 🎯 **Expected Outcome**

Once properly configured, you should see:

✅ No CORS errors in the browser console  
✅ Login/register working correctly  
✅ API requests successfully reaching Railway backend  
✅ Proper authentication flow with JWT tokens  
✅ All CRUD operations functioning  

---

## 🔄 **Updating URLs (If Needed)**

### If you get a new Vercel deployment URL:
1. Update `FRONTEND_URL` in Railway
2. Redeploy Railway backend
3. Test the connection

### If you get a new Railway deployment URL:
1. Update `NEXT_PUBLIC_API_URL` in Vercel
2. Redeploy Vercel frontend
3. Test the connection

---

## 📞 **Need More Help?**

### Common Issues:
1. **"Mixed Content" error**: Make sure both URLs use HTTPS
2. **"Network Error"**: Check if Railway backend is sleeping (free tier)
3. **"Unauthorized"**: Check JWT_SECRET matches between environments
4. **"Invalid credentials"**: Database connection issue, check DATABASE_URL

### Logs to Check:
- **Railway**: Click on your service → Deployments → View logs
- **Vercel**: Deployments → Click deployment → View function logs
- **Browser**: DevTools → Console + Network tabs

---

**Last Updated**: Current deployment configuration  
**Frontend**: Vercel  
**Backend**: Railway  
**Database**: Supabase PostgreSQL
