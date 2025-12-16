/**
 * Secure Environment Variable Validation Utility
 * Ensures all required environment variables are present, valid, and secure
 */

const { ethers } = require('ethers');

class SecureEnvValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.securityIssues = [];
  }

  /**
   * Check for placeholder/example values that should never be used in production
   */
  validateNotPlaceholder(value, name, placeholders = []) {
    const commonPlaceholders = [
      'your_', 'YOUR_', 'example', 'placeholder', 'test_key',
      '1234567890abcdef', 'abcdef1234567890', '0x1234567890123456'
    ];
    
    const allPlaceholders = [...commonPlaceholders, ...placeholders];
    
    for (const placeholder of allPlaceholders) {
      if (value && value.includes(placeholder)) {
        this.securityIssues.push(`${name} contains placeholder value - NEVER use in production`);
        return false;
      }
    }
    return true;
  }

  /**
   * Validate private key with security checks
   */
  validatePrivateKey(privateKey, name, role) {
    if (!privateKey) {
      this.errors.push(`${name} is required for ${role} operations`);
      return false;
    }
    
    if (privateKey.length !== 66 || !privateKey.startsWith('0x')) {
      this.errors.push(`${name} must be 66 characters starting with 0x`);
      return false;
    }
    
    // Security check for placeholder keys
    this.validateNotPlaceholder(privateKey, name);
    
    // Check for weak/test keys
    if (privateKey.match(/^0x[0-9a-f]{64}$/i)) {
      const repeatingPattern = privateKey.match(/(.{8})\1+/);
      if (repeatingPattern) {
        this.securityIssues.push(`${name} appears to use repeating pattern - use cryptographically secure key`);
      }
    }
    
    return true;
  }

  /**
   * Validate Ethereum address with security checks
   */
  validateAddress(address, name, role) {
    if (!address) {
      this.errors.push(`${name} is required for ${role}`);
      return false;
    }
    
    if (!ethers.isAddress(address)) {
      this.errors.push(`${name} is not a valid Ethereum address`);
      return false;
    }
    
    // Check for placeholder addresses
    this.validateNotPlaceholder(address, name);
    
    return true;
  }

  /**
   * Validate RPC URL with security checks
   */
  validateRpcUrl(url, name) {
    if (!url) {
      this.errors.push(`${name} is required`);
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        this.errors.push(`${name} must use HTTP or HTTPS protocol`);
        return false;
      }
    } catch {
      this.errors.push(`${name} is not a valid URL`);
      return false;
    }
    
    // Check for placeholder API keys
    this.validateNotPlaceholder(url, name, ['YOUR_ALCHEMY_KEY', 'YOUR_API_KEY']);
    
    return true;
  }

  /**
   * Validate role separation - ensure different wallets for different roles
   */
  validateRoleSeparation() {
    const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;
    const agentKey = process.env.AGENT_PRIVATE_KEY;
    
    if (deployerKey && agentKey && deployerKey === agentKey) {
      this.securityIssues.push('CRITICAL: Same private key used for deployer and agent roles - use separate wallets');
    }
    
    const vaultOwner = process.env.VAULT_OWNER_ADDRESS;
    const agentAddress = process.env.AGENT_WALLET_ADDRESS;
    
    if (vaultOwner && agentAddress && vaultOwner.toLowerCase() === agentAddress.toLowerCase()) {
      this.warnings.push('Vault owner and agent use same address - consider separation for better security');
    }
  }

  /**
   * Validate deployment environment with security checks
   */
  validateDeploymentEnv() {
    console.log('🔒 Validating deployment environment with security checks...');
    
    this.validatePrivateKey(process.env.DEPLOYER_PRIVATE_KEY, 'DEPLOYER_PRIVATE_KEY', 'contract deployment');
    this.validateAddress(process.env.VAULT_OWNER_ADDRESS, 'VAULT_OWNER_ADDRESS', 'vault ownership');
    this.validateRpcUrl(process.env.SEPOLIA_RPC_URL, 'SEPOLIA_RPC_URL');
    this.validateAddress(process.env.MNEE_TOKEN_ADDRESS, 'MNEE_TOKEN_ADDRESS', 'MNEE token integration');
    
    // Validate role separation
    this.validateRoleSeparation();
    
    return this.errors.length === 0 && this.securityIssues.length === 0;
  }

  /**
   * Validate agent environment with security checks
   */
  validateAgentEnv() {
    console.log('🔒 Validating agent environment with security checks...');
    
    // Check for multi-agent or legacy single agent configuration
    const hasMultiAgent = process.env.AGENT_1_PRIVATE_KEY;
    const hasLegacyAgent = process.env.AGENT_PRIVATE_KEY;
    
    if (hasMultiAgent) {
      // Validate at least one agent is configured
      this.validatePrivateKey(process.env.AGENT_1_PRIVATE_KEY, 'AGENT_1_PRIVATE_KEY', 'multi-agent operations');
    } else if (hasLegacyAgent) {
      // Validate legacy single agent
      this.validatePrivateKey(process.env.AGENT_PRIVATE_KEY, 'AGENT_PRIVATE_KEY', 'autonomous payments');
    } else {
      this.errors.push('No agent configuration found. Set AGENT_1_PRIVATE_KEY or AGENT_PRIVATE_KEY');
    }
    
    this.validateAddress(process.env.VAULT_CONTRACT_ADDRESS, 'VAULT_CONTRACT_ADDRESS', 'vault interaction');
    this.validateRpcUrl(process.env.RPC_URL, 'RPC_URL');
    this.validateAddress(process.env.MNEE_TOKEN_ADDRESS, 'MNEE_TOKEN_ADDRESS', 'MNEE token integration');
    
    // Validate policy configuration
    const minAmount = parseFloat(process.env.AGENT_MIN_AMOUNT || '0');
    const maxAmount = parseFloat(process.env.AGENT_MAX_AMOUNT || '0');
    
    if (minAmount <= 0) {
      this.errors.push('AGENT_MIN_AMOUNT must be greater than 0');
    }
    
    if (maxAmount <= minAmount) {
      this.errors.push('AGENT_MAX_AMOUNT must be greater than AGENT_MIN_AMOUNT');
    }
    
    // Validate role separation
    this.validateRoleSeparation();
    
    return this.errors.length === 0 && this.securityIssues.length === 0;
  }

  /**
   * Print comprehensive validation results
   */
  printResults() {
    let hasIssues = false;
    
    if (this.securityIssues.length > 0) {
      console.log('\n🚨 CRITICAL SECURITY ISSUES:');
      this.securityIssues.forEach(issue => console.log(`   • ${issue}`));
      hasIssues = true;
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ CONFIGURATION ERRORS:');
      this.errors.forEach(error => console.log(`   • ${error}`));
      hasIssues = true;
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  SECURITY WARNINGS:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    if (!hasIssues) {
      console.log('✅ Environment validation passed - configuration is secure');
    }
    
    return !hasIssues;
  }

  /**
   * Validate and exit if critical issues found
   */
  validateOrExit(type = 'agent') {
    let isValid = false;
    
    switch (type) {
      case 'deployment':
        isValid = this.validateDeploymentEnv();
        break;
      case 'agent':
        isValid = this.validateAgentEnv();
        break;
      default:
        this.errors.push(`Unknown validation type: ${type}`);
    }
    
    const success = this.printResults();
    
    if (!success) {
      console.log('\n🛡️  SECURITY NOTICE: Fix critical issues before proceeding');
      console.log('📖 See docs/security-setup.md for secure configuration guide');
      process.exit(1);
    }
    
    return true;
  }
}

module.exports = SecureEnvValidator;