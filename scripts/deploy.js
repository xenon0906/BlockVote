const hre = require("hardhat");

async function main() {
  const platformWallet = process.env.NEXT_PUBLIC_PLATFORM_WALLET || "";

  if (!platformWallet) {
    throw new Error("Set NEXT_PUBLIC_PLATFORM_WALLET in .env");
  }

  console.log("Deploying BlockVote...");
  console.log("Platform wallet:", platformWallet);

  const BlockVote = await hre.ethers.getContractFactory("BlockVote");
  const blockVote = await BlockVote.deploy(platformWallet);

  await blockVote.waitForDeployment();

  const address = await blockVote.getAddress();
  console.log("BlockVote deployed:", address);
  console.log("Add to .env: NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
