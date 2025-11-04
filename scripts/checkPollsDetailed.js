const { ethers } = require('hardhat');
require('dotenv').config();

async function main() {
  console.log('🔍 Checking BlockVote Contract State...\n');

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  console.log(`Contract Address: ${contractAddress}\n`);

  // Connect to contract
  const BlockVote = await ethers.getContractAt('BlockVote', contractAddress);

  // Get poll count
  const pollCount = await BlockVote.pollCount();
  console.log(`📊 Total Polls Created: ${pollCount.toString()}\n`);

  // Get active and completed poll IDs
  console.log('🔄 Fetching Active Polls...');
  const activeIds = await BlockVote.getActivePolls(50);
  console.log(`✅ Active Poll IDs: [${activeIds.map(id => id.toString()).join(', ')}]`);
  console.log(`   Total Active: ${activeIds.length}\n`);

  console.log('✅ Fetching Completed Polls...');
  const completedIds = await BlockVote.getCompletedPolls(20);
  console.log(`✅ Completed Poll IDs: [${completedIds.map(id => id.toString()).join(', ')}]`);
  console.log(`   Total Completed: ${completedIds.length}\n`);

  // Detailed info for each poll
  console.log('📋 DETAILED POLL INFORMATION:\n');
  console.log('═'.repeat(80));

  for (let i = 1; i <= Number(pollCount); i++) {
    try {
      const poll = await BlockVote.getPoll(i);
      const optionsData = await BlockVote.getPollOptions(i);
      const [optionTexts, optionVotes] = optionsData;

      const id = Number(poll[0]);
      const question = poll[1];
      const creator = poll[2];
      const createdAt = Number(poll[3]);
      const expiresAt = Number(poll[4]);
      const finalized = poll[5];
      const totalVotes = Number(poll[6]);
      const totalFunds = ethers.formatEther(poll[7]);
      const hasBet = poll[8];

      const now = Math.floor(Date.now() / 1000);
      const isExpired = now >= expiresAt;
      const status = finalized ? 'FINALIZED' : (isExpired ? 'EXPIRED' : 'ACTIVE');

      console.log(`\n📌 Poll ID: ${id}`);
      console.log(`   Question: "${question}"`);
      console.log(`   Status: ${status}`);
      console.log(`   Creator: ${creator}`);
      console.log(`   Total Votes: ${totalVotes}`);
      console.log(`   Total Funds: ${totalFunds} ETH`);
      console.log(`   Has Bet: ${hasBet ? 'Yes' : 'No'}`);
      console.log(`   Created: ${new Date(createdAt * 1000).toLocaleString()}`);
      console.log(`   Expires: ${new Date(expiresAt * 1000).toLocaleString()}`);
      console.log(`   Finalized: ${finalized ? 'Yes' : 'No'}`);

      console.log(`   Options:`);
      optionTexts.forEach((text, idx) => {
        console.log(`      ${idx + 1}. ${text} - ${Number(optionVotes[idx])} votes`);
      });

      console.log('─'.repeat(80));
    } catch (error) {
      console.log(`\n❌ Poll ID ${i}: DELETED or ERROR`);
      console.log(`   Error: ${error.message}`);
      console.log('─'.repeat(80));
    }
  }

  console.log('\n✅ Check Complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
