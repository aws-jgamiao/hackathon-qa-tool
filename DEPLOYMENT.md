# Deployment Guide: GitHub & Vercel

This guide walks you through deploying the Flowlogic QA Assistant to GitHub and Vercel.

## **What We're Deploying**

- **Frontend**: React app → GitHub Pages (static hosting)
- **Backend API**: Node.js/Claude → Vercel (serverless functions)
- **Database**: Supabase (already cloud-hosted, no action needed)

---

## **Phase 1: Prepare Your Local Environment**

### Step 1.1: Create `.gitignore` file
Make sure sensitive files aren't committed:

```bash
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.vercel/
```

### Step 1.2: Verify your code is ready
- ✅ All features working locally
- ✅ Dark mode working
- ✅ Database connected via Supabase
- ✅ Backend running on port 3001

### Step 1.3: Update vite.config.js (if needed)
Add this to ensure GitHub Pages deployment works:

```javascript
export default {
  base: '/hackathon/', // Change 'hackathon' to your repo name
  // ... rest of config
}
```

---

## **Phase 2: Create GitHub Repository**

### Step 2.1: Initialize Git (if not already done)
```bash
cd d:\work\hackathon
git init
git config user.name "Your Name"
git config user.email "your.email@github.com"
```

### Step 2.2: Create a repository on GitHub
1. Go to https://github.com/new
2. Name it: `hackathon` (or your preferred name)
3. Make it **Public** (required for GitHub Pages)
4. Click "Create repository"

### Step 2.3: Add remote and push to GitHub
```bash
git add .
git commit -m "Initial commit: Flowlogic QA Assistant with dark mode"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hackathon.git
git push -u origin main
```

---

## **Phase 3: Deploy Backend to Vercel**

### Step 3.1: Create a Vercel account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 3.2: Import your GitHub project
1. In Vercel dashboard, click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Search for and select your `hackathon` repository
4. Click "Import"

### Step 3.3: Configure Environment Variables
On the Vercel import screen, scroll to "Environment Variables":

Add this variable:
- **Name**: `VITE_ANTHROPIC_API_KEY`
- **Value**: Your Claude API key (from anthropic.com)
- Click "Add"

Then click "Deploy"

### Step 3.4: Wait for deployment
- Vercel will build and deploy your backend
- You'll get a URL like: `https://hackathon.vercel.app`
- Save this URL - you'll need it for the frontend

### Step 3.5: Test the backend
Once deployed, test the endpoint:
```bash
curl -X POST https://your-vercel-url.vercel.app/api/generate-test-cases \
  -H "Content-Type: application/json" \
  -d '{"ticket":{"id":"TEST-1","name":"Test","type":"Bug","platform":"iOS"},"acceptanceCriteria":["Test AC"]}'
```

---

## **Phase 4: Deploy Frontend to GitHub Pages**

### Step 4.1: Build the frontend
```bash
npm run build
```

This creates a `dist/` folder with your production build.

### Step 4.2: Configure GitHub Pages
1. Go to your GitHub repository settings
2. Scroll to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main`
5. Select folder: `/ (root)` or `/dist` if available
6. Click "Save"

### Step 4.3: Install gh-pages dependency
```bash
npm install --save-dev gh-pages
```

### Step 4.4: Update package.json
Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4.5: Deploy to GitHub Pages
```bash
npm run deploy
```

### Step 4.6: Update vite.config.js
Make sure your vite.config.js has the correct base path:

```javascript
export default defineConfig({
  base: '/hackathon/', // Your repo name
  plugins: [react()]
})
```

---

## **Phase 5: Verify Everything Works**

### Step 5.1: Test the live frontend
1. Go to: `https://YOUR_USERNAME.github.io/hackathon`
2. Check that the app loads
3. Try creating a ticket
4. Verify dark mode toggle works

### Step 5.2: Test test case generation
1. Create a new ticket with acceptance criteria
2. Verify test cases are generated (calls your Vercel backend)
3. Check that test cases save to Supabase

### Step 5.3: Test all features
- ✅ Dashboard loads
- ✅ Create/edit tickets
- ✅ Test case generation works
- ✅ Test runs work
- ✅ Activity log shows entries
- ✅ Dark mode works
- ✅ Exports to PDF/Excel work

---

## **Troubleshooting**

### Issue: "Cannot reach backend" in production
**Solution**: Make sure your frontend's `claudeService.js` is using the correct URL (should auto-detect from Vercel)

### Issue: CORS errors
**Solution**: The backend API has CORS enabled by default in `api/generate-test-cases.js`

### Issue: Vercel shows build errors
**Solution**: Check the Vercel logs at https://vercel.com/dashboard and look for error messages

### Issue: GitHub Pages not updating
**Solution**: 
```bash
npm run predeploy  # Build
npm run deploy     # Deploy to gh-pages
git push          # Push updated code to GitHub
```

---

## **Environment Variables Needed**

### For Vercel (Backend):
```
VITE_ANTHROPIC_API_KEY=your_claude_api_key_here
```

### For Frontend (local .env):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## **URLs After Deployment**

- **Frontend**: `https://YOUR_USERNAME.github.io/hackathon`
- **Backend**: `https://your-project-name.vercel.app`
- **API Endpoint**: `https://your-project-name.vercel.app/api/generate-test-cases`

---

## **What's Different in Production?**

1. **Frontend** runs from GitHub Pages (static files)
2. **Backend** runs on Vercel (serverless functions)
3. **Database** (Supabase) stays the same
4. Frontend automatically uses Vercel backend when in production mode
5. Local development still uses `localhost:3001`

---

## **Next Steps**

- Monitor Vercel analytics at https://vercel.com/dashboard
- Check GitHub Pages build status in repository Settings → Pages
- Monitor Supabase for any issues at https://app.supabase.com

Good luck! 🚀
