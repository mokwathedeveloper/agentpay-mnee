const { ethers } = require("hardhat");

async function main() {
  console.log("🏦 Setting up vault for testing...");
  
  // Get signers
  const [deployer, vaultOwner, agent1, agent2] = await ethers.getSigners();
  
  // Deploy mock MNEE token for testing
  console.log("📄 Deploying mock MNEE token...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mneeToken = await MockERC20.deploy("MNEE Token", "MNEE");
  await mneeToken.waitForDeployment();
  
  const mneeAddress = await mneeToken.getAddress();
  console.log(`✅ Mock MNEE deployed to: ${mneeAddress}`);
  
  // Get vault contract
  const vaultAddress = process.env.VAULT_CONTRACT_ADDRESS;
  const vault = await ethers.getContractAt("AgentPayVault", vaultAddress);
  
  // Mint MNEE tokens to agents
  console.log("💰 Minting MNEE tokens to agents...");
  await mneeToken.mint(agent1.address, ethers.parseUnits("1000", 18));
  await mneeToken.mint(agent2.address, ethers.parseUnits("1000", 18));
  
  // Setup Agent 1
  console.log("🤖 Setting up Agent 1...");
  await mneeToken.connect(agent1).approve(vaultAddress, ethers.parseUnits("100", 18));
  await vault.connect(agent1).deposit(ethers.parseUnits("100", 18));
  await vault.connect(agent1).setDailyLimit(ethers.parseUnits("50", 18));
  await vault.connect(agent1).addRecipient(agent2.address);
  
  console.log("✅ Vault setup complete!");
  console.log(`Agent 1: ${agent1.address}`);
  console.log(`Agent 2: ${agent2.address}`);
  console.log(`Mock MNEE: ${mneeAddress}`);
}

main().catch(console.error);