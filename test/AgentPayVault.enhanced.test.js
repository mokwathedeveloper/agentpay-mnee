const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("AgentPayVault - Enhanced Tests", function () {
  let vault, mockToken, owner, agent, recipient, unauthorized;
  
  beforeEach(async function () {
    [owner, agent, recipient, unauthorized] = await ethers.getSigners();
    
    // Deploy mock ERC20 token
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("Mock MNEE", "MNEE", ethers.parseUnits("1000000", 18));
    
    // Deploy AgentPayVault
    const AgentPayVault = await ethers.getContractFactory("AgentPayVault");
    vault = await AgentPayVault.deploy(await mockToken.getAddress());
    
    // Setup: Give agent tokens and approve vault
    await mockToken.transfer(agent.address, ethers.parseUnits("1000", 18));
    await mockToken.connect(agent).approve(await vault.getAddress(), ethers.parseUnits("1000", 18));
  });

  describe("Daily Spending Limit Enforcement", function () {
    beforeEach(async function () {
      // Setup agent with 100 MNEE balance and 50 MNEE daily limit
      await vault.connect(agent).deposit(ethers.parseUnits("100", 18));
      await vault.connect(agent).setDailyLimit(ethers.parseUnits("50", 18));
      await vault.connect(agent).addRecipient(recipient.address);
    });

    it("should enforce daily spending limit", async function () {
      // First payment within limit
      await vault.connect(agent).executePayment(
        recipient.address,
        ethers.parseUnits("30", 18),
        "First payment"
      );
      
      // Second payment that would exceed limit
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("25", 18),
          "Second payment"
        )
      ).to.be.revertedWith("Daily limit exceeded");
    });

    it("should allow payment up to exact daily limit", async function () {
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("50", 18),
          "Exact limit payment"
        )
      ).to.not.be.reverted;
      
      // Next payment should fail
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("1", 18),
          "Over limit payment"
        )
      ).to.be.revertedWith("Daily limit exceeded");
    });

    it("should track daily spent correctly", async function () {
      await vault.connect(agent).executePayment(
        recipient.address,
        ethers.parseUnits("20", 18),
        "Payment 1"
      );
      
      const [, , dailySpent] = await vault.getAgentInfo(agent.address);
      expect(dailySpent).to.equal(ethers.parseUnits("20", 18));
      
      const remaining = await vault.getRemainingDailyAllowance(agent.address);
      expect(remaining).to.equal(ethers.parseUnits("30", 18));
    });
  });

  describe("Whitelist Rejection", function () {
    beforeEach(async function () {
      await vault.connect(agent).deposit(ethers.parseUnits("100", 18));
      await vault.connect(agent).setDailyLimit(ethers.parseUnits("50", 18));
    });

    it("should reject payment to non-whitelisted recipient", async function () {
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("10", 18),
          "Unauthorized payment"
        )
      ).to.be.revertedWith("Recipient not whitelisted");
    });

    it("should allow payment after whitelisting", async function () {
      await vault.connect(agent).addRecipient(recipient.address);
      
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("10", 18),
          "Authorized payment"
        )
      ).to.not.be.reverted;
    });

    it("should reject payment after removing from whitelist", async function () {
      await vault.connect(agent).addRecipient(recipient.address);
      await vault.connect(agent).removeRecipient(recipient.address);
      
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("10", 18),
          "Removed recipient payment"
        )
      ).to.be.revertedWith("Recipient not whitelisted");
    });
  });

  describe("24-Hour Reset Logic", function () {
    beforeEach(async function () {
      await vault.connect(agent).deposit(ethers.parseUnits("100", 18));
      await vault.connect(agent).setDailyLimit(ethers.parseUnits("50", 18));
      await vault.connect(agent).addRecipient(recipient.address);
    });

    it("should reset daily spending after 24 hours", async function () {
      // Use up daily limit
      await vault.connect(agent).executePayment(
        recipient.address,
        ethers.parseUnits("50", 18),
        "Max daily payment"
      );
      
      // Verify limit is reached
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("1", 18),
          "Over limit"
        )
      ).to.be.revertedWith("Daily limit exceeded");
      
      // Fast forward 24 hours + 1 second
      await time.increase(24 * 60 * 60 + 1);
      
      // Should be able to spend again
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("25", 18),
          "Next day payment"
        )
      ).to.not.be.reverted;
    });

    it("should return full daily limit after reset", async function () {
      // Spend some amount
      await vault.connect(agent).executePayment(
        recipient.address,
        ethers.parseUnits("30", 18),
        "Partial payment"
      );
      
      // Check remaining allowance
      let remaining = await vault.getRemainingDailyAllowance(agent.address);
      expect(remaining).to.equal(ethers.parseUnits("20", 18));
      
      // Fast forward 24 hours
      await time.increase(24 * 60 * 60 + 1);
      
      // Check remaining allowance after reset
      remaining = await vault.getRemainingDailyAllowance(agent.address);
      expect(remaining).to.equal(ethers.parseUnits("50", 18));
    });

    it("should handle multiple day transitions correctly", async function () {
      // Day 1: Spend 30 MNEE
      await vault.connect(agent).executePayment(
        recipient.address,
        ethers.parseUnits("30", 18),
        "Day 1 payment"
      );
      
      // Fast forward to day 2
      await time.increase(24 * 60 * 60 + 1);
      
      // Day 2: Spend 40 MNEE
      await vault.connect(agent).executePayment(
        recipient.address,
        ethers.parseUnits("40", 18),
        "Day 2 payment"
      );
      
      // Fast forward to day 3
      await time.increase(24 * 60 * 60 + 1);
      
      // Day 3: Should have full limit available
      const remaining = await vault.getRemainingDailyAllowance(agent.address);
      expect(remaining).to.equal(ethers.parseUnits("50", 18));
    });
  });

  describe("Edge Cases and Security", function () {
    beforeEach(async function () {
      await vault.connect(agent).deposit(ethers.parseUnits("100", 18));
      await vault.connect(agent).setDailyLimit(ethers.parseUnits("50", 18));
      await vault.connect(agent).addRecipient(recipient.address);
    });

    it("should prevent zero amount payments", async function () {
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          0,
          "Zero payment"
        )
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("should prevent payments exceeding balance", async function () {
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("150", 18),
          "Over balance payment"
        )
      ).to.be.revertedWith("Insufficient balance");
    });

    it("should emit PaymentExecuted event with correct data", async function () {
      await expect(
        vault.connect(agent).executePayment(
          recipient.address,
          ethers.parseUnits("25", 18),
          "Test payment"
        )
      ).to.emit(vault, "PaymentExecuted")
       .withArgs(agent.address, recipient.address, ethers.parseUnits("25", 18), "Test payment");
    });
  });
});