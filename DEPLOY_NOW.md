# Deploy Contract - Run These Commands

## Step 1: Add Your Private Key to .env.local
Open `.env.local` and replace `YOUR_PRIVATE_KEY_HERE` with your MetaMask private key

## Step 2: Run These Commands

```bash
# Make sure you're in the blockvote folder
cd C:\Users\siddh\OneDrive\Desktop\blockvote

# Install dependencies (if not done already)
npm install --legacy-peer-deps

# Compile the smart contract
npm run compile

# Deploy to Sepolia
npm run deploy
```

## Step 3: Copy the Contract Address

You'll see output like:
```
Deploying BlockVote...
Platform wallet: 0x5ce89d95b7222b3f44873cafa7166f5915b2abce
BlockVote deployed: 0xABC123...XYZ789
Add to .env: NEXT_PUBLIC_CONTRACT_ADDRESS=0xABC123...XYZ789
```

**COPY THAT CONTRACT ADDRESS!**

## Step 4: Add Contract Address

Open `.env.local` and add the contract address:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

## Step 5: Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and test:
- Connect wallet
- Create a poll
- Vote on it

## Step 6: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your `BlockVote` repository
4. Add these 4 environment variables:

```
SEPOLIA_RPC_URL = https://sepolia.infura.io/v3/fa1bc77a7a51446e9e0921d7dd313ee1

NEXT_PUBLIC_SEPOLIA_RPC_URL = https://sepolia.infura.io/v3/fa1bc77a7a51446e9e0921d7dd313ee1

NEXT_PUBLIC_CONTRACT_ADDRESS = (paste the contract address from step 3)

NEXT_PUBLIC_PLATFORM_WALLET = 0x5ce89d95b7222b3f44873cafa7166f5915b2abce
```

5. Click Deploy
6. Wait 2-3 minutes
7. Your site is LIVE! 🎉

## Troubleshooting

**"Insufficient funds"**
- Make sure your wallet has Sepolia ETH
- Get more from https://sepoliafaucet.com

**"Invalid private key"**
- Make sure it starts with 0x
- No spaces before or after
- Copy it directly from MetaMask

**"Module not found"**
- Run: `npm install --legacy-peer-deps`

**Vercel build fails**
- Check all 4 environment variables are added
- Make sure contract is deployed
- Check build logs

## Need Help?

Just let me know what error you're getting and I'll help fix it!
