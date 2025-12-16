/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are present and valid
 */

const { ethers } = require('ethers');

class EnvValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate Ethereum address format
   */
  validateAddress(address, name) {
    if (!address) {
      this.errors.push(`${name} is required`);
      return false;
    }
    
    if (!ethers.isAddress(address)) {
      this.errors.push(`${name} is not a valid Ethereum address: ${address}`);
      return false;
    }
    
    return true;
  }

  /**
   * Validate private key format
   */
  validatePrivateKey(privateKey, name) {
    if (!privateKey) {
      this.errors.push(`${name} is required`);
      return false;
    }
    
    if (privateKey.length !== 66 || !privateKey.startsWith('0x')) {
      this.errors.push(`${name} must be a 64-character hex string starting with 0x`);
      return false;
    }
    
    // Check if it's a placeholder/example key
    if (privateKey.includes('1234567890abcdef') || privateKey.includes('abcdef1234567890')) {
      this.warnings.push(`${name} appears to be a placeholder - replace with real key`);
    }
    
    return true;
  }

  /**
   * Validate RPC URL format
   */
  validateRpcUrl(url, name) {
    if (!url) {
      this.errors.push(`${name} is required`);
      return false;
    }
    
    try {
      new URL(url);
    } catch {
      this.errors.push(`${name} is not a valid URL: ${url}`);
      return false;
    }
    
    if (url.includes('YOUR_ALCHEMY_KEY') || url.includes('YOUR_KEY')) {
      this.warnings.push(`${name} contains placeholder - replace with real API key`);
    }
    
    return true;
  }

  /**
   * Validate deployment environment variables
   */
  validateDeploymentEnv() {
    console.log('🔍 Validating deployment environment...');
    
    this.validatePrivateKey(process.env.DEPLOYER_PRIVATE_KEY, 'DEPLOYER_PRIVATE_KEY');
    this.validateAddress(process.env.VAULT_OWNER_ADDRESS, 'VAULT_OWNER_ADDRESS');
    this.validateRpcUrl(process.env.SEPOLIA_RPC_URL, 'SEPOLIA_RPC_URL');
    this.validateAddress(process.env.MNEE_TOKEN_ADDRESS, 'MNEE_TOKEN_ADDRESS');
    
    if (process.env.ETHERSCAN_API_KEY && process.env.ETHERSCAN_API_KEY.includes('your_etherscan_api_key')) {
      this.warnings.push('ETHERSCAN_API_KEY appears to be placeholder');
    }
    
    return this.errors.length === 0;
  }

  /**
   * Validate agent environment variables
   */
  validateAgentEnv() {
    console.log('🔍 Validating agent environment...');
    
    this.validatePrivateKey(process.env.AGENT_PRIVATE_KEY, 'AGENT_PRIVATE_KEY');
    this.validateAddress(process.env.VAULT_CONTRACT_ADDRESS, 'VAULT_CONTRACT_ADDRESS');
    this.validateRpcUrl(process.env.RPC_URL, 'RPC_URL');
    this.validateAddress(process.env.MNEE_TOKEN_ADDRESS, 'MNEE_TOKEN_ADDRESS');
    
    // Validate policy configuration
    const minAmount = parseFloat(process.env.AGENT_MIN_AMOUNT || '0');
    const maxAmount = parseFloat(process.env.AGENT_MAX_AMOUNT || '0');
    
    if (minAmount <= 0) {
      this.errors.push('AGENT_MIN_AMOUNT must be greater than 0');
    }
    
    if (maxAmount <= minAmount) {
      this.errors.push('AGENT_MAX_AMOUNT must be greater than AGENT_MIN_AMOUNT');
    }
    
    if (process.env.RECIPIENT_WALLET_ADDRESS) {
      this.validateAddress(process.env.RECIPIENT_WALLET_ADDRESS, 'RECIPIENT_WALLET_ADDRESS');
    }
    
    return this.errors.length === 0;
  }

  /**
   * Print validation results
   */
  printResults() {
    if (this.errors.length > 0) {
      console.log('\n❌ ENVIRONMENT VALIDATION FAILED:');
      this.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  ENVIRONMENT WARNINGS:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    if (this.errors.length === 0) {
      console.log('✅ Environment validation passed');
    }
    
    return this.errors.length === 0;
  }

  /**
   * Validate and exit if errors found
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
      console.log('\n💡 Fix the above issues and try again.');
      console.log('📖 See .env.example for proper configuration format.');
      process.exit(1);
    }
    
    return true;
  }
}

module.exports = EnvValidator;