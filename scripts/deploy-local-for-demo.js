const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🚀 Deploying AgentPayVault for demo (local network)...");
  
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
  console.log("🌐 Network: Local Hardhat (for demo purposes)");
  console.log("📋 For production, deploy to Sepolia with sufficient ETH");
  
  // Update environment file
  console.log("\n📝 Update your .env file:");
  console.log(`VAULT_CONTRACT_ADDRESS=${vaultAddress}`);
  console.log(`NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=${vaultAddress}`);
  
  // Deployment info for README
  console.log("\n📄 README deployment info:");
  console.log(`Contract Address: ${vaultAddress}`);
  console.log(`Network: Local Hardhat (Demo)`);
  console.log(`MNEE Token: ${mneeTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });