const { ethers } = require('ethers');
require('dotenv').config();

// AgentPayVault ABI (minimal interface)
const VAULT_ABI = [
  "function getAgentInfo(address agent) view returns (uint256 balance, uint256 dailyLimit, uint256 dailySpent)",
  "function getRemainingDailyAllowance(address agent) view returns (uint256)",
  "function isWhitelisted(address agent, address recipient) view returns (bool)",
  "function executePayment(address recipient, uint256 amount, string purpose)"
];

class PaymentAgent {
  constructor() {
    // Load configuration from environment
    this.privateKey = process.env.AGENT_PRIVATE_KEY;
    this.rpcUrl = process.env.RPC_URL || process.env.SEPOLIA_RPC_URL;
    this.vaultAddress = process.env.VAULT_CONTRACT_ADDRESS;
    
    if (!this.privateKey || !this.rpcUrl || !this.vaultAddress) {
      throw new Error('Missing required environment variables: AGENT_PRIVATE_KEY, RPC_URL, VAULT_CONTRACT_ADDRESS');
    }

    // Initialize ethers components
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    this.vaultContract = new ethers.Contract(this.vaultAddress, VAULT_ABI, this.wallet);
    
    console.log(`🤖 Payment Agent initialized`);
    console.log(`📍 Agent Address: ${this.wallet.address}`);
    console.log(`🏦 Vault Contract: ${this.vaultAddress}`);
  }

  /**
   * Query agent's current vault status
   */
  async getVaultStatus() {
    try {
      const [balance, dailyLimit, dailySpent] = await this.vaultContract.getAgentInfo(this.wallet.address);
      const remainingAllowance = await this.vaultContract.getRemainingDailyAllowance(this.wallet.address);
      
      return {
        balance: ethers.formatUnits(balance, 18),
        dailyLimit: ethers.formatUnits(dailyLimit, 18),
        dailySpent: ethers.formatUnits(dailySpent, 18),
        remainingAllowance: ethers.formatUnits(remainingAllowance, 18)
      };
    } catch (error) {
      console.error('❌ Failed to query vault status:', error.message);
      throw error;
    }
  }

  /**
   * Check if recipient is whitelisted
   */
  async isRecipientWhitelisted(recipient) {
    try {
      return await this.vaultContract.isWhitelisted(this.wallet.address, recipient);
    } catch (error) {
      console.error('❌ Failed to check whitelist status:', error.message);
      return false;
    }
  }

  /**
   * Simulate AI decision making for payment
   */
  simulatePaymentDecision(amount, recipient, purpose, vaultStatus) {
    const decisions = [];
    
    // Policy 1: Check sufficient balance
    if (parseFloat(vaultStatus.balance) < parseFloat(amount)) {
      decisions.push({
        rule: 'INSUFFICIENT_BALANCE',
        passed: false,
        message: `Balance ${vaultStatus.balance} MNEE < Required ${amount} MNEE`
      });
      return { allowed: false, decisions };
    }
    decisions.push({
      rule: 'SUFFICIENT_BALANCE',
      passed: true,
      message: `Balance ${vaultStatus.balance} MNEE >= Required ${amount} MNEE`
    });

    // Policy 2: Check daily limit
    if (parseFloat(vaultStatus.remainingAllowance) < parseFloat(amount)) {
      decisions.push({
        rule: 'DAILY_LIMIT_EXCEEDED',
        passed: false,
        message: `Remaining allowance ${vaultStatus.remainingAllowance} MNEE < Required ${amount} MNEE`
      });
      return { allowed: false, decisions };
    }
    decisions.push({
      rule: 'WITHIN_DAILY_LIMIT',
      passed: true,
      message: `Remaining allowance ${vaultStatus.remainingAllowance} MNEE >= Required ${amount} MNEE`
    });

    // Policy 3: Purpose validation (simulated AI logic)
    const validPurposes = ['service_payment', 'api_usage', 'data_purchase', 'subscription'];
    if (!validPurposes.some(valid => purpose.toLowerCase().includes(valid))) {
      decisions.push({
        rule: 'INVALID_PURPOSE',
        passed: false,
        message: `Purpose "${purpose}" not in approved categories`
      });
      return { allowed: false, decisions };
    }
    decisions.push({
      rule: 'VALID_PURPOSE',
      passed: true,
      message: `Purpose "${purpose}" approved by AI policy`
    });

    return { allowed: true, decisions };
  }

