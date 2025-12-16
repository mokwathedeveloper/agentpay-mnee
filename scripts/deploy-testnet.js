const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🚀 Deploying AgentPayVault to Sepolia testnet...");
  
  // Validate environment
  if (!process.env.SEPOLIA_RPC_URL) {
    throw new Error("SEPOLIA_RPC_URL not configured");
  }
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    throw new Error("DEPLOYER_PRIVATE_KEY not configured");
  }
  
  const mneeTokenAddress = process.env.MNEE_TOKEN_ADDRESS;
  if (!mneeTokenAddress) {
    throw new Error("MNEE_TOKEN_ADDRESS not configured");
  }
  
  console.log(`📍 MNEE Token: ${mneeTokenAddress}`);
  
  // Deploy AgentPayVault
  const AgentPayVault = await ethers.getContractFactory("AgentPayVault");
  const vault = await AgentPayVault.deploy(mneeTokenAddress);
  
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  
  console.log("✅ AgentPayVault deployed to:", vaultAddress);
  console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${vaultAddress}`);
  console.log("📋 Contract verification command:");
  console.log(`npx hardhat verify --network sepolia ${vaultAddress} ${mneeTokenAddress}`);
  
  // Update environment file
  console.log("\n📝 Update your .env file:");
  console.log(`VAULT_CONTRACT_ADDRESS=${vaultAddress}`);
  console.log(`NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=${vaultAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });