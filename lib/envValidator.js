/**
 * Production Environment Validator
 * Ensures all required configuration is present before system startup
 */

class EnvironmentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateRequired(key, description) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      this.errors.push(`Missing required environment variable: ${key} (${description})`);
      return false;
    }
    return true;
  }

  validateEthereumAddress(key, description) {
    const value = process.env[key];
    if (!this.validateRequired(key, description)) return false;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      this.errors.push(`Invalid Ethereum address format: ${key} (${description})`);
      return false;
    }
    return true;
  }

  validatePrivateKey(key, description) {
    const value = process.env[key];
    if (!this.validateRequired(key, description)) return false;
    
    if (!/^0x[a-fA-F0-9]{64}$/.test(value)) {
      this.errors.push(`Invalid private key format: ${key} (${description})`);
      return false;
    }
    return true;
  }

  validateUrl(key, description) {
    const value = process.env[key];
    if (!this.validateRequired(key, description)) return false;
    
    try {
      new URL(value);
      return true;
    } catch {
      this.errors.push(`Invalid URL format: ${key} (${description})`);
      return false;
    }
  }

  validateDeploymentConfig() {
    console.log('🔍 Validating deployment configuration...');
    
    this.validatePrivateKey('DEPLOYER_PRIVATE_KEY', 'Contract deployment wallet');
    this.validateEthereumAddress('VAULT_OWNER_ADDRESS', 'Vault owner address');
    this.validateEthereumAddress('MNEE_TOKEN_ADDRESS', 'MNEE token contract');
    this.validateUrl('SEPOLIA_RPC_URL', 'Sepolia RPC endpoint');
    this.validateRequired('ETHERSCAN_API_KEY', 'Contract verification');
    
    return this.reportResults('Deployment');
  }

  validateAgentConfig() {
    console.log('🔍 Validating agent configuration...');
    
    this.validatePrivateKey('AGENT_1_PRIVATE_KEY', 'Primary agent wallet');
    this.validateEthereumAddress('AGENT_1_WALLET_ADDRESS', 'Primary agent address');
    this.validateEthereumAddress('VAULT_CONTRACT_ADDRESS', 'Deployed vault contract');
    this.validateUrl('RPC_URL', 'Agent RPC endpoint');
    this.validateEthereumAddress('RECIPIENT_WALLET_ADDRESS', 'Payment recipient');
    
    // Validate policy configuration
    this.validateRequired('AGENT_VALID_PURPOSES', 'Valid payment purposes');
    this.validateRequired('AGENT_MIN_AMOUNT', 'Minimum payment amount');
    this.validateRequired('AGENT_MAX_AMOUNT', 'Maximum payment amount');
    
    return this.reportResults('Agent');
  }

  validateFrontendConfig() {
    console.log('🔍 Validating frontend configuration...');
    
    this.validateRequired('NEXT_PUBLIC_ALCHEMY_API_KEY', 'Frontend RPC access');
    this.validateUrl('NEXT_PUBLIC_RPC_URL', 'Frontend RPC endpoint');
    this.validateEthereumAddress('NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS', 'Frontend vault contract');
    this.validateEthereumAddress('NEXT_PUBLIC_MNEE_TOKEN_ADDRESS', 'Frontend MNEE token');
    this.validateEthereumAddress('NEXT_PUBLIC_AGENT_1_ADDRESS', 'Frontend agent address');
    
    return this.reportResults('Frontend');
  }

  reportResults(component) {
    if (this.errors.length > 0) {
      console.error(`❌ ${component} configuration validation failed:`);
      this.errors.forEach(error => console.error(`   • ${error}`));
      console.error('\n💡 Check your .env file and ensure all required variables are set');
      return false;
    }
    
    if (this.warnings.length > 0) {
      console.warn(`⚠️  ${component} configuration warnings:`);
      this.warnings.forEach(warning => console.warn(`   • ${warning}`));
    }
    
    console.log(`✅ ${component} configuration validated successfully`);
    return true;
  }

  validateOrExit(component = 'all') {
    let valid = true;
    
    switch (component) {
      case 'deployment':
        valid = this.validateDeploymentConfig();
        break;
      case 'agent':
        valid = this.validateAgentConfig();
        break;
      case 'frontend':
        valid = this.validateFrontendConfig();
        break;
      case 'all':
        valid = this.validateDeploymentConfig() && 
                this.validateAgentConfig() && 
                this.validateFrontendConfig();
        break;
      default:
        console.error(`Unknown component: ${component}`);
        process.exit(1);
    }
    
    if (!valid) {
      console.error('\n🚨 CONFIGURATION VALIDATION FAILED');
      console.error('System cannot start with invalid configuration');
      process.exit(1);
    }
    
    console.log(`\n🚀 ${component} configuration ready for production use`);
  }
}

module.exports = EnvironmentValidator;