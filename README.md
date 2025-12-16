# AgentPay MNEE

> **Policy-based autonomous payments using MNEE stablecoin for AI agents**

AgentPay MNEE is a comprehensive Web3 platform that enables AI agents to make secure, autonomous payments using the MNEE stablecoin. The system combines smart contract security with intelligent policy enforcement to create a trustless payment infrastructure for artificial intelligence applications.

## 🏗️ Architecture Overview

The AgentPay system consists of three core components working together:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Dashboard UI  │    │   Payment Agent  │    │  Smart Contract │
│                 │    │                  │    │                 │
│ • Vault Mgmt    │◄──►│ • Policy Engine  │◄──►│ • AgentPayVault │
│ • Policy Config │    │ • Decision Logic │    │ • MNEE Token    │
│ • Tx History    │    │ • Tx Execution   │    │ • Security      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    ┌──────────────────┐
                    │  Ethereum Network │
                    │                  │
                    │ • MNEE Token     │
                    │ • Transaction    │
                    │ • Event Logs     │
                    └──────────────────┘
```

### Component Details

**🔐 AgentPayVault Smart Contract**
- Secure MNEE token custody and management
- Daily spending limits with automatic resets
- Recipient whitelisting for authorized payments
- Comprehensive event logging for audit trails
- OpenZeppelin security standards (ReentrancyGuard, SafeERC20)

**🤖 AI Payment Agent**
- Policy-based decision engine for autonomous payments
- Real-time vault status monitoring and validation
- Multi-layered security checks (balance, limits, whitelist)
- Comprehensive transaction logging and error handling

**💻 Dashboard Interface**
- Professional dark-themed UI for vault management
- Real-time balance and spending limit monitoring
- Policy configuration and recipient management
- Transaction history with detailed status tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Ethereum wallet with MNEE tokens
- RPC endpoint (Alchemy, Infura, or local node)

### Installation

```bash
# Clone the repository
git clone https://github.com/mokwathedeveloper/agentpay-mnee.git
cd agentpay-mnee

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your configuration
```

### Environment Configuration

**🔐 SECURITY FIRST**: AgentPay uses role-based wallet separation for maximum security.

```bash
# Copy and configure environment
cp .env.example .env

# Edit .env with your secure configuration
# See docs/security-setup.md for detailed instructions
```

**Required Roles:**
- **Deployer Wallet**: Contract deployment and ownership
- **Agent Wallet**: Autonomous payment execution  
- **Vault Owner**: Vault configuration and management

**⚠️ NEVER use the same wallet for multiple roles in production!**

### Security Validation

```bash
# Validate deployment environment
npm run validate-deployment

# Validate agent environment  
npm run validate-agent

# General validation
npm run validate-env
```

### Development Workflow

```bash
# 1. Configure secure environment
cp .env.example .env
# Edit .env with your REAL wallet addresses and keys
# NEVER use placeholder values in production

# 2. Validate environment security
npm run validate-deployment

# 3. Compile smart contracts
npm run compile

# 4. Run contract tests
npm run test

# 5. Deploy contracts (testnet)
npx hardhat run scripts/deploy.js --network sepolia

# 6. Update .env with deployed contract address
# Set VAULT_CONTRACT_ADDRESS and NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS

# 7. Validate agent environment
npm run validate-agent

# 8. Start dashboard
cd apps/web && npm run dev

# 9. Run payment agent (in separate terminal)
cd apps/agent && node paymentAgent.js
```

## 💰 MNEE Token Integration

### Token Details
- **Contract Address**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`
- **Network**: Ethereum Mainnet
- **Standard**: ERC-20
- **Decimals**: 18

### How MNEE Powers AgentPay

1. **Vault Deposits**: Users deposit MNEE tokens into AgentPayVault contracts
2. **Policy Enforcement**: Daily spending limits configured in MNEE amounts
3. **Autonomous Payments**: AI agents execute payments using MNEE tokens
4. **Balance Tracking**: Real-time MNEE balance monitoring and reporting
5. **Transaction History**: All MNEE transfers logged with purpose strings

### MNEE Usage Flow

