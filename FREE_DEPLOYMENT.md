# 100% Free Deployment Guide

## You Need (Everything Free!)

1. ✅ Sepolia ETH (you already have this!)
2. ⬜ Free RPC provider account
3. ⬜ Your wallet address

## Step 1: Get Free RPC (2 minutes)

### Option A: Infura (Easiest)
1. Go to https://infura.io
2. Click "Sign Up" (free)
3. Verify email
4. Click "Create New API Key"
5. Name it "BlockVote"
6. Copy the URL that looks like: `https://sepolia.infura.io/v3/abc123def456...`

### Option B: Use Public RPC (No signup!)
Just use: `https://rpc.sepolia.org`
(May be slower but works fine for testing)

## Step 2: Setup Locally (5 minutes)

```bash
# In your blockvote folder
cp .env.local.template .env.local
```

Open `.env.local` and fill in:

```bash
# Paste your Infura URL or use https://rpc.sepolia.org
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Your wallet private key (find in MetaMask: Click 3 dots → Account Details → Export Private Key)
PRIVATE_KEY=0xYourPrivateKeyHere

# Your wallet address (the public one, starts with 0x)
NEXT_PUBLIC_PLATFORM_WALLET=0xYourWalletAddress

# Leave these empty for now
NEXT_PUBLIC_CONTRACT_ADDRESS=
CLEANUP_PRIVATE_KEY=
```

## Step 3: Deploy Contract (2 minutes)

```bash
npm install --legacy-peer-deps
npm run compile
npm run deploy
```

You'll see output like:
```
Deploying BlockVote...
Platform wallet: 0xYour...Address
BlockVote deployed: 0x9876...5432
Add to .env: NEXT_PUBLIC_CONTRACT_ADDRESS=0x9876...5432
```

**COPY THAT CONTRACT ADDRESS!** Add it to your `.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x9876...5432
```

## Step 4: Test Locally (1 minute)

```bash
npm run dev
```

Open http://localhost:3000
- Connect MetaMask
- Create a poll (costs 0.005 Sepolia ETH)
- Vote (costs 0.001 Sepolia ETH)

If it works → Ready for Vercel!

## Step 5: Deploy to Vercel FREE (3 minutes)

1. **Go to https://vercel.com**
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your `BlockVote` repository
   - Click "Import"

3. **Add Environment Variables**
   Click "Environment Variables" and add these 4:

   ```
   Name: SEPOLIA_RPC_URL
   Value: (paste from .env.local)
   ```

   ```
   Name: NEXT_PUBLIC_SEPOLIA_RPC_URL
   Value: (same as above)
   ```

   ```
   Name: NEXT_PUBLIC_CONTRACT_ADDRESS
   Value: (paste from .env.local)
   ```

   ```
   Name: NEXT_PUBLIC_PLATFORM_WALLET
   Value: (paste from .env.local)
   ```

   **Don't add PRIVATE_KEY or CLEANUP_PRIVATE_KEY to Vercel!**

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

## Your Free Vercel URL
You'll get: `https://block-vote-xyz.vercel.app`

## Limitations of Free Version

### What Works (Everything Important!)
✅ Create polls
✅ Vote on polls
✅ Live statistics
✅ Betting system
✅ Mobile support
✅ All core features

### What Doesn't Work
❌ Auto-cleanup cron job (polls stay visible after 24 hours)
  - Doesn't break anything
  - You can manually call cleanup API if needed
  - Or upgrade to $20/month Hobby plan later

## Free Tier Limits
- Vercel Free: 100GB bandwidth/month (plenty!)
- Infura Free: 100,000 requests/day (more than enough!)
- Everything else: Unlimited

## Manual Cleanup (Optional)

If you want to clean up old polls manually, just visit:
```
https://your-site.vercel.app/api/cleanup
```

Or skip it - old polls don't hurt anything!

## Costs Summary

**Right Now: $0/month**
- Vercel hosting: Free
- Infura RPC: Free
- Sepolia testnet: Free
- Domain: Free (.vercel.app)

**Future Upgrade (Optional)**
- Vercel Hobby: $20/month (for auto-cleanup cron)
- Custom domain: $12/year
- Mainnet: Real ETH costs

## What You Need From Me

Tell me:
1. ⬜ Did you get the Infura key? (or using public RPC?)
2. ⬜ Do you want to use your current wallet address for platform fees?
3. ⬜ Ready to deploy contract?

Then we'll deploy it together!

## Troubleshooting

**"Can't find module"**
```bash
npm install --legacy-peer-deps
```

**"Insufficient funds"**
- Make sure wallet has at least 0.1 Sepolia ETH
- Get more from https://sepoliafaucet.com

**"Invalid RPC URL"**
- Check URL has no spaces
- Make sure it's Sepolia network
- Try public RPC: `https://rpc.sepolia.org`

**Vercel build fails**
- Check all 4 environment variables are added
- Make sure contract is deployed first
- Review build logs in Vercel dashboard

## Ready to Deploy?

Just tell me:
1. Your RPC URL (Infura or public)
2. Your platform wallet address
3. And we'll deploy the contract!
