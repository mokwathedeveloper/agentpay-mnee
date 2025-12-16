#!/usr/bin/env node
/**
 * Environment Validation Script
 * Run this script to validate your environment configuration
 */

require('dotenv').config();
const EnvValidator = require('../lib/envValidator');

function main() {
  console.log('🔍 AgentPay Environment Validation\n');
  
  const args = process.argv.slice(2);
  const validationType = args[0] || 'agent';
  
  if (!['deployment', 'agent'].includes(validationType)) {
    console.log('❌ Invalid validation type. Use: deployment | agent');
    console.log('\nUsage:');
    console.log('  node scripts/validate-env.js deployment  # Validate deployment environment');
    console.log('  node scripts/validate-env.js agent       # Validate agent environment');
    process.exit(1);
  }
  
  console.log(`📋 Validating ${validationType} environment...\n`);
  
  const validator = new EnvValidator();
  const success = validator.validateOrExit(validationType);
  
  if (success) {
    console.log('\n🎉 Environment validation completed successfully!');
    console.log('✅ Your configuration is ready for use.');
    
    if (validationType === 'deployment') {
      console.log('\n💡 Next steps:');
      console.log('1. Run: npm run compile');
      console.log('2. Run: npm run test');
      console.log('3. Deploy: npx hardhat run scripts/deploy.js --network sepolia');
    } else {
      console.log('\n💡 Next steps:');
      console.log('1. Ensure vault contract is deployed');
      console.log('2. Fund agent wallet with MNEE tokens');
      console.log('3. Configure vault (deposit, limits, whitelist)');
      console.log('4. Run: node apps/agent/paymentAgent.js');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = main;