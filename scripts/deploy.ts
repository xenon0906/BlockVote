const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("Starting deployment to Sepolia testnet...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy VotingSystem
  console.log("Deploying VotingSystem contract...");
  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();

  await votingSystem.waitForDeployment();
  const contractAddress = await votingSystem.getAddress();

  console.log("\n✅ VotingSystem deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("\n📝 Add this to your .env file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n🔍 View on Sepolia Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("\n⚠️  Remember to verify your contract on Etherscan!");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
