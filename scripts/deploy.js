const { ethers } = require("hardhat");
require('dotenv').config();
const EnvValidator = require('../lib/envValidator');

async function main() {
  console.log("🚀 Deploying AgentPay contracts...");
  
  // Validate deployment environment
  const validator = new EnvValidator();
  validator.validateOrExit('deployment');
  
  // Get deployment configuration
  const [deployer] = await ethers.getSigners();
  const vaultOwner = process.env.VAULT_OWNER_ADDRESS;
  const mneeTokenAddress = process.env.MNEE_TOKEN_ADDRESS;
  
  console.log(`\n📋 Deployment Configuration:`);
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Vault Owner: ${vaultOwner}`);
  console.log(`   MNEE Token: ${mneeTokenAddress}`);
  console.log(`   Network: ${network.name}`);
  
  // Deploy AgentPayVault contract
  console.log(`\n🏗️  Deploying AgentPayVault...`);
  const AgentPayVault = await ethers.getContractFactory("AgentPayVault");
  const vault = await AgentPayVault.deploy(mneeTokenAddress);
  await vault.waitForDeployment();
  
  const vaultAddress = await vault.getAddress();
  console.log(`✅ AgentPayVault deployed to: ${vaultAddress}`);
  
  // Transfer ownership if different from deployer
  if (vaultOwner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.log(`\n🔄 Transferring ownership to: ${vaultOwner}`);
    await vault.transferOwnership(vaultOwner);
    console.log(`✅ Ownership transferred`);
  }
  
  // Output deployment summary
  console.log(`\n📊 DEPLOYMENT SUMMARY`);
  console.log(`${'='.repeat(50)}`);
  console.log(`AgentPayVault: ${vaultAddress}`);
  console.log(`MNEE Token: ${mneeTokenAddress}`);
  console.log(`Owner: ${vaultOwner}`);
  console.log(`Network: ${network.name}`);
  
  console.log(`\n💡 Next Steps:`);
  console.log(`1. Update VAULT_CONTRACT_ADDRESS in .env`);
  console.log(`2. Update NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS in .env`);
  console.log(`3. Fund agent wallet with MNEE tokens`);
  console.log(`4. Configure vault (deposit, set limits, whitelist recipients)`);
  
  console.log(`\n🎉 Deployment completed successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });