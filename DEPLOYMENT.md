# BlockVote Deployment Guide

## Quick Setup

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and fill in:
- `SEPOLIA_RPC_URL` - Get from Infura or Alchemy
- `PRIVATE_KEY` - Your wallet private key (for deployment)
- `NEXT_PUBLIC_PLATFORM_WALLET` - Address to receive platform fees
- `CLEANUP_PRIVATE_KEY` - Wallet for automated cleanup (can be same or different)
- `NEXT_PUBLIC_SEPOLIA_RPC_URL` - Public RPC URL (same as SEPOLIA_RPC_URL)

### 3. Deploy Smart Contract
```bash
npm run compile
npm run deploy
```

Copy the deployed contract address and add it to `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 4. Test Locally
```bash
npm run dev
```

Open http://localhost:3000

### 5. Deploy to Vercel

Push to GitHub (already done):
```bash
git push origin main
```

Then:
1. Go to vercel.com
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Deploy

The cleanup cron job will run automatically every 6 hours on Vercel.

## Key Features
- Poll creation fee: 0.005 ETH
- Voting cost: 0.001 ETH per vote
- Optional betting system with 90% payout
- Auto-cleanup after 24 hours post-completion
- Mobile MetaMask deep linking
- Fully responsive design

## Smart Contract Details
- Network: Sepolia Testnet
- Solidity: 0.8.20
- Optimized: Yes (200 runs)
- Max poll duration: 30 days (720 hours)

## Security Notes
- Never commit `.env` or `.env.local` files
- Keep private keys secure
- Test thoroughly on Sepolia before mainnet
- The platform wallet receives all platform fees
- Creator receives 90% of pool if bet wins

## Support
Check the code or contact the developer for issues.
