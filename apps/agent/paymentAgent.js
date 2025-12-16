const { ethers } = require('ethers');
require('dotenv').config();
const SecureEnvValidator = require('../../lib/secureEnvValidator');

// AgentPayVault ABI (minimal interface)
const VAULT_ABI = [
  "function getAgentInfo(address agent) view returns (uint256 balance, uint256 dailyLimit, uint256 dailySpent)",
  "function getRemainingDailyAllowance(address agent) view returns (uint256)",
  "function isWhitelisted(address agent, address recipient) view returns (bool)",
  "function executePayment(address recipient, uint256 amount, string purpose)"
];

class PaymentAgent {
  constructor(agentId = '1') {
    // Validate environment configuration with security checks
    const validator = new SecureEnvValidator();
    validator.validateOrExit('agent');
    
    // Load agent-specific configuration
    this.agentId = agentId;
    this.agentName = process.env[`AGENT_${agentId}_NAME`] || `Agent ${agentId}`;
    this.privateKey = process.env[`AGENT_${agentId}_PRIVATE_KEY`] || process.env.AGENT_PRIVATE_KEY;
    this.walletAddress = process.env[`AGENT_${agentId}_WALLET_ADDRESS`] || process.env.AGENT_WALLET_ADDRESS;
    
    if (!this.privateKey) {
      throw new Error(`Agent ${agentId} private key not configured`);
    }
    
    // Load shared configuration
    this.rpcUrl = process.env.RPC_URL || process.env.SEPOLIA_RPC_URL;
    this.vaultAddress = process.env.VAULT_CONTRACT_ADDRESS;
    this.mneeTokenAddress = process.env.MNEE_TOKEN_ADDRESS;

    // Initialize ethers components
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    this.vaultContract = new ethers.Contract(this.vaultAddress, VAULT_ABI, this.wallet);
    
    // Initialize decision log
    this.decisionLog = [];
    
    console.log(`🤖 ${this.agentName} (ID: ${this.agentId}) initialized`);
    console.log(`📍 Agent Address: ${this.wallet.address}`);
    console.log(`🏦 Vault Contract: ${this.vaultAddress}`);
    this.logPolicyConfiguration();
  }

  /**
   * Log current policy configuration for transparency
   */
  logPolicyConfiguration() {
    const policy = this.loadPolicyConfig();
    console.log('\n📋 Policy Configuration:');
    console.log(`   Valid Purposes: ${policy.validPurposes.join(', ')}`);
    console.log(`   Amount Range: ${policy.minAmount} - ${policy.maxAmount} MNEE`);
    console.log(`   Request Delay: ${policy.requestDelay}ms`);
  }

  /**
   * Log decision with timestamp and context
   */
  logDecision(paymentId, decision, context) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      agentId: this.agentId,
      agentName: this.agentName,
      paymentId,
      decision: decision.allowed,
      reason: decision.reason,
      rules: decision.decisions.map(d => ({ rule: d.rule, passed: d.passed, data: d.data })),
      context
    };
    
    this.decisionLog.push(logEntry);
    console.log(`\n📝 [${this.agentName}] Decision logged: ${decision.reason} (ID: ${paymentId})`);
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
   * Load policy configuration from environment
   */
  loadPolicyConfig() {
    return {
      validPurposes: (process.env.AGENT_VALID_PURPOSES || 'service_payment,api_usage,data_purchase,subscription').split(','),
      minAmount: parseFloat(process.env.AGENT_MIN_AMOUNT || '0.1'),
      maxAmount: parseFloat(process.env.AGENT_MAX_AMOUNT || '1000'),
      requestDelay: parseInt(process.env.AGENT_REQUEST_DELAY_MS || '2000')
    };
  }

  /**
   * Execute policy-driven decision making for payment
   */
  executePaymentPolicy(amount, recipient, purpose, vaultStatus) {
    const policy = this.loadPolicyConfig();
    const decisions = [];
    const amountNum = parseFloat(amount);
    
    // Policy 1: Check sufficient balance
    const balanceNum = parseFloat(vaultStatus.balance);
    if (balanceNum < amountNum) {
      decisions.push({
        rule: 'INSUFFICIENT_BALANCE',
        passed: false,
        message: `Balance ${vaultStatus.balance} MNEE < Required ${amount} MNEE`,
        data: { balance: balanceNum, required: amountNum }
      });
      return { allowed: false, decisions, reason: 'INSUFFICIENT_BALANCE' };
    }
    decisions.push({
      rule: 'SUFFICIENT_BALANCE',
      passed: true,
      message: `Balance ${vaultStatus.balance} MNEE >= Required ${amount} MNEE`,
      data: { balance: balanceNum, required: amountNum }
    });

    // Policy 2: Check daily limit
    const remainingNum = parseFloat(vaultStatus.remainingAllowance);
    if (remainingNum < amountNum) {
      decisions.push({
        rule: 'DAILY_LIMIT_EXCEEDED',
        passed: false,
        message: `Remaining allowance ${vaultStatus.remainingAllowance} MNEE < Required ${amount} MNEE`,
        data: { remaining: remainingNum, required: amountNum }
      });
      return { allowed: false, decisions, reason: 'DAILY_LIMIT_EXCEEDED' };
    }
    decisions.push({
      rule: 'WITHIN_DAILY_LIMIT',
      passed: true,
      message: `Remaining allowance ${vaultStatus.remainingAllowance} MNEE >= Required ${amount} MNEE`,
      data: { remaining: remainingNum, required: amountNum }
    });

    // Policy 3: Amount range validation
    if (amountNum < policy.minAmount || amountNum > policy.maxAmount) {
      decisions.push({
        rule: 'AMOUNT_OUT_OF_RANGE',
        passed: false,
        message: `Amount ${amount} MNEE outside allowed range [${policy.minAmount}, ${policy.maxAmount}]`,
        data: { amount: amountNum, minAmount: policy.minAmount, maxAmount: policy.maxAmount }
      });
      return { allowed: false, decisions, reason: 'AMOUNT_OUT_OF_RANGE' };
    }
    decisions.push({
      rule: 'AMOUNT_IN_RANGE',
      passed: true,
      message: `Amount ${amount} MNEE within allowed range [${policy.minAmount}, ${policy.maxAmount}]`,
      data: { amount: amountNum, minAmount: policy.minAmount, maxAmount: policy.maxAmount }
    });

    // Policy 4: Purpose validation (environment-driven)
    const purposeValid = policy.validPurposes.some(valid => purpose.toLowerCase().includes(valid.toLowerCase()));
    if (!purposeValid) {
      decisions.push({
        rule: 'INVALID_PURPOSE',
        passed: false,
        message: `Purpose "${purpose}" not in approved categories: ${policy.validPurposes.join(', ')}`,
        data: { purpose, validPurposes: policy.validPurposes }
      });
      return { allowed: false, decisions, reason: 'INVALID_PURPOSE' };
    }
    decisions.push({
      rule: 'VALID_PURPOSE',
      passed: true,
      message: `Purpose "${purpose}" approved by policy`,
      data: { purpose, validPurposes: policy.validPurposes }
    });

    return { allowed: true, decisions, reason: 'POLICY_APPROVED' };
  }

  /**
   * Execute payment with policy validation
   */
  async executePayment(recipient, amount, purpose) {
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`\n🔄 [${this.agentName}] Processing payment request...`);
    console.log(`🆔 Payment ID: ${paymentId}`);
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

      // Step 3: Execute policy-driven decision
      console.log('\n🤖 Running policy-driven payment validation...');
      const decision = this.executePaymentPolicy(amount, recipient, purpose, vaultStatus);
      
      decision.decisions.forEach(rule => {
        const status = rule.passed ? '✅' : '❌';
        console.log(`${status} ${rule.rule}: ${rule.message}`);
      });

      // Log decision for audit trail
      this.logDecision(paymentId, decision, { recipient, amount, purpose, vaultStatus });
      
      if (!decision.allowed) {
        console.log(`\n❌ PAYMENT REJECTED: ${decision.reason}`);
        return { success: false, reason: decision.reason, decisions: decision.decisions, paymentId };
      }
      
      console.log(`\n✅ PAYMENT APPROVED: ${decision.reason}`);

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
        decisions: decision.decisions,
        reason: decision.reason,
        paymentId
      };

    } catch (error) {
      console.error('❌ Payment execution failed:', error.message);
      return { success: false, reason: 'EXECUTION_ERROR', error: error.message, paymentId };
    }
  }

  /**
   * Run payment simulation
   */
  async runSimulation() {
    console.log(`🚀 Starting ${this.agentName} Simulation\n`);
    
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
      
      // Wait between requests for rate limiting (configurable)
      if (i < paymentRequests.length - 1) {
        const delay = this.loadPolicyConfig().requestDelay;
        console.log(`\n⏳ Waiting ${delay}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.log(`\n🏁 ${this.agentName} processing completed`);
    this.printDecisionSummary();
  }

  /**
   * Load payment requests from environment configuration (fully dynamic)
   */
  loadPaymentRequests() {
    const recipientAddress = process.env.RECIPIENT_WALLET_ADDRESS;
    if (!recipientAddress) {
      return [];
    }

    // Load payment scenarios from environment variables
    const amounts = (process.env.AGENT_PAYMENT_AMOUNTS || '5,15').split(',');
    const purposes = (process.env.AGENT_PAYMENT_PURPOSES || 'Automated API service_payment,Data processing subscription fee').split(',');
    
    // Generate payment requests from configuration
    const requests = [];
    for (let i = 0; i < Math.max(amounts.length, purposes.length); i++) {
      requests.push({
        recipient: recipientAddress,
        amount: amounts[i % amounts.length].trim(),
        purpose: purposes[i % purposes.length].trim()
      });
    }
    
    return requests;
  }

  /**
   * Print comprehensive decision summary for audit
   */
  printDecisionSummary() {
    if (this.decisionLog.length === 0) {
      console.log('\n📊 No decisions logged');
      return;
    }

    console.log('\n📊 DECISION AUDIT SUMMARY');
    console.log('=' .repeat(50));
    
    const approved = this.decisionLog.filter(d => d.decision).length;
    const rejected = this.decisionLog.filter(d => !d.decision).length;
    
    console.log(`Total Decisions: ${this.decisionLog.length}`);
    console.log(`Approved: ${approved}`);
    console.log(`Rejected: ${rejected}`);
    
    console.log('\nDecision Breakdown:');
    this.decisionLog.forEach((log, index) => {
      const status = log.decision ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${log.reason} (${log.paymentId})`);
      console.log(`   Amount: ${log.context.amount} MNEE | Purpose: ${log.context.purpose}`);
      console.log(`   Time: ${log.timestamp}`);
    });
  }
}

// Run simulation if called directly
if (require.main === module) {
  const agentId = process.argv[2] || '1';
  const agent = new PaymentAgent(agentId);
  agent.runSimulation().catch(console.error);
}

module.exports = PaymentAgent;