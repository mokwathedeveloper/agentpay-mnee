# Security Setup Guide

## 🔐 Environment Configuration

AgentPay uses role-based wallet separation for maximum security. Each role has specific responsibilities and should use different wallets.

### 🎭 Wallet Roles

#### 1. **Deployer Wallet** (DEPLOYER_PRIVATE_KEY)
- **Purpose**: Deploy and own AgentPayVault contracts
- **Responsibilities**: Contract deployment, ownership management
- **Security**: Use a dedicated deployment wallet, never your main wallet

#### 2. **Agent Wallet** (AGENT_PRIVATE_KEY)  
- **Purpose**: Execute autonomous payments
- **Responsibilities**: Payment execution, policy validation
- **Security**: Separate from deployment wallet, limited MNEE balance

#### 3. **Vault Owner** (VAULT_OWNER_ADDRESS)
- **Purpose**: Configure vault settings
- **Responsibilities**: Set limits, manage whitelist, deposit/withdraw
- **Security**: Can be same as deployer or separate for additional security

### 🛠️ Setup Process

#### Step 1: Generate Wallets
```bash
# Generate new wallets (use a secure method)
# NEVER use these example keys in production

# Deployer wallet
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Agent wallet  
AGENT_PRIVATE_KEY=0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```

#### Step 2: Configure Environment
```bash
# Copy example configuration
cp .env.example .env

# Edit .env with your real values
nano .env
```

#### Step 3: Validate Configuration
```bash
# Test deployment environment
node -e "const EnvValidator = require('./lib/envValidator'); new EnvValidator().validateOrExit('deployment')"

# Test agent environment
node -e "const EnvValidator = require('./lib/envValidator'); new EnvValidator().validateOrExit('agent')"
```

### 🚨 Security Checklist

- [ ] **Different wallets** for deployer and agent roles
- [ ] **No hardcoded keys** in source code
- [ ] **Placeholder keys replaced** with real values
- [ ] **RPC URLs configured** with real API keys
- [ ] **Environment validation** passes without errors
- [ ] **.env file excluded** from git commits
- [ ] **Backup private keys** stored securely offline

### 🔍 Environment Validation

The system automatically validates environment variables on startup:

```javascript
// Automatic validation in agent
const validator = new EnvValidator();
validator.validateOrExit('agent');
```

**Validation Checks:**
- ✅ Private key format (64-char hex with 0x prefix)
- ✅ Ethereum address format validation
- ✅ RPC URL format and accessibility
- ✅ Required environment variables present
- ⚠️ Placeholder detection and warnings

### 🛡️ Best Practices

#### Private Key Security
- **Never commit** private keys to version control
- **Use hardware wallets** for production deployments
- **Rotate keys regularly** for long-running agents
- **Limit wallet balances** to minimize exposure

#### Network Security
- **Use dedicated RPC endpoints** for production
- **Configure rate limiting** on RPC providers
- **Monitor transaction patterns** for anomalies
- **Set up alerts** for unusual activity

#### Operational Security
- **Separate environments** (dev/staging/prod)
- **Regular security audits** of configurations
- **Monitor vault balances** and spending patterns
- **Implement emergency procedures** for incidents

### 🚨 Emergency Procedures

#### Compromised Agent Wallet
1. **Immediately pause** agent operations
2. **Transfer remaining MNEE** from vault to secure wallet
3. **Generate new agent wallet** and update configuration
4. **Review transaction history** for unauthorized payments
5. **Update whitelist** if necessary

#### Compromised Deployer Wallet
1. **Transfer contract ownership** to new secure wallet
2. **Update deployment configuration**
3. **Audit all deployed contracts**
4. **Consider redeployment** if necessary

### 📞 Support

For security issues or questions:
- Review this documentation thoroughly
- Check environment validation output
- Verify wallet addresses and balances
- Test with small amounts first

**Remember**: Security is paramount in Web3. Take time to properly configure and validate your environment before deploying to mainnet.