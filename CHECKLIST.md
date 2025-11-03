# Pre-Deployment Checklist

## Before You Start

### 1. Get Sepolia ETH
- [ ] Visit https://sepoliafaucet.com or https://sepolia-faucet.pk910.de
- [ ] Get at least 0.1 ETH for deployment and testing
- [ ] Have extra wallet for cleanup with 0.01 ETH

### 2. Get RPC Provider
- [ ] Sign up at https://infura.io or https://alchemy.com
- [ ] Create a new project
- [ ] Copy Sepolia RPC URL

### 3. Prepare Wallets
- [ ] Main wallet for deployment (with private key)
- [ ] Platform wallet address (to receive fees)
- [ ] Cleanup wallet (with private key, for cron job)

## Deployment Steps

### Step 1: Deploy Smart Contract
```bash
# In your local project
cp .env.example .env.local

# Edit .env.local with:
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_deployer_private_key
NEXT_PUBLIC_PLATFORM_WALLET=your_platform_wallet_address

# Compile and deploy
npm run compile
npm run deploy

# Copy the deployed contract address
```

### Step 2: Update Environment
- [ ] Add contract address to .env.local as NEXT_PUBLIC_CONTRACT_ADDRESS
- [ ] Add CLEANUP_PRIVATE_KEY
- [ ] Add NEXT_PUBLIC_SEPOLIA_RPC_URL (same as SEPOLIA_RPC_URL)

### Step 3: Test Locally
```bash
npm run dev
```
- [ ] Open http://localhost:3000
- [ ] Connect MetaMask
- [ ] Create a test poll
- [ ] Vote on the poll
- [ ] Check if everything works

### Step 4: Prepare for Vercel
- [ ] All changes committed to GitHub
- [ ] .env.local NOT in git (it shouldn't be)
- [ ] Contract verified on Sepolia Etherscan (optional but recommended)

### Step 5: Deploy to Vercel
1. [ ] Go to https://vercel.com
2. [ ] Import GitHub repository
3. [ ] Add ALL 6 environment variables
4. [ ] Deploy
5. [ ] Wait for build to complete

### Step 6: Verify Production
- [ ] Visit your Vercel URL
- [ ] Connect MetaMask
- [ ] Create a poll (costs 0.005 ETH + 0.001 if betting)
- [ ] Vote on poll (costs 0.001 ETH)
- [ ] Check live stats update
- [ ] Test on mobile

## Environment Variables Required

Copy these EXACTLY to Vercel:

```
SEPOLIA_RPC_URL
PRIVATE_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS
NEXT_PUBLIC_PLATFORM_WALLET
CLEANUP_PRIVATE_KEY
NEXT_PUBLIC_SEPOLIA_RPC_URL
```

**IMPORTANT**: Add to all environments (Production, Preview, Development)

## Troubleshooting

### Build Fails on Vercel
- Check environment variables are set
- Verify .npmrc file exists
- Check vercel.json configuration
- Review build logs

### Can't Connect Wallet
- Check MetaMask is on Sepolia network
- Verify NEXT_PUBLIC_CONTRACT_ADDRESS is correct
- Clear browser cache
- Try different browser

### Contract Calls Fail
- Verify contract is deployed
- Check on Sepolia Etherscan
- Ensure RPC URL is working
- Verify wallet has ETH for gas

### Mobile Not Working
- Install MetaMask mobile app
- Use the deep link redirect
- Try opening in MetaMask browser

## Post-Deployment

### Monitor
- [ ] Check Vercel Analytics
- [ ] Monitor contract on Etherscan
- [ ] Track platform wallet balance
- [ ] Review cron job logs

### Optional Improvements
- [ ] Add custom domain
- [ ] Set up analytics
- [ ] Enable error tracking (Sentry)
- [ ] Add more social features

## Cost Summary

**Development:**
- Sepolia ETH: FREE (from faucets)
- Infura/Alchemy: FREE tier sufficient

**Production:**
- Vercel Hobby: $20/month (for cron jobs)
- Or Vercel Free: $0 (without automated cleanup)

## Support Resources
- Vercel Docs: https://vercel.com/docs
- Hardhat Docs: https://hardhat.org/docs
- Ethers.js Docs: https://docs.ethers.org
- Next.js Docs: https://nextjs.org/docs

## Final Check
- [ ] Smart contract deployed ✓
- [ ] Local testing passed ✓
- [ ] All env vars in Vercel ✓
- [ ] Production site live ✓
- [ ] Wallet connects ✓
- [ ] Polls working ✓
- [ ] Voting working ✓
- [ ] Mobile working ✓

**You're all set! Your BlockVote platform is live!**
