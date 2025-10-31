# Vercel Deployment Guide for BlockVote

This guide will help you deploy your blockchain voting application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Git installed on your machine
- Your project in a Git repository

## Step 1: Prepare Your Project

### 1.1 Create Environment Variables File

Create a `.env.local` file in your project root if you haven't already:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x35267EAE1c7a13Cf42Ef312075115F15b7D9BcA7
```

**Important:** Never commit `.env.local` to Git! Make sure it's in your `.gitignore`.

### 1.2 Verify .gitignore

Ensure your `.gitignore` includes:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

## Step 2: Initialize Git Repository (If Not Done)

If your project isn't in a Git repository yet:

```bash
cd "C:\Users\siddh\OneDrive\Desktop\blockchain voting\blockchain-voting"
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

## Step 3: Push to GitHub

### 3.1 Create a New Repository on GitHub

1. Go to https://github.com/new
2. Name your repository (e.g., `blockchain-voting`)
3. Choose "Public" or "Private"
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 3.2 Push Your Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/blockchain-voting.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### 4.1 Connect Your Repository

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account and choose your `blockchain-voting` repository
5. Click **"Import"**

### 4.2 Configure Your Project

Vercel will automatically detect that it's a Next.js project. Configure the following:

**Project Name:** `blockchain-voting` (or your preferred name)

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:** `npm run build` (auto-detected)

**Output Directory:** `.next` (auto-detected)

**Install Command:** `npm install` (auto-detected)

### 4.3 Set Environment Variables

In the Vercel project settings, add your environment variables:

1. Scroll down to **"Environment Variables"**
2. Add each variable:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `your_walletconnect_project_id` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x35267EAE1c7a13Cf42Ef312075115F15b7D9BcA7` |

3. Make sure to select **Production**, **Preview**, and **Development** for each variable

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-project-name.vercel.app`

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Your Domain

1. Go to your project dashboard on Vercel
2. Click on **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow Vercel's instructions to configure your DNS settings

### 5.2 Domain Configuration

If you have a domain from providers like:
- **Namecheap**
- **GoDaddy**
- **Google Domains**
- **Cloudflare**

Add these DNS records:

**Type:** `A Record`
**Name:** `@`
**Value:** `76.76.21.21`

**Type:** `CNAME`
**Name:** `www`
**Value:** `cname.vercel-dns.com`

## Step 6: Continuous Deployment

Now that your project is connected:

1. Every push to your `main` branch will automatically deploy to production
2. Every push to other branches creates a preview deployment
3. Every pull request gets its own preview URL

### To Deploy Updates:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically build and deploy your changes!

## Step 7: Verify Your Deployment

### 7.1 Check the Live Site

Visit your Vercel URL and verify:

- ✅ Site loads correctly
- ✅ Wallet connection works
- ✅ Can view polls
- ✅ Can create polls (if wallet connected)
- ✅ Can vote on polls
- ✅ Dark theme is active
- ✅ All navigation links work

### 7.2 Test on Mobile

Vercel provides mobile testing tools:
1. Scan the QR code in your deployment dashboard
2. Test the PWA install feature
3. Verify wallet connections work on mobile

## Step 8: Monitor Your Application

### 8.1 Analytics

Enable Vercel Analytics:
1. Go to your project dashboard
2. Click **"Analytics"**
3. Enable **Vercel Analytics** (free tier available)

### 8.2 Logs

View deployment logs:
1. Go to **"Deployments"**
2. Click on any deployment
3. View **"Build Logs"** and **"Function Logs"**

## Troubleshooting

### Build Fails

**Error:** "Module not found"
- **Solution:** Make sure all dependencies are in `package.json`
- Run: `npm install` locally to verify

**Error:** "Environment variable not set"
- **Solution:** Check your environment variables in Vercel settings
- Make sure `NEXT_PUBLIC_` prefix is used for client-side variables

### Site Loads but Wallet Won't Connect

- **Solution:** Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
- Get a new Project ID from https://cloud.walletconnect.com if needed

### Slow Performance

- Check Vercel Analytics for bottlenecks
- Verify your RPC endpoint is fast (Sepolia testnet can be slow)
- Consider upgrading to Vercel Pro for better edge performance

## Advanced Configuration

### Enable Edge Runtime (Optional)

For even better performance, you can enable Edge Runtime for certain pages.

In your page files, add:

```typescript
export const runtime = 'edge'
```

### Custom Build Settings

In your project settings, you can customize:
- **Node.js Version:** 18.x (recommended)
- **Build Command:** Custom if needed
- **Output Directory:** Custom if needed

## Cost Optimization

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth per month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Edge Network

### When to Upgrade:
- Need more than 100GB bandwidth
- Need priority support
- Need advanced analytics
- Need team collaboration features

## Security Best Practices

1. **Never commit private keys or sensitive data**
2. **Use environment variables for all configuration**
3. **Enable Vercel's security headers** (already configured in next.config.js)
4. **Keep dependencies updated:** Run `npm audit` regularly
5. **Monitor your deployment logs** for suspicious activity

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: Create issues in your repository

## Quick Commands Reference

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from CLI
vercel

# Deploy to production from CLI
vercel --prod

# View logs
vercel logs your-project-name

# Check deployment status
vercel ls
```

## Summary

Your BlockVote application is now deployed on Vercel! 🎉

- **Live URL:** https://your-project-name.vercel.app
- **Automatic deployments** on every push
- **Preview URLs** for every pull request
- **Edge network** for fast global access
- **HTTPS** enabled by default
- **PWA ready** for mobile installation

For any issues, check the Vercel dashboard logs or visit the Vercel documentation.

Happy voting! 🗳️
