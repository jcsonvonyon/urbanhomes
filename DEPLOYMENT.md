# Deployment Guide for Vercel

## Environment Variables Setup

Your Vercel deployment needs these environment variables to work correctly. Add them in your Vercel project settings:

### Required Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add these variables:

```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

**Important:** Make sure to select all environments (Production, Preview, Development) when adding these variables.

## Deployment Steps

### Option 1: Push to GitHub (Recommended)

Your changes will be automatically committed when you're done with this session. Vercel will:
1. Detect the push to your `main` branch
2. Automatically trigger a new deployment
3. Build the project with the updated code
4. Deploy to production

### Option 2: Manual Deployment via Vercel CLI

If you need to deploy immediately:

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Build Configuration

Vercel should use these settings (usually auto-detected):

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Verification Checklist

After deployment, verify:

1. Environment variables are set in Vercel dashboard
2. Build completed successfully (check deployment logs)
3. Visit your Vercel URL and test:
   - Sign up for a new account
   - Check browser console for any errors
   - Verify you can sign in after creating account
   - Test dashboard access

## Troubleshooting

### Authentication Not Working on Vercel

If auth works locally but not on Vercel:

1. **Check Environment Variables:**
   - Go to Vercel Dashboard > Settings > Environment Variables
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Make sure they match your local `.env` file

2. **Redeploy:**
   - After adding/updating environment variables, you must redeploy
   - Go to Deployments tab and click "Redeploy" on the latest deployment

3. **Check Build Logs:**
   - In Vercel dashboard, check the build logs for any errors
   - Look for missing environment variables warnings

4. **Browser Console:**
   - Open browser console (F12) on the Vercel site
   - Look for connection errors or configuration issues

### Common Issues

**Issue:** "Missing Supabase environment variables" error
**Solution:** Add the environment variables in Vercel dashboard and redeploy

**Issue:** Users created but can't sign in
**Solution:** Check that both deployments (Vercel and local) use the same Supabase project

**Issue:** Changes not reflecting on Vercel
**Solution:** Environment variables were updated after deployment - trigger a new deployment

## Database Migrations

All database migrations are already applied to the Supabase project. No additional steps needed.

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console on the deployed site
3. Verify environment variables match exactly
4. Ensure you've redeployed after any environment variable changes
