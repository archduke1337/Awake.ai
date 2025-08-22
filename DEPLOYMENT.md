# AWAKE - Vercel Deployment Guide

## Quick Start Deployment

### 1. Prepare Your Repository
Your AWAKE application is now ready for Vercel deployment with the following files:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.js` - API handler for Vercel
- ✅ `.env.example` - Environment variables template

### 2. Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)
1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Setup Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Set Environment Variables**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add these variables:
     ```
     GEMINI_API_KEY = your_actual_gemini_api_key
     NODE_ENV = production
     ```
   - Optional: Add `DATABASE_URL` if using Neon database

4. **Deploy**
   - Click "Deploy" 
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project-name.vercel.app`

#### Option B: Deploy via Vercel CLI
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add NODE_ENV
   ```

### 3. Configure Your Domain (Optional)
- In Vercel dashboard → Domains
- Add your custom domain
- Update DNS settings as instructed

### 4. Verify Deployment
After deployment, test these endpoints:
- `https://your-app.vercel.app` - Frontend should load
- `https://your-app.vercel.app/api/conversations` - API should return `[]`

## Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google AI Studio API key | Yes |
| `NODE_ENV` | Set to "production" | Yes |
| `DATABASE_URL` | Neon PostgreSQL URL | No (uses memory storage) |

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure Gemini API key is valid
- Verify no syntax errors in code

### API Routes Don't Work
- Check the `api/index.js` file exists
- Verify environment variables are set in Vercel
- Check Function logs in Vercel dashboard

### Frontend Assets Missing
- Ensure build completed successfully
- Check that `dist/public` directory is generated
- Verify asset paths in `vercel.json`

## Post-Deployment

1. **Test all features:**
   - New chat creation
   - Message sending
   - AI responses
   - Conversation history

2. **Monitor performance:**
   - Use Vercel Analytics
   - Check Function logs
   - Monitor API response times

3. **Scale if needed:**
   - Upgrade Vercel plan for more resources
   - Consider database scaling for high usage

Your AWAKE AI assistant is now ready for production! 🚀