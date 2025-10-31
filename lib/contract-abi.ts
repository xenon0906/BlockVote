export const VOTING_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "pollId", "type": "uint256"},
      {"indexed": false, "name": "candidateIndex", "type": "uint256"},
      {"indexed": true, "name": "candidateAddress", "type": "address"},
      {"indexed": false, "name": "name", "type": "string"}
    ],
    "name": "CandidateAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "pollId", "type": "uint256"},
      {"indexed": false, "name": "candidateIndex", "type": "uint256"},
      {"indexed": true, "name": "oldCandidate", "type": "address"},
      {"indexed": true, "name": "newCandidate", "type": "address"},
      {"indexed": false, "name": "payment", "type": "uint256"}
    ],
    "name": "CandidateReplaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "pollId", "type": "uint256"},
      {"indexed": false, "name": "title", "type": "string"},
      {"indexed": true, "name": "creator", "type": "address"},
      {"indexed": false, "name": "duration", "type": "uint256"},
      {"indexed": false, "name": "maxCandidates", "type": "uint256"},
      {"indexed": false, "name": "votingFee", "type": "uint256"}
    ],
    "name": "PollCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "pollId", "type": "uint256"},
      {"indexed": true, "name": "creator", "type": "address"}
    ],
    "name": "PollDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "pollId", "type": "uint256"},
      {"indexed": true, "name": "winner", "type": "address"},
      {"indexed": false, "name": "rewardAmount", "type": "uint256"}
    ],
    "name": "PollEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "pollId", "type": "uint256"},
      {"indexed": true, "name": "voter", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"}
    ],
    "name": "RefundIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "pollId", "type": "uint256"},
      {"indexed": true, "name": "voter", "type": "address"},
      {"indexed": false, "name": "candidateIndex", "type": "uint256"},
      {"indexed": false, "name": "fee", "type": "uint256"}
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "inputs": [
      {"name": "_title", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_durationInDays", "type": "uint256"},
      {"name": "_maxCandidates", "type": "uint256"},
      {"name": "_votingFee", "type": "uint256"}
    ],
    "name": "createPoll",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_pollId", "type": "uint256"},
      {"name": "_name", "type": "string"}
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_pollId", "type": "uint256"},
      {"name": "_candidateIndex", "type": "uint256"},
      {"name": "_name", "type": "string"}
    ],
    "name": "replaceCandidate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_pollId", "type": "uint256"},
      {"name": "_candidateIndex", "type": "uint256"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_pollId", "type": "uint256"}],
    "name": "endPoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_pollId", "type": "uint256"}],
    "name": "deletePoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_pollId", "type": "uint256"}],
    "name": "claimRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_pollId", "type": "uint256"}],
    "name": "getPoll",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "title", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "creator", "type": "address"},
          {"name": "createdAt", "type": "uint256"},
          {"name": "duration", "type": "uint256"},
          {"name": "endTime", "type": "uint256"},
          {"name": "maxCandidates", "type": "uint256"},
          {"name": "votingFee", "type": "uint256"},
          {"name": "totalVotes", "type": "uint256"},
          {"name": "totalInteractions", "type": "uint256"},
          {"name": "candidateCount", "type": "uint256"},
          {"name": "isActive", "type": "bool"},
          {"name": "isDeleted", "type": "bool"},
          {"name": "completedAt", "type": "uint256"},
          {"name": "winner", "type": "address"},
          {"name": "totalRewardPool", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_pollId", "type": "uint256"}],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
          {"name": "candidateAddress", "type": "address"},
          {"name": "name", "type": "string"},
          {"name": "voteCount", "type": "uint256"},
          {"name": "exists", "type": "bool"}
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActivePolls",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCompletedPolls",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTrendingPolls",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getUserStats",
    "outputs": [
      {"name": "totalVotes", "type": "uint256"},
      {"name": "totalRewards", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalStats",
    "outputs": [
      {"name": "totalPolls", "type": "uint256"},
      {"name": "totalActivePolls", "type": "uint256"},
      {"name": "totalCompletedPolls", "type": "uint256"},
      {"name": "totalVotesGlobal", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pollCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawPlatformFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "", "type": "uint256"},
      {"name": "", "type": "address"}
    ],
    "name": "hasVoted",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
