# AgentPay MNEE

Policy-based autonomous payments using MNEE stablecoin for AI agents.

## Project Structure

```
agentpay-mnee/
├── contracts/          # Smart contracts (Solidity)
├── scripts/           # Deployment scripts
├── test/              # Smart contract tests
├── frontend/          # Next.js frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/      # Next.js pages
│       ├── lib/        # Utilities
│       └── types/      # TypeScript types
└── docs/              # Documentation
```

## Setup Commands

```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Start development server
npm run dev
```

## MNEE Token

Contract Address: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in required environment variables
3. Never commit real private keys

## Tech Stack

- **Smart Contracts**: Hardhat, Solidity, OpenZeppelin
- **Frontend**: Next.js, TypeScript, ethers.js
- **UI**: shadcn/ui, Tailwind CSS
- **Testing**: Hardhat Test Framework