```
1. User deposits MNEE → AgentPayVault
2. Agent queries MNEE balance and limits
3. Policy engine validates MNEE amount
4. Smart contract transfers MNEE to recipient
5. Dashboard displays MNEE transaction history
```

## 🔒 Security Architecture

### Smart Contract Security

**OpenZeppelin Standards**
- `ReentrancyGuard`: Prevents reentrancy attacks on critical functions
- `SafeERC20`: Secure token transfers with proper error handling
- `Ownable`: Access control for administrative functions

**Policy Enforcement**
- Daily spending limits with automatic UTC-based resets
- Recipient whitelisting prevents unauthorized transfers
- Balance validation ensures sufficient funds before execution
- Comprehensive input validation on all parameters

**Audit Trail**
- All transactions emit detailed events for monitoring
- Purpose strings recorded on-chain for compliance
- Transaction status tracking (pending, confirmed, failed)

### Agent Security

**Private Key Management**
- Environment-based key isolation
- No hardcoded credentials in source code
- Secure key rotation capabilities

**Decision Validation**
- Multi-layered policy checks before execution
- Real-time vault status verification
- Comprehensive error handling and logging

**Network Security**
- Configurable RPC endpoints for redundancy
- Transaction confirmation requirements
- Gas estimation and optimization

### Operational Security

**Access Control**
- Agent-specific vault isolation
- Whitelist-only payment recipients
- Administrative function protection

**Monitoring & Alerts**
- Real-time transaction monitoring
- Policy violation detection
- Comprehensive audit logging

**Risk Management**
- Daily spending limits prevent large losses
- Emergency pause capabilities (future enhancement)
- Multi-signature support (future enhancement)

## 📁 Project Structure

```
agentpay-mnee/
├── contracts/                 # Smart contracts
│   └── AgentPayVault.sol     # Main vault contract
├── scripts/                  # Deployment scripts
│   └── deploy.js            # Contract deployment
├── test/                    # Contract tests
│   └── AgentPayVault.test.js # Comprehensive tests
├── agent/                   # AI payment agent
│   ├── paymentAgent.js      # Main agent logic
│   └── README.md           # Agent documentation
├── frontend/               # Next.js dashboard
│   ├── src/
│   │   ├── app/           # Next.js 14 app router
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and Web3 integration
│   │   └── types/        # TypeScript definitions
│   ├── package.json      # Frontend dependencies
│   └── tailwind.config.js # Styling configuration
├── docs/                  # Documentation
├── .env.example          # Environment template
├── hardhat.config.js     # Hardhat configuration
└── package.json         # Root dependencies
```

## 🛠️ Technology Stack

### Blockchain & Smart Contracts
- **Hardhat**: Development environment and testing framework
- **Solidity 0.8.20**: Smart contract programming language
- **OpenZeppelin**: Security-audited contract libraries
- **ethers.js v6**: Ethereum interaction library

### Frontend & UI
- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Professional component library
- **Lucide React**: Consistent icon system

### AI Agent & Backend
- **Node.js**: JavaScript runtime for agent logic
- **ethers.js**: Blockchain interaction and transaction management
- **dotenv**: Environment variable management

## 📊 Usage Examples

### Dashboard Operations

```typescript
// Vault balance monitoring
const balance = await vaultContract.getAgentInfo(agentAddress)
console.log(`Balance: ${ethers.formatUnits(balance.balance, 18)} MNEE`)

// Set daily spending limit
await vaultContract.setDailyLimit(ethers.parseUnits("100", 18))

// Add recipient to whitelist
await vaultContract.addRecipient("0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e")
```

### Agent Payment Execution

```javascript
// Initialize payment agent
const agent = new PaymentAgent()

// Execute autonomous payment
const result = await agent.executePayment(
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e",
  "10",
  "API service payment for data processing"
)

if (result.success) {
  console.log(`Payment executed: ${result.txHash}`)
} else {
  console.log(`Payment failed: ${result.reason}`)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **MNEE Token**: [0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF](https://etherscan.io/token/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF)
- **Security Setup**: [./docs/security-setup.md](./docs/security-setup.md)
- **Documentation**: [./docs/](./docs/)
- **Agent Guide**: [./apps/agent/README.md](./apps/agent/README.md)

---

**Built with ❤️ for the future of autonomous AI payments**