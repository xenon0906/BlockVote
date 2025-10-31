# System Architecture

Visual overview of the Blockchain Voting System architecture.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (React)                 │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • Homepage (Trending/Active/Completed)               │  │
│  │  • Poll Detail Page (Vote/Candidates)                 │  │
│  │  • Leaderboard (Rankings/Stats)                       │  │
│  │  • Create Poll Modal                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Web3 Layer (Wagmi + RainbowKit)               │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  • Wallet Connection (MetaMask, WalletConnect)        │  │
│  │  • Transaction Signing                                │  │
│  │  • Contract Interactions                              │  │
│  │  • Real-time Data Fetching                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    ETHEREUM SEPOLIA TESTNET                  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │           VotingSystem Smart Contract                 │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  STORAGE:                                             │  │
│  │  • Polls mapping                                      │  │
│  │  • Candidates mapping                                 │  │
│  │  • Votes mapping                                      │  │
│  │  • User statistics                                    │  │
│  │                                                       │  │
│  │  FUNCTIONS:                                           │  │
│  │  • createPoll()                                       │  │
│  │  • addCandidate() / replaceCandidate()               │  │
│  │  • vote()                                             │  │
│  │  • endPoll() / deletePoll()                          │  │
│  │  • View functions (getPoll, getActive, etc.)         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Poll Creation Flow

```
User                    Frontend                Contract                 Blockchain
 │                         │                        │                         │
 │─[Fill Form]──────────→ │                        │                         │
 │                         │                        │                         │
 │                         │─[createPoll()]───────→│                         │
 │                         │                        │                         │
 │                         │                        │─[Store Poll Data]─────→│
 │                         │                        │                         │
 │                         │←─────[Poll ID]────────│                         │
 │                         │                        │                         │
 │←[Confirmation]─────────│                        │                         │
 │                         │                        │                         │
 │                         │←─[PollCreated Event]──│←─────[Emit Event]──────│
```

### 2. Voting Flow

```
User                    Frontend                Contract                 Blockchain
 │                         │                        │                         │
 │─[Select Candidate]────→│                        │                         │
 │                         │                        │                         │
 │                         │─[vote() + Fee]───────→│                         │
 │                         │                        │                         │
 │                         │                        │─[Verify & Record]─────→│
 │                         │                        │                         │
 │                         │                        │─[Update Stats]────────→│
 │                         │                        │                         │
 │                         │←─────[Success]────────│                         │
 │                         │                        │                         │
 │←[Vote Confirmed]───────│                        │                         │
 │                         │                        │                         │
 │                         │←─[VoteCast Event]─────│←─────[Emit Event]──────│
```

### 3. Reward Distribution Flow

```
Time Expires            Frontend                Contract                 Blockchain
 │                         │                        │                         │
 │─[Poll Ends]───────────→│                        │                         │
 │                         │                        │                         │
 │                         │─[endPoll()]──────────→│                         │
 │                         │                        │                         │
 │                         │                        │─[Calculate Winner]────→│
 │                         │                        │                         │
 │                         │                        │─[Split Rewards]───────→│
 │                         │                        │  (90% → Winner)         │
 │                         │                        │  (10% → Platform)       │
 │                         │                        │                         │
 │                         │←─[Transfer ETH]───────│                         │
 │                         │                        │                         │
 │                         │←─[PollEnded Event]────│←─────[Emit Event]──────│
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       App Layout                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Header                            │    │
│  │  • Logo                                              │    │
│  │  • Navigation (Home, Leaderboard)                    │    │
│  │  • Wallet Connect Button                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Status Bar                          │    │
│  │  [Total Polls] [Active] [Completed] [Total Votes]   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Main Content                      │    │
│  │                                                      │    │
│  │  ROUTE: /                                            │    │
│  │  ┌────────────────────────────────────────────┐     │    │
│  │  │  [Trending] [Active] [Completed]           │     │    │
│  │  ├────────────────────────────────────────────┤     │    │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐               │     │    │
│  │  │  │Poll 1│ │Poll 2│ │Poll 3│  (PollCard)   │     │    │
│  │  │  └──────┘ └──────┘ └──────┘               │     │    │
│  │  └────────────────────────────────────────────┘     │    │
│  │                                                      │    │
│  │  ROUTE: /poll/[id]                                   │    │
│  │  ┌────────────────────────────────────────────┐     │    │
│  │  │  Poll Details                              │     │    │
│  │  │  • Title, Description                      │     │    │
│  │  │  • Stats (Votes, Interactions, Time)       │     │    │
│  │  │  ┌──────────────────────────────────────┐ │     │    │
│  │  │  │  Candidate List                      │ │     │    │
│  │  │  │  • Name, Address                     │ │     │    │
│  │  │  │  • Vote Count, Progress Bar          │ │     │    │
│  │  │  │  • Vote / Replace Buttons            │ │     │    │
│  │  │  └──────────────────────────────────────┘ │     │    │
│  │  └────────────────────────────────────────────┘     │    │
│  │                                                      │    │
│  │  ROUTE: /leaderboard                                 │    │
│  │  ┌────────────────────────────────────────────┐     │    │
│  │  │  Top Voters & Winners                      │     │    │
│  │  │  #1 🏆 [Address] [Votes] [Rewards]         │     │    │
│  │  │  #2 🥈 [Address] [Votes] [Rewards]         │     │    │
│  │  │  #3 🥉 [Address] [Votes] [Rewards]         │     │    │
│  │  └────────────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              CreatePollModal (Overlay)               │    │
│  │  • Title Input                                       │    │
│  │  • Description Textarea                              │    │
│  │  • Duration Input                                    │    │
│  │  • Max Candidates Input                              │    │
│  │  • Voting Fee Input                                  │    │
│  │  • [Cancel] [Create] Buttons                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contract Structure

```
VotingSystem.sol
├── State Variables
│   ├── pollCount: uint256
│   ├── owner: address
│   ├── totalPlatformFees: uint256
│   ├── polls: mapping(uint256 => Poll)
│   ├── pollCandidates: mapping(uint256 => mapping(uint256 => Candidate))
│   ├── hasVoted: mapping(uint256 => mapping(address => bool))
│   ├── voterPayments: mapping(uint256 => mapping(address => uint256))
│   ├── userTotalVotes: mapping(address => uint256)
│   └── userTotalRewardsWon: mapping(address => uint256)
│
├── Structs
│   ├── Poll
│   │   ├── id: uint256
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── creator: address
│   │   ├── createdAt: uint256
│   │   ├── duration: uint256
│   │   ├── endTime: uint256
│   │   ├── maxCandidates: uint256
│   │   ├── votingFee: uint256
│   │   ├── totalVotes: uint256
│   │   ├── totalInteractions: uint256
│   │   ├── candidateCount: uint256
│   │   ├── isActive: bool
│   │   ├── isDeleted: bool
│   │   ├── completedAt: uint256
│   │   ├── winner: address
│   │   └── totalRewardPool: uint256
│   │
│   └── Candidate
│       ├── candidateAddress: address
│       ├── name: string
│       ├── voteCount: uint256
│       └── exists: bool
│
├── Events
│   ├── PollCreated(pollId, title, creator, duration, maxCandidates, votingFee)
│   ├── CandidateAdded(pollId, candidateIndex, candidateAddress, name)
│   ├── CandidateReplaced(pollId, candidateIndex, oldCandidate, newCandidate, payment)
│   ├── VoteCast(pollId, voter, candidateIndex, fee)
│   ├── PollEnded(pollId, winner, rewardAmount)
│   ├── PollDeleted(pollId, creator)
│   └── RefundIssued(pollId, voter, amount)
│
├── Modifiers
│   ├── onlyOwner()
│   ├── pollExists(pollId)
│   └── pollActive(pollId)
│
├── Write Functions
│   ├── createPoll()
│   ├── addCandidate()
│   ├── replaceCandidate()
│   ├── vote()
│   ├── endPoll()
│   ├── deletePoll()
│   ├── claimRefund()
│   └── withdrawPlatformFees()
│
└── View Functions
    ├── getPoll()
    ├── getCandidate()
    ├── getAllCandidates()
    ├── getActivePolls()
    ├── getCompletedPolls()
    ├── getTrendingPolls()
    ├── getUserStats()
    └── getTotalStats()
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                          │
├─────────────────────────────────────────────────────────────┤
│  Framework:        Next.js 15 (React 18)                    │
│  Language:         TypeScript                                │
│  Styling:          Tailwind CSS                              │
│  Animations:       Framer Motion                             │
│  Icons:            Lucide React                              │
│  Fonts:            Google Fonts (Inter)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       WEB3 STACK                             │
├─────────────────────────────────────────────────────────────┤
│  Wallet UI:        RainbowKit v2                             │
│  React Hooks:      Wagmi v2                                  │
│  Ethereum Client:  Viem v2                                   │
│  State Management: TanStack React Query                      │
│  Date Handling:    date-fns                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN STACK                          │
├─────────────────────────────────────────────────────────────┤
│  Smart Contract:   Solidity 0.8.24                           │
│  Development:      Hardhat                                   │
│  Testing:          Hardhat Toolbox                           │
│  Deployment:       Hardhat Deploy Scripts                    │
│  Network:          Sepolia Testnet                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT TOOLS                         │
├─────────────────────────────────────────────────────────────┤
│  Package Manager:  npm                                       │
│  Linter:           ESLint                                    │
│  Formatter:        Prettier (via ESLint)                     │
│  Type Checking:    TypeScript                                │
│  Build Tool:       Next.js Compiler (Turbopack)              │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT FLOW                          │
└─────────────────────────────────────────────────────────────┘

1. LOCAL DEVELOPMENT
   ├── npm run dev (Next.js dev server on localhost:3000)
   ├── HMR (Hot Module Replacement)
   └── Local state management

2. CONTRACT DEVELOPMENT
   ├── Write Solidity code
   ├── npm run compile (Hardhat compile)
   ├── Local testing (optional)
   └── npm run deploy (Deploy to Sepolia)

3. FRONTEND DEPLOYMENT (Production)
   ├── npm run build (Create production build)
   ├── Deploy to Vercel/Netlify/AWS
   └── Set environment variables

┌─────────────────────────────────────────────────────────────┐
│                    NETWORK TOPOLOGY                          │
└─────────────────────────────────────────────────────────────┘

User's Browser
      │
      ├─→ Frontend (Next.js App)
      │   └─→ Static Assets (CDN)
      │
      └─→ Web3 Provider (RPC)
          └─→ Sepolia Testnet
              └─→ VotingSystem Contract
                  ├─→ State Storage
                  └─→ Event Logs
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

LAYER 1: SMART CONTRACT
├── Access Control
│   ├── onlyOwner modifier for admin functions
│   ├── pollExists validation
│   └── pollActive checks
│
├── Reentrancy Protection
│   ├── Checks-effects-interactions pattern
│   └── No external calls before state updates
│
├── Input Validation
│   ├── require statements for all inputs
│   ├── Range checks for amounts
│   └── Address validation
│
└── Safe Math
    ├── Solidity 0.8.x (built-in overflow protection)
    └── Explicit checks for critical calculations

LAYER 2: WEB3 INTEGRATION
├── Transaction Verification
│   ├── User signature required
│   ├── Network validation (Sepolia only)
│   └── Gas estimation before submission
│
├── Data Validation
│   ├── Address format checks
│   ├── Amount parsing validation
│   └── Contract address verification
│
└── Error Handling
    ├── Transaction failure recovery
    ├── User-friendly error messages
    └── Retry mechanisms

LAYER 3: FRONTEND
├── Input Sanitization
│   ├── Form validation
│   ├── XSS prevention
│   └── SQL injection prevention (N/A - no database)
│
├── State Management
│   ├── Read-only contract calls
│   ├── Optimistic updates
│   └── State synchronization
│
└── Environment Security
    ├── Environment variables
    ├── No private keys in frontend
    └── API key protection
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                   PERFORMANCE STRATEGIES                     │
└─────────────────────────────────────────────────────────────┘

FRONTEND OPTIMIZATIONS
├── Code Splitting
│   ├── Route-based splitting (Next.js automatic)
│   ├── Component lazy loading
│   └── Dynamic imports
│
├── Data Fetching
│   ├── React Query caching
│   ├── Stale-while-revalidate
│   └── Parallel requests
│
├── Rendering
│   ├── Server-side rendering (SSR)
│   ├── Static generation where possible
│   └── Client-side hydration
│
└── Assets
    ├── Image optimization (Next.js)
    ├── CSS minification
    └── Tree shaking

SMART CONTRACT OPTIMIZATIONS
├── Storage
│   ├── Packed structs
│   ├── Efficient mappings
│   └── Minimal storage writes
│
├── Gas Optimization
│   ├── View functions (no gas)
│   ├── Batch operations
│   └── Optimized loops
│
└── Caching
    ├── Read-heavy operations
    ├── Event indexing
    └── Off-chain computation where possible

BLOCKCHAIN INTERACTIONS
├── Transaction Batching
│   ├── Multiple operations in one tx
│   └── Multicall support (future)
│
├── Query Optimization
│   ├── Efficient RPC calls
│   ├── Local caching
│   └── Indexed events
│
└── Network Efficiency
    ├── WebSocket connections
    ├── Block number tracking
    └── Event filtering
```

## Monitoring & Analytics

```
┌─────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY                             │
└─────────────────────────────────────────────────────────────┘

CONTRACT EVENTS (On-chain)
├── PollCreated → Track poll creation rate
├── VoteCast → Monitor voting activity
├── PollEnded → Track completion rate
└── All events indexed by pollId, user address

FRONTEND ANALYTICS (Potential)
├── Page views
├── User interactions
├── Transaction success/failure rates
└── Average session duration

BLOCKCHAIN METRICS
├── Gas usage per function
├── Transaction confirmation times
├── Contract interaction frequency
└── Active user count

ERROR TRACKING
├── Contract revert reasons
├── Transaction failures
├── Frontend exceptions
└── User error patterns
```

This architecture provides a scalable, secure, and performant blockchain voting system ready for production use on Sepolia testnet!
