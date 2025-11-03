# Vercel Deployment Setup

## Prerequisites
1. Deploy your smart contract to Sepolia first
2. Have all environment variable values ready
3. GitHub repository already set up (done)

## Step-by-Step Vercel Deployment

### 1. Go to Vercel
- Visit https://vercel.com
- Sign in with your GitHub account

### 2. Import Repository
- Click "Add New" → "Project"
- Find and select your `BlockVote` repository
- Click "Import"

### 3. Configure Project
- Framework Preset: Next.js (auto-detected)
- Root Directory: `./` (leave as default)
- Build Command: `npm run build` (auto-configured)
- Install Command: `npm install --legacy-peer-deps` (configured in vercel.json)

### 4. Environment Variables
Click "Environment Variables" and add these (CRITICAL - ALL REQUIRED):

#### Required for Production
```
SEPOLIA_RPC_URL
Value: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

```
PRIVATE_KEY
Value: your_deployer_wallet_private_key
```

```
NEXT_PUBLIC_CONTRACT_ADDRESS
Value: 0xYOUR_DEPLOYED_CONTRACT_ADDRESS
```

```
NEXT_PUBLIC_PLATFORM_WALLET
Value: 0xYOUR_PLATFORM_WALLET_ADDRESS
```

```
CLEANUP_PRIVATE_KEY
Value: your_cleanup_wallet_private_key
```

```
NEXT_PUBLIC_SEPOLIA_RPC_URL
Value: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
(Same as SEPOLIA_RPC_URL for public access)
```

**IMPORTANT**:
- Add these to "Production", "Preview", AND "Development" environments
- Never share these values publicly
- The cleanup wallet needs some ETH for gas fees

### 5. Deploy
- Click "Deploy"
- Wait 2-3 minutes for build to complete
- Your site will be live at `https://your-project.vercel.app`

### 6. Configure Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

### 7. Enable Cron Job
- Cron jobs are automatically enabled on paid plans
- For free tier: Upgrade to Hobby ($20/month) or Pro plan
- Alternative for free tier: Use external cron service to hit `/api/cleanup` endpoint

### 8. Verify Deployment
1. Visit your deployed URL
2. Connect MetaMask wallet
3. Try creating a test poll
4. Check if voting works
5. Verify transaction on Sepolia Etherscan

## Post-Deployment Checklist
- [ ] All environment variables added correctly
- [ ] Smart contract deployed on Sepolia
- [ ] Contract address matches in .env
- [ ] Platform wallet address is correct
- [ ] Cleanup wallet has some ETH for gas
- [ ] MetaMask connects successfully
- [ ] Poll creation works
- [ ] Voting works
- [ ] Live stats update correctly
- [ ] Mobile MetaMask redirect works
- [ ] Cron job is active (check Vercel dashboard)

## Troubleshooting

### Build Fails
- Check if all environment variables are set
- Verify `npm install --legacy-peer-deps` in vercel.json
- Check build logs in Vercel dashboard

### Contract Interaction Fails
- Verify NEXT_PUBLIC_CONTRACT_ADDRESS is correct
- Check RPC URL is valid
- Ensure contract is deployed on Sepolia
- Verify wallet has Sepolia ETH

### Cron Job Not Running
- Check Vercel plan (cron needs Hobby or higher for free)
- Verify cron configuration in vercel.json
- Check function logs in Vercel dashboard
- Ensure CLEANUP_PRIVATE_KEY wallet has ETH

### MetaMask Won't Connect
- Check if Sepolia network is added
- Verify browser allows MetaMask extension
- On mobile, ensure MetaMask app is installed
- Clear browser cache and try again

## Cost Breakdown
- **Vercel Free**: Hosting + bandwidth (cron requires upgrade)
- **Vercel Hobby**: $20/month (includes cron jobs)
- **Infura Free**: 100k requests/day (sufficient for testing)
- **Sepolia Gas**: Free (testnet ETH from faucets)

## Getting Sepolia ETH
1. https://sepoliafaucet.com
2. https://sepolia-faucet.pk910.de
3. https://www.infura.io/faucet/sepolia

You'll need:
- Sepolia ETH for contract deployment (~0.05 ETH)
- Sepolia ETH for creating polls (~0.006 ETH per poll)
- Sepolia ETH for cleanup wallet (~0.01 ETH for gas)

## Monitoring
- Check Vercel Analytics for traffic
- Monitor contract on Sepolia Etherscan
- View cron job logs in Vercel Functions
- Track platform wallet balance for fees collected

## Support
If deployment fails, check:
1. Vercel build logs
2. Browser console for errors
3. Contract on Sepolia Etherscan
4. Environment variables are all set correctly
