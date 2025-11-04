const { ethers } = require('ethers');
const BlockVoteABI = require('../utils/BlockVoteABI.json');
require('dotenv').config();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

async function checkPolls() {
  console.log('🔍 Checking BlockVote Contract on Sepolia...\n');
  console.log('Contract Address:', CONTRACT_ADDRESS);
  console.log('RPC URL:', RPC_URL);
  console.log('---');

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, BlockVoteABI, provider);

    // Get poll count
    console.log('\n📊 Getting total poll count...');
    const pollCount = await contract.pollCount();
    console.log(`Total polls created: ${pollCount.toString()}`);

    if (pollCount === 0n) {
      console.log('\n⚠️  No polls found in contract!');
      return;
    }

    // Get all polls
    console.log('\n📋 Loading all polls...\n');
    for (let i = 1; i <= Number(pollCount); i++) {
      try {
        const poll = await contract.getPoll(i);
        const [id, question, creator, createdAt, expiresAt, finalized, totalVotes, totalFunds, hasBet] = poll;

        const now = Math.floor(Date.now() / 1000);
        const expired = Number(expiresAt) < now;
        const status = finalized ? '✅ FINALIZED' : expired ? '⏰ EXPIRED' : '🟢 ACTIVE';

        console.log(`\nPoll #${Number(id)}: ${status}`);
        console.log(`  Question: "${question}"`);
        console.log(`  Creator: ${creator}`);
        console.log(`  Total Votes: ${Number(totalVotes)}`);
        console.log(`  Total Funds: ${ethers.formatEther(totalFunds)} ETH`);
        console.log(`  Has Bet: ${hasBet}`);
        console.log(`  Expires At: ${new Date(Number(expiresAt) * 1000).toLocaleString()}`);

        // Get options
        const [optionTexts, optionVotes] = await contract.getPollOptions(i);
        console.log(`  Options:`);
        optionTexts.forEach((text, idx) => {
          console.log(`    ${idx + 1}. ${text} - ${Number(optionVotes[idx])} votes`);
        });
      } catch (err) {
        console.log(`\n❌ Poll #${i}: ERROR - ${err.message}`);
      }
    }

    // Get active polls
    console.log('\n\n🟢 Getting active polls from contract...');
    const activeIds = await contract.getActivePolls(50);
    console.log(`Active poll IDs: [${activeIds.map(id => Number(id)).join(', ')}]`);

    // Get completed polls
    console.log('\n✅ Getting completed polls from contract...');
    const completedIds = await contract.getCompletedPolls(20);
    console.log(`Completed poll IDs: [${completedIds.map(id => Number(id)).join(', ')}]`);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

checkPolls();
