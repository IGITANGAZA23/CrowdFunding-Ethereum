const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Compile contracts if needed (Hardhat does this automatically effectively)
  // Get contract factory
  const CampaignFactory = await hre.ethers.getContractFactory("CampaignFactory");

  // Deploy
  const campaignFactory = await CampaignFactory.deploy();

  await campaignFactory.deployed();

  console.log("CampaignFactory deployed to:", campaignFactory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
