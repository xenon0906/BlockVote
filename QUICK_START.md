# BlockVote - Quick Start Guide

## What You Need Before Deploying

### 1. Get Free Resources (10 minutes)
- **Infura Account**: Go to https://infura.io → Sign up → Create project → Copy Sepolia RPC URL
- **Sepolia ETH**: Visit https://sepoliafaucet.com → Connect wallet → Get 0.1 ETH (free)
- **Vercel Account**: Go to https://vercel.com → Sign up with GitHub

### 2. Wallet Setup (5 minutes)
You need 3 wallet addresses:
- **Deployer Wallet**: Your main wallet (needs private key + Sepolia ETH)
- **Platform Wallet**: Where fees are collected (just address needed)
- **Cleanup Wallet**: For automated cleanup (needs private key + 0.01 ETH)

*Tip: Platform and Cleanup can be the same wallet*

## Deploy in 3 Steps (15 minutes)

### STEP 1: Deploy Smart Contract Locally

```bash
# Clone if not already
cd blockvote

# Create environment file
cp .env.example .env.local

# Edit .env.local with these 6 values:
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_deployer_wallet_private_key
NEXT_PUBLIC_PLATFORM_WALLET=0xYourPlatformWalletAddress
CLEANUP_PRIVATE_KEY=your_cleanup_wallet_private_key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Deploy
npm install --legacy-peer-deps
npm run compile
npm run deploy
```

**IMPORTANT**: Copy the contract address from output and add to .env.local:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

### STEP 2: Test Locally (2 minutes)

```bash
npm run dev
```
- Go to http://localhost:3000
- Connect MetaMask
- Create a test poll
- If it works, proceed to Vercel!

### STEP 3: Deploy to Vercel (5 minutes)

1. Go to https://vercel.com/new
2. Import your GitHub repository `BlockVote`
3. Click "Environment Variables"
4. Add these 6 variables (copy from .env.local):
   ```
   SEPOLIA_RPC_URL
   PRIVATE_KEY
   NEXT_PUBLIC_CONTRACT_ADDRESS
   NEXT_PUBLIC_PLATFORM_WALLET
   CLEANUP_PRIVATE_KEY
   NEXT_PUBLIC_SEPOLIA_RPC_URL
   ```
5. Click "Deploy"
6. Wait 2-3 minutes
7. Done! Your site is live!

## Costs

**EVERYTHING IS FREE TO START:**
- Hosting: Vercel Free tier
- Blockchain: Sepolia testnet (free)
- RPC: Infura free tier (100k requests/day)
- Domain: yourproject.vercel.app (free)

**Optional paid features:**
- Vercel Hobby ($20/month): Enables automated cleanup cron job
- Custom domain: ~$12/year
- Mainnet deployment: Real ETH costs (when ready)

## What Each File Does

```
contracts/BlockVote.sol       → Smart contract (on blockchain)
app/page.tsx                  → Homepage with polls
components/PollCard.tsx       → Individual poll display
components/CreatePollModal.tsx → Create new poll form
utils/wallet.ts               → MetaMask connection
utils/contract.ts             → Blockchain interactions
app/api/cleanup/route.ts      → Auto-delete old polls
```

## Common Issues & Fixes

### "Build failed on Vercel"
→ Check all 6 environment variables are added

### "Can't connect MetaMask"
→ Switch to Sepolia network in MetaMask

### "Transaction failed"
→ Make sure you have Sepolia ETH

### "Cron job not running"
→ Upgrade to Vercel Hobby plan ($20/month) or it won't auto-cleanup

## After Deployment

### Test Your Live Site
1. Visit your Vercel URL
2. Connect MetaMask (Sepolia network)
3. Create poll: Costs 0.005 ETH
4. Vote: Costs 0.001 ETH
5. Check stats update in real-time

### Share With Users
- Send them your Vercel URL
- They need MetaMask + Sepolia ETH
- Mobile users: Install MetaMask app first

### Monitor
- **Vercel Dashboard**: Check traffic and errors
- **Sepolia Etherscan**: Search your contract address
- **Platform Wallet**: Watch fees accumulate

## Need Help?

**Read in order:**
1. `CHECKLIST.md` - Complete step-by-step checklist
2. `VERCEL_SETUP.md` - Detailed Vercel configuration
3. `DEPLOYMENT.md` - Full deployment guide
4. `README.md` - Technical overview

**Get Sepolia ETH:**
- https://sepoliafaucet.com
- https://sepolia-faucet.pk910.de
- https://www.infura.io/faucet/sepolia

**Check Contract:**
- Sepolia Etherscan: https://sepolia.etherscan.io
- Search your contract address
- View all transactions and events

## Going to Mainnet (Later)

When ready for real money (Ethereum mainnet):
1. Change RPC to mainnet
2. Deploy new contract (costs ~$50-100)
3. Update NEXT_PUBLIC_CONTRACT_ADDRESS
4. Redeploy on Vercel
5. Users now pay real ETH!

**Current setup is perfect for testing and demos!**
