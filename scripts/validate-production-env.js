#!/usr/bin/env node

/**
 * Production Environment Validation Script
 * Run before deployment or agent startup to ensure configuration is complete
 */

require('dotenv').config();
const EnvironmentValidator = require('../lib/envValidator');

function main() {
  const component = process.argv[2] || 'all';
  
  console.log('🔧 AgentPay Production Environment Validation');
  console.log('='.repeat(50));
  
  const validator = new EnvironmentValidator();
  
  try {
    validator.validateOrExit(component);
    console.log('\n✅ Environment validation passed');
    console.log('🚀 System ready for production operation');
  } catch (error) {
    console.error('\n❌ Environment validation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { EnvironmentValidator };