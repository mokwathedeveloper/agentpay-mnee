# Payment Agent

AI-powered autonomous payment agent for MNEE token transactions.

## Setup

1. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your values:
# AGENT_PRIVATE_KEY=your_private_key
# VAULT_CONTRACT_ADDRESS=deployed_vault_address
# RPC_URL=your_ethereum_rpc_url
```

2. Run the agent:
```bash
node agent/paymentAgent.js
```

## Features

- **Policy Validation**: Checks balance, daily limits, and purpose
- **Whitelist Verification**: Ensures recipients are authorized
- **Decision Logging**: Clear audit trail of all decisions
- **Simulation Mode**: Test scenarios without real transactions

## AI Decision Rules

1. **Balance Check**: Sufficient MNEE tokens in vault
2. **Daily Limit**: Within configured spending allowance
3. **Purpose Validation**: Approved payment categories
4. **Whitelist**: Recipient must be pre-approved

## Usage

The agent simulates autonomous payment decisions based on:
- Vault balance and limits
- Recipient whitelist status
- Purpose classification
- Risk assessment policies