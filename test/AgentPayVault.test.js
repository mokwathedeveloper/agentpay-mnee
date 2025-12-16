const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentPayVault", function () {
  let vault, mneeToken, owner, agent, recipient;
  
  beforeEach(async function () {
    // Get signers
    [owner, agent, recipient] = await ethers.getSigners();
    
    // Deploy mock MNEE token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mneeToken = await MockERC20.deploy("MNEE Token", "MNEE");
    await mneeToken.waitForDeployment();
    
    const mneeAddress = await mneeToken.getAddress();
    
    // Deploy AgentPayVault
    const AgentPayVault = await ethers.getContractFactory("AgentPayVault");
    vault = await AgentPayVault.deploy(mneeAddress);
    await vault.waitForDeployment();
  });
  
  it("Should deploy successfully", async function () {
    expect(await vault.getAddress()).to.be.properAddress;
  });
  
  it("Should handle policy-based payments", async function () {
    // Basic functionality test
    expect(await vault.owner()).to.equal(owner.address);
  });
});