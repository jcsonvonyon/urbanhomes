# Vercel Synchronization Checklist

## Step-by-Step Instructions to Sync Vercel with Current Setup

### Step 1: Verify Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your UrbanHomes project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Check if these variables exist and match:

```
VITE_SUPABASE_URL = https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

**If they don't exist or are different:**
- Click "Add New" button
- Name: `VITE_SUPABASE_URL`
- Value: `https://0ec90b57d6e95fcbda19832f.supabase.co`
- Select all environments (Production, Preview, Development)
- Click "Save"
- Repeat for `VITE_SUPABASE_ANON_KEY`

### Step 2: Trigger a New Deployment

After adding/updating environment variables:

1. Go to the **Deployments** tab
2. Find the most recent deployment
3. Click the three dots (...) menu on the right
4. Click **Redeploy**
5. Check "Use existing Build Cache" (optional, faster)
6. Click **Redeploy** button

OR push a new commit to GitHub:
- Your changes will be committed automatically
- Vercel will detect the push and deploy automatically

### Step 3: Wait for Deployment to Complete

1. Watch the deployment progress in Vercel dashboard
2. Check the build logs for any errors
3. Look for "Build Completed" and "Deployment Ready" messages

### Step 4: Test the Deployed Site

1. Click on the deployment URL or visit your custom domain
2. Open browser console (F12)
3. Go to the Sign Up page
4. Try creating a new account
5. Check console for logs showing:
   ```
   Testing Supabase connection...
   Supabase URL: https://0ec90b57d6e95fcbda19832f.supabase.co
   Has Anon Key: true
   Supabase connected successfully
   ```

### Step 5: Verify Authentication Works

Test the complete flow:
1. Sign up with a new email
2. Check console for "Sign up response" logs
3. Verify you're redirected appropriately
4. If redirected to sign-in, try signing in
5. Verify you reach the dashboard

## Why Vercel Might Be Out of Sync

Common reasons:
1. **Missing environment variables** - Most common issue
2. **Old deployment** - Need to redeploy after env var changes
3. **Build cache** - Old build cached, need fresh deployment
4. **Wrong branch** - Vercel deploying from wrong Git branch

## Quick Test

To quickly verify the issue:
1. Visit your Vercel site
2. Open browser console (F12)
3. Type: `console.log(import.meta.env.VITE_SUPABASE_URL)`
4. If it shows `undefined`, environment variables aren't set in Vercel
5. If it shows a different URL, environment variables don't match

## Next Steps After Sync

Once Vercel is synced and working:
1. Test signup/signin flow thoroughly
2. Test password reset
3. Test dashboard access
4. Verify profile updates work

## Need Help?

If after following these steps it still doesn't work:
1. Share the Vercel deployment URL
2. Share any errors from Vercel build logs
3. Share any errors from browser console on the deployed site
