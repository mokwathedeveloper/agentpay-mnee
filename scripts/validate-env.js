#!/usr/bin/env node

/**
 * Environment Validation Script
 * Run this before deployment or agent startup to ensure secure configuration
 */

require('dotenv').config();
const SecureEnvValidator = require('../lib/secureEnvValidator');

function main() {
  const args = process.argv.slice(2);
  const validationType = args[0] || 'agent';
  
  console.log('🔒 AgentPay Security Validation');
  console.log('================================');
  
  if (!['deployment', 'agent'].includes(validationType)) {
    console.error('❌ Invalid validation type. Use: deployment or agent');
    process.exit(1);
  }
  
  const validator = new SecureEnvValidator();
  
  try {
    validator.validateOrExit(validationType);
    console.log('\n🎉 Environment validation completed successfully!');
    console.log('✅ Configuration is secure and ready for use');
  } catch (error) {
    console.error('\n💥 Validation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;