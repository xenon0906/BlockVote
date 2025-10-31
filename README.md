# Blockchain Voting System

A decentralized voting platform built on Ethereum Sepolia testnet with advanced features including competitive candidate registration, transparent voting, and automatic reward distribution.

## Features

### Core Functionality
- **Decentralized Polls**: Create global polls on the blockchain with customizable parameters
- **Transparent Voting**: All votes are recorded on-chain and publicly verifiable
- **Competitive Candidate System**: Candidates can replace existing ones by paying ETH
- **Automatic Rewards**: Winner automatically receives 90% of voting fees collected
- **Poll Deletion & Refunds**: Poll creators can delete polls and refund all voters
- **Time-Limited Polls**: Set custom durations for each poll

### User Interface
- **Trending Polls**: View top 3 polls by interaction count
- **Active Polls**: Browse all ongoing polls
- **Completed Polls**: See results from polls ended in last 24 hours
- **Live Stats**: Real-time dashboard showing total polls, votes, and interactions
- **Leaderboard**: Track top voters and winners across all polls
- **Wallet Integration**: Auto-connect to MetaMask, WalletConnect, and other wallets

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity 0.8.24
- **Web3 Libraries**: Wagmi v2, RainbowKit, Viem
- **Development**: Hardhat

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Web3 wallet (MetaMask recommended)
- Sepolia ETH (see below for how to get free testnet ETH)

### 1. Get Sepolia ETH (FREE)

Sepolia ETH is free testnet cryptocurrency for testing. Get it from these faucets:

