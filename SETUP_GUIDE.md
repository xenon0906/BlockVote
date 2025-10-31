# Setup Guide - What You Need

Follow these steps to get everything you need:

## Step 1: Get Alchemy RPC URL (2 minutes)

1. Go to https://www.alchemy.com/
2. Click "Sign Up" or "Login"
3. Create a free account
4. Click "Create New App"
5. Fill in:
   - Name: "Voting System"
   - Chain: Ethereum
   - Network: Sepolia
6. Click "Create App"
7. Click "View Key"
8. Copy the "HTTPS" URL (looks like: https://eth-sepolia.g.alchemy.com/v2/XXXXX)

**Copy this URL - you'll need it!**

---

## Step 2: Get MetaMask Private Key (1 minute)

⚠️ **WARNING: Keep this PRIVATE! Never share it!**

1. Open MetaMask browser extension
2. Click the 3 dots (top right)
3. Click "Account Details"
4. Click "Show Private Key"
5. Enter your MetaMask password
6. Click "Confirm"
7. Copy the private key (long string starting with 0x)

**Copy this key - you'll need it!**

---

## Step 3: Get WalletConnect Project ID (2 minutes)

1. Go to https://cloud.walletconnect.com/
2. Click "Sign Up" (use GitHub or Email)
3. Create account
4. Click "Create New Project"
5. Name it: "Blockchain Voting"
6. Copy the "Project ID" (looks like: a1b2c3d4e5f6...)

**Copy this ID - you'll need it!**

---

## Step 4: Get Sepolia ETH (2 minutes) - FREE!

1. Make sure MetaMask is on Sepolia network:
   - Click network dropdown in MetaMask
   - Select "Sepolia" (if not visible, enable "Show test networks" in settings)

2. Get free Sepolia ETH:
   - Go to https://sepoliafaucet.com/
   - Enter your wallet address (copy from MetaMask)
   - Complete login/CAPTCHA
   - Click "Send Me ETH"
   - Wait 30 seconds - you'll get 0.5 ETH (FREE!)

---

## What I Need From You:

Please provide these 3 things:

1. **Alchemy RPC URL**: https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY_HERE
2. **MetaMask Private Key**: 0xYOUR_PRIVATE_KEY_HERE
3. **WalletConnect Project ID**: your_project_id_here

**Note:** The contract address will be generated automatically after deployment!

---

## Optional: Use Demo Values (Quick Start)

If you want to test quickly without setting up accounts, I can use demo RPC URLs temporarily, but you'll still need:
- Your MetaMask private key (for deployment)
- Sepolia ETH in that wallet (from faucet)
