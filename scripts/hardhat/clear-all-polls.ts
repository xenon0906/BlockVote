const hre = require('hardhat')
const { ethers } = hre

async function main() {
  console.log('Starting to clear all polls...')

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x35267EAE1c7a13Cf42Ef312075115F15b7D9BcA7'

  // Get the contract
  const VotingSystem = await ethers.getContractAt('VotingSystem', contractAddress)

  // Get total number of polls
  const [totalPolls] = await VotingSystem.getTotalStats()
  console.log(`Total polls in contract: ${totalPolls}`)

  if (totalPolls === 0n) {
    console.log('No polls to delete!')
    return
  }

  const [signer] = await ethers.getSigners()
  console.log(`Using account: ${signer.address}`)

  // Get all poll IDs (from 1 to totalPolls)
  const pollsToDelete: number[] = []

  for (let i = 1; i <= Number(totalPolls); i++) {
    try {
      const poll = await VotingSystem.getPoll(i)

      // Check if poll exists and is not deleted
      if (poll.creator !== ethers.ZeroAddress && !poll.isDeleted) {
        // Check if signer is the creator
        if (poll.creator.toLowerCase() === signer.address.toLowerCase()) {
          pollsToDelete.push(i)
        } else {
          console.log(`⚠️  Poll ${i} is owned by ${poll.creator}, cannot delete (you are ${signer.address})`)
        }
      }
    } catch (error) {
      console.log(`Poll ${i} does not exist or is already deleted`)
    }
  }

  console.log(`\nFound ${pollsToDelete.length} polls that you can delete`)

  if (pollsToDelete.length === 0) {
    console.log('No polls to delete that you own!')
    return
  }

  // Delete each poll
  for (const pollId of pollsToDelete) {
    try {
      console.log(`\nDeleting poll ${pollId}...`)
      const tx = await VotingSystem.deletePoll(pollId)
      console.log(`Transaction sent: ${tx.hash}`)
      await tx.wait()
      console.log(`✅ Poll ${pollId} deleted successfully!`)
    } catch (error: any) {
      console.error(`❌ Error deleting poll ${pollId}:`, error.message)
    }
  }

  console.log('\n🎉 Finished clearing polls!')
  console.log('\nNote: Voters can still claim refunds for deleted polls using the "Claim Refund" button.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