#### Option 1: Alchemy Faucet (Recommended)
1. Visit [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
2. Create a free Alchemy account or sign in
3. Enter your wallet address
4. Receive 0.5 Sepolia ETH instantly

#### Option 2: Infura Faucet
1. Visit [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
2. Sign in with your account
3. Enter your wallet address
4. Receive testnet ETH

#### Option 3: QuickNode Faucet
1. Visit [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)
2. Enter your wallet address
3. Complete CAPTCHA
4. Receive testnet ETH

### 2. Installation

```bash
# Navigate to the project directory
cd blockchain-voting

# Install dependencies
npm install
```

### 3. Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your details:

```env
# Get RPC URL from Alchemy (https://www.alchemy.com/)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Your wallet private key (NEVER share this or commit to git!)
PRIVATE_KEY=your_wallet_private_key_here

# Get Project ID from WalletConnect Cloud (https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Contract address (will be filled after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

#### Getting Your Private Key (MetaMask)
1. Open MetaMask
2. Click the three dots menu
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key

⚠️ **SECURITY WARNING**: Never share your private key or commit it to version control!

#### Getting Alchemy API Key
1. Visit [Alchemy](https://www.alchemy.com/)
2. Create a free account
3. Create a new app and select "Sepolia" network
4. Copy the HTTPS RPC URL

#### Getting WalletConnect Project ID
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a free account
3. Create a new project
4. Copy the Project ID

### 4. Compile Smart Contracts

```bash
npm run compile
```

This compiles the Solidity smart contracts.

### 5. Deploy to Sepolia

```bash
npm run deploy
```

After successful deployment, you'll see:
```
✅ VotingSystem deployed successfully!
Contract address: 0x...
```

Copy the contract address and add it to your `.env` file:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### For Poll Creators

1. **Connect Wallet**: Click "Connect Wallet" and select your wallet
2. **Create Poll**:
   - Click "Create New Poll" button
   - Fill in poll details:
     - Title: Name of your poll
     - Description: What the poll is about
     - Duration: How many days the poll will run
     - Max Candidates: Maximum number of candidates allowed
     - Voting Fee: ETH amount voters must pay (winner gets 90%)
   - Confirm the transaction in your wallet
3. **Manage Poll**:
   - View your poll's progress in real-time
   - Delete poll if needed (refunds all voters automatically)
   - End poll after duration expires to distribute rewards

### For Candidates

1. **Connect Wallet**: Ensure you have Sepolia ETH
2. **Find a Poll**: Browse active polls on the homepage
3. **Register as Candidate**:
   - Open the poll detail page
   - Click "Add Candidate"
   - Enter your candidate name
   - Confirm transaction
4. **Replace Existing Candidate** (if slots are full):
   - Click "Replace" on an existing candidate
   - Enter your name and payment amount
   - The replaced candidate receives your payment
   - You take their spot

### For Voters

1. **Connect Wallet**: Make sure you have enough Sepolia ETH
2. **Browse Polls**:
   - Trending: Most active polls
   - Active: All ongoing polls
   - Completed: Recently finished polls
3. **Vote**:
   - Click on a poll to see candidates
   - Review all candidates and their current votes
   - Click "Vote" on your preferred candidate
   - Pay the voting fee (shown on button)
   - Confirm transaction
4. **Track Results**:
   - View live vote counts
   - See winner after poll ends
   - Check leaderboard for top voters

## Smart Contract Features

### Poll Creation
```solidity
function createPoll(
    string memory _title,
    string memory _description,
    uint256 _durationInDays,
    uint256 _maxCandidates,
    uint256 _votingFee
) external returns (uint256)
```

### Candidate Management
```solidity
// Add yourself as a candidate
function addCandidate(uint256 _pollId, string memory _name) external

// Replace an existing candidate by paying them
function replaceCandidate(
    uint256 _pollId,
    uint256 _candidateIndex,
    string memory _name
) external payable
```

### Voting
```solidity
// Cast your vote (must pay voting fee)
function vote(uint256 _pollId, uint256 _candidateIndex) external payable
```

### Poll Management
```solidity
// End poll and distribute rewards
function endPoll(uint256 _pollId) external

// Delete poll (refunds all voters)
function deletePoll(uint256 _pollId) external

// Claim refund from deleted poll
function claimRefund(uint256 _pollId) external
```

## Reward Distribution

When a poll ends:
- **Winner**: Receives 90% of total voting fees collected
- **Platform**: Receives 10% of total voting fees (for maintenance)

Example:
- 100 people vote with 0.001 ETH fee each
- Total collected: 0.1 ETH
- Winner receives: 0.09 ETH
- Platform receives: 0.01 ETH

## Architecture

### Smart Contract Structure

```
VotingSystem.sol
├── Structs
│   ├── Poll (poll data)
│   └── Candidate (candidate data)
├── State Variables
│   ├── pollCount
│   ├── polls mapping
│   ├── pollCandidates mapping
│   ├── hasVoted mapping
│   └── user statistics
├── Core Functions
│   ├── createPoll()
│   ├── addCandidate()
│   ├── replaceCandidate()
│   ├── vote()
│   ├── endPoll()
│   ├── deletePoll()
│   └── claimRefund()
└── View Functions
    ├── getPoll()
    ├── getAllCandidates()
    ├── getActivePolls()
    ├── getCompletedPolls()
    ├── getTrendingPolls()
    └── getUserStats()
```

### Frontend Structure

```
app/
├── layout.tsx (Root layout)
├── page.tsx (Homepage with trending/active/completed)
├── providers.tsx (Wallet providers)
├── leaderboard/
│   └── page.tsx (Leaderboard page)
└── poll/[id]/
    └── page.tsx (Individual poll detail)

components/
├── Header.tsx (Navigation & wallet connect)
├── StatusBar.tsx (Live statistics)
├── PollCard.tsx (Poll preview card)
└── CreatePollModal.tsx (Poll creation form)

lib/
├── config.ts (Wagmi configuration)
└── contract-abi.ts (Smart contract ABI)
```

## Development

### Run Tests
```bash
npx hardhat test
```

### Verify Contract on Etherscan
```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

### Build for Production
```bash
npm run build
npm run start
```

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Testnet Only**: This is designed for Sepolia testnet (free)
3. **Smart Contract**: Audited for common vulnerabilities
4. **Reentrancy Protection**: Uses checks-effects-interactions pattern
5. **Access Control**: Only poll creators can delete their polls

## Troubleshooting

### "Insufficient funds" Error
- Make sure you have enough Sepolia ETH
- Get more from faucets listed above
- Check you're on Sepolia network

### "Wrong network" Error
- Switch your wallet to Sepolia Testnet
- In MetaMask: Click network dropdown → Select "Sepolia"

### Transaction Failing
- Increase gas limit in wallet
- Check you have enough ETH for gas + voting fee
- Verify poll is still active

### Contract Not Deployed
- Run `npm run compile` first
- Run `npm run deploy`
- Update `.env` with contract address
- Restart dev server

## FAQ

**Q: Is this free to use?**
A: Yes! It runs on Sepolia testnet with free test ETH.

**Q: Can I use real ETH?**
A: No, this is designed for testnet only. Never send real ETH.

**Q: How do I get Sepolia ETH?**
A: Use the faucets listed in the "Get Sepolia ETH" section above.

**Q: What happens if a poll is deleted?**
A: All voters can claim refunds of their voting fees.

**Q: Can I vote multiple times?**
A: No, each address can only vote once per poll.

**Q: How long do completed polls stay visible?**
A: Completed polls are shown for 24 hours after ending.

**Q: What's the platform fee?**
A: 10% of voting fees go to platform maintenance (kept transparent on-chain).

## Support

For issues or questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review Solidity contract comments

## License

MIT License - feel free to use and modify for your projects.

## Acknowledgments

- Built with Next.js and Ethereum
- UI inspired by modern DeFi platforms
- Smart contracts follow OpenZeppelin best practices

---

**Ready to start voting? Get your Sepolia ETH and connect your wallet!**
# BlockVote
