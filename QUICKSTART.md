# Quick Start Guide

Get your blockchain voting system running in 5 minutes!

## Step 1: Get Free Test ETH (2 minutes)

1. Install [MetaMask](https://metamask.io/) browser extension
2. Create a wallet (save your seed phrase safely!)
3. Switch to Sepolia network:
   - Click network dropdown → Show test networks → Sepolia
4. Get free Sepolia ETH:
   - Visit [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
   - Enter your wallet address
   - Receive 0.5 Sepolia ETH instantly

## Step 2: Setup Project (1 minute)

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/demo
PRIVATE_KEY=your_metamask_private_key_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=demo
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

**Get your private key from MetaMask:**
Account Details → Export Private Key → Enter password → Copy

## Step 3: Deploy Contract (1 minute)

```bash
# Compile
npm run compile

# Deploy to Sepolia
npm run deploy
```

Copy the contract address from output and add to `.env`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

## Step 4: Run Application (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test It Out! (1 minute)

1. Click "Connect Wallet" → MetaMask
2. Click "Create New Poll"
3. Fill in details:
   - Title: "Best Programming Language"
   - Description: "Vote for your favorite!"
   - Duration: 7 days
   - Max Candidates: 5
   - Voting Fee: 0.001 ETH
4. Confirm transaction
5. Add yourself as a candidate
6. Vote!

## Done! 🎉

Your blockchain voting system is now live on Sepolia testnet!

### What's Next?

- Share the URL with friends (they need Sepolia ETH too)
- Create more polls
- Check the leaderboard
- View trending polls
- Test the candidate replacement feature

### Need Help?

- Check the full [README.md](README.md) for detailed docs
- Make sure you're on Sepolia network
- Ensure you have enough Sepolia ETH for gas fees
- Each transaction needs a small amount of ETH for gas

### Pro Tips

- Keep 0.1 ETH in your wallet for multiple transactions
- Voting fee goes to the winner (90%) and platform (10%)
- Poll creators can delete polls and refund voters
- All transactions are on-chain and transparent
- This is a TESTNET - it's completely free!

Enjoy your decentralized voting platform! 🚀