  /**
   * Execute payment with policy validation
   */
  async executePayment(recipient, amount, purpose) {
    console.log('\n🔄 Processing payment request...');
    console.log(`💰 Amount: ${amount} MNEE`);
    console.log(`📍 Recipient: ${recipient}`);
    console.log(`📝 Purpose: ${purpose}`);

    try {
      // Step 1: Query vault status
      console.log('\n📊 Querying vault status...');
      const vaultStatus = await this.getVaultStatus();
      console.log(`💳 Balance: ${vaultStatus.balance} MNEE`);
      console.log(`📈 Daily Limit: ${vaultStatus.dailyLimit} MNEE`);
      console.log(`💸 Daily Spent: ${vaultStatus.dailySpent} MNEE`);
      console.log(`⏳ Remaining Allowance: ${vaultStatus.remainingAllowance} MNEE`);

      // Step 2: Check whitelist
      console.log('\n🔍 Checking recipient whitelist...');
      const isWhitelisted = await this.isRecipientWhitelisted(recipient);
      if (!isWhitelisted) {
        console.log('❌ PAYMENT REJECTED: Recipient not whitelisted');
        return { success: false, reason: 'RECIPIENT_NOT_WHITELISTED' };
      }
      console.log('✅ Recipient is whitelisted');

      // Step 3: AI policy decision
      console.log('\n🤖 Running AI payment policy...');
      const decision = this.simulatePaymentDecision(amount, recipient, purpose, vaultStatus);
      
      decision.decisions.forEach(rule => {
        const status = rule.passed ? '✅' : '❌';
        console.log(`${status} ${rule.rule}: ${rule.message}`);
      });

      if (!decision.allowed) {
        console.log('\n❌ PAYMENT REJECTED: Policy violation');
        return { success: false, reason: 'POLICY_VIOLATION', decisions: decision.decisions };
      }

      // Step 4: Execute payment
      console.log('\n💳 Executing payment...');
      const amountWei = ethers.parseUnits(amount.toString(), 18);
      const tx = await this.vaultContract.executePayment(recipient, amountWei, purpose);
      
      console.log(`📤 Transaction submitted: ${tx.hash}`);
      console.log('⏳ Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log(`✅ Payment confirmed in block ${receipt.blockNumber}`);
      
      return { 
        success: true, 
        txHash: tx.hash, 
        blockNumber: receipt.blockNumber,
        decisions: decision.decisions 
      };

    } catch (error) {
      console.error('❌ Payment execution failed:', error.message);
      return { success: false, reason: 'EXECUTION_ERROR', error: error.message };
    }
  }

  /**
   * Run payment simulation
   */
  async runSimulation() {
    console.log('🚀 Starting Payment Agent Simulation\n');
    
    // Load real payment requests from environment configuration
    const paymentRequests = this.loadPaymentRequests();
    
    if (paymentRequests.length === 0) {
      console.log('⚠️  No payment requests configured. Set RECIPIENT_WALLET_ADDRESS in environment.');
      return;
    }

    for (let i = 0; i < paymentRequests.length; i++) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`💳 PROCESSING PAYMENT REQUEST ${i + 1}/${paymentRequests.length}`);
      console.log(`${'='.repeat(60)}`);
      
      const result = await this.executePayment(
        paymentRequests[i].recipient,
        paymentRequests[i].amount,
        paymentRequests[i].purpose
      );
      
      console.log('\n📊 RESULT:', result.success ? '✅ SUCCESS' : '❌ FAILED');
      if (!result.success) {
        console.log('🔍 Reason:', result.reason);
      }
      
      // Wait between requests for rate limiting
      if (i < paymentRequests.length - 1) {
        console.log('\n⏳ Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n🏁 Agent processing completed');
  }

  /**
   * Load payment requests from environment configuration (not hardcoded)
   */
  loadPaymentRequests() {
    const recipientAddress = process.env.RECIPIENT_WALLET_ADDRESS;
    if (!recipientAddress) {
      return [];
    }

    // In production, this could come from:
    // - API endpoints
    // - Configuration files  
    // - Event listeners
    // - User input
    return [
      {
        recipient: recipientAddress,
        amount: '5',
        purpose: 'Automated API service_payment'
      },
      {
        recipient: recipientAddress,
        amount: '15', 
        purpose: 'Data processing subscription fee'
      }
    ];
  }
}

// Run simulation if called directly
if (require.main === module) {
  const agent = new PaymentAgent();
  agent.runSimulation().catch(console.error);
}

module.exports = PaymentAgent;