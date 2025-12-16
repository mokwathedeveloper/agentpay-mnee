# Security Setup Guide

## Overview

AgentPay implements role-based wallet separation for maximum security. **NEVER use the same wallet for multiple roles in production.**

## Required Roles

### 1. Deployer Wallet
- **Purpose**: Deploy contracts and transfer ownership
- **Environment**: `DEPLOYER_PRIVATE_KEY`
- **Security**: Use a dedicated wallet, never your main wallet
- **After deployment**: Can be stored offline

### 2. Vault Owner Wallet  
- **Purpose**: Configure vault settings (limits, whitelist)
- **Environment**: `VAULT_OWNER_ADDRESS`
- **Security**: Should be a secure wallet (hardware wallet recommended)
- **Ongoing**: Needed for policy changes

### 3. Agent Wallet
- **Purpose**: Execute autonomous payments
- **Environment**: `AGENT_PRIVATE_KEY`
- **Security**: Separate from deployer and owner wallets
- **Funding**: Only fund with necessary MNEE tokens

## Secure Configuration Steps

### Step 1: Generate Secure Wallets

```bash
# Generate new wallets (use secure random generation)
# NEVER use online generators for production keys

# For each role, generate a unique wallet:
# - Deployer wallet
# - Vault owner wallet  
# - Agent wallet
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your REAL wallet addresses and keys
# NEVER commit .env to git
```

### Step 3: Validate Configuration

```bash
# Validate deployment environment
node -e "const SecureEnvValidator = require('./lib/secureEnvValidator'); new SecureEnvValidator().validateOrExit('deployment')"

# Validate agent environment
node -e "const SecureEnvValidator = require('./lib/secureEnvValidator'); new SecureEnvValidator().validateOrExit('agent')"
```

## Security Checklist

### ✅ Environment Security
- [ ] Different private keys for each role
- [ ] No placeholder values in production
- [ ] .env file not committed to git
- [ ] RPC URLs use real API keys
- [ ] All addresses are valid Ethereum addresses

### ✅ Wallet Security
- [ ] Deployer wallet is separate from main wallet
- [ ] Agent wallet has minimal MNEE funding
- [ ] Vault owner uses hardware wallet (recommended)
- [ ] Private keys stored securely (not in plain text)

### ✅ Network Security
- [ ] Using secure RPC endpoints (HTTPS)
- [ ] API keys are not shared or exposed
- [ ] Network configuration matches deployment target

## Common Security Issues

### 🚨 CRITICAL: Same Key for Multiple Roles
```bash
# BAD - Same key used for deployer and agent
DEPLOYER_PRIVATE_KEY=0xabc123...
AGENT_PRIVATE_KEY=0xabc123...  # SAME KEY - NEVER DO THIS
```

### 🚨 CRITICAL: Placeholder Values in Production
```bash
# BAD - Using example values
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef...  # PLACEHOLDER
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY  # PLACEHOLDER
```

### ⚠️ WARNING: Insufficient Separation
```bash
# RISKY - Same address for owner and agent
VAULT_OWNER_ADDRESS=0xabc123...
AGENT_WALLET_ADDRESS=0xabc123...  # SAME ADDRESS
```

## Production Deployment

### Pre-deployment Security Audit
1. Run security validation: `npm run validate-env`
2. Verify wallet separation
3. Test with small amounts first
4. Monitor all transactions

### Post-deployment Security
1. Transfer deployer key to cold storage
2. Set up monitoring for agent transactions
3. Regular security audits
4. Implement spending limits

## Emergency Procedures

### Compromised Agent Wallet
1. Immediately pause agent operations
2. Withdraw remaining funds from vault
3. Generate new agent wallet
4. Update whitelist and limits

### Compromised Vault Owner
1. Transfer ownership to new secure wallet
2. Update all access controls
3. Audit recent transactions
4. Notify stakeholders

## Security Resources

- [Ethereum Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Security Guidelines](https://docs.openzeppelin.com/contracts/4.x/security)
- [Hardware Wallet Guide](https://ethereum.org/en/wallets/)

---

**Remember: Security is not optional. Take time to implement proper security measures.**