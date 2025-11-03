# BlockVote

A decentralized polling platform built on Ethereum Sepolia testnet.

## What is BlockVote?

BlockVote lets you create polls and vote using cryptocurrency. You can bet on poll outcomes and earn ETH if you're right.

## Features

- Create polls with 2-6 options
- Set custom poll duration (max 30 days)
- Vote for 0.001 ETH per vote
- Bet on outcomes and win 90% of the pool
- Mobile-friendly with MetaMask support
- Automatic cleanup after 24 hours of completion

## Getting Started

### Requirements

- Node.js 18+
- MetaMask wallet
- Sepolia ETH (get from faucet)

### Installation

```bash
npm install
```

### Setup Environment

Create a `.env.local` file:

```
SEPOLIA_RPC_URL=your_rpc_url_here
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=contract_address_after_deploy
NEXT_PUBLIC_PLATFORM_WALLET=your_platform_wallet_address
CLEANUP_PRIVATE_KEY=wallet_for_cleanup_tasks
```

### Deploy Contract

```bash
npm run compile
npm run deploy
```

Copy the deployed contract address to `NEXT_PUBLIC_CONTRACT_ADDRESS` in your `.env.local`.

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## How It Works

1. **Create a Poll**: Pay 0.005 ETH platform fee. Optionally bet 0.001 ETH on an option.
2. **Vote**: Anyone can vote for 0.001 ETH per vote.
3. **Results**: After the poll expires, the winner is determined.
4. **Payouts**: If creator bet correctly, they get 90% of the pool. Otherwise, everything goes to the platform.
5. **Cleanup**: Polls are auto-deleted 24 hours after completion.

## Costs

- Platform fee: 0.005 ETH
- Vote cost: 0.001 ETH
- Optional bet: 0.001 ETH

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Solidity
- Hardhat
- ethers.js

## License

MIT

## Support

For issues or questions, check the code or contact the developer.
