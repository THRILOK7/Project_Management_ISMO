# ⚡ Quick Deployment Reference Card

## 🎯 Essential Configuration (Copy-Paste Ready)

### Railway (Backend) Environment Variables
```bash
FRONTEND_URL=https://frontend-version1-l9pyym33x-thrilok7s-projects.vercel.app
DATABASE_URL=postgresql://postgres.vcnuqjboqzkretocrukc:7396622783thrilokA%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.vcnuqjboqzkretocrukc:7396622783thrilokA%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=super_secret_jwt_key_for_development_purposes_only
```

### Vercel (Frontend) Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://projectmanagementismo-production.up.railway.app
```

---

## 🚀 Deployment Checklist

### Railway Setup
- [ ] Go to Railway project dashboard
- [ ] Select backend service → Variables tab
- [ ] Add `FRONTEND_URL` variable (see above)
- [ ] Verify other variables are present
- [ ] Wait for automatic redeploy
- [ ] Check deployment logs for errors
- [ ] Test: Visit `https://projectmanagementismo-production.up.railway.app`
  - Should see: "API is running..."

### Vercel Setup
- [ ] Go to Vercel project dashboard
- [ ] Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_API_URL` variable (see above)
- [ ] Select all environments (Production, Preview, Development)
- [ ] Save changes
- [ ] Go to Deployments → Redeploy latest
- [ ] Wait for redeploy to complete
- [ ] Test: Visit your Vercel URL and try to login

---

## 🔍 Quick Verification

### Test Backend (Railway)
1. Open: `https://projectmanagementismo-production.up.railway.app`
2. Should see: "API is running..."

### Test Frontend (Vercel)
1. Open browser DevTools (F12) → Console
2. Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
3. Should see: `https://projectmanagementismo-production.up.railway.app`

### Test Connection
1. Go to your Vercel URL
2. Try to register/login
3. Open DevTools → Network tab
4. Should see requests going to Railway URL
5. Should NOT see CORS errors in Console

---

## ⚠️ Important Notes

### NO Trailing Slashes!
```
✅ CORRECT:   https://your-app.vercel.app
❌ WRONG:     https://your-app.vercel.app/
```

### Variable Name Must Be Exact
```
✅ CORRECT:   NEXT_PUBLIC_API_URL    (for Vercel)
❌ WRONG:     API_URL
❌ WRONG:     NEXT_API_URL
```

### Must Redeploy After Adding Variables
- Vercel: Manual redeploy required
- Railway: Auto-redeploys

---

## 🐛 Troubleshooting One-Liners

### CORS Error?
→ Check `FRONTEND_URL` in Railway matches your Vercel URL exactly

### Failed to Fetch?
→ Check `NEXT_PUBLIC_API_URL` in Vercel matches your Railway URL exactly

### Variables Not Working?
→ Did you redeploy after adding them?

### Still Issues?
→ Clear browser cache or use Incognito mode

---

## 📞 Test Your Setup

Run this command in your project root:
```bash
node verify-config.js
```

This will test:
- ✅ Backend accessibility
- ✅ CORS configuration
- ✅ API endpoints responding

---

## 🔄 Local Development (Optional)

To switch back to local development:

**Frontend** `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend** `.env`:
```bash
FRONTEND_URL=http://localhost:3000
```

Then restart both servers.

---

**Your URLs:**
- Frontend: `https://frontend-version1-l9pyym33x-thrilok7s-projects.vercel.app`
- Backend: `https://projectmanagementismo-production.up.railway.app`

For detailed instructions, see: **DEPLOYMENT_SETUP.md**
