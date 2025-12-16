import { ethers } from 'ethers'

// MNEE Token Contract Address from environment
export const MNEE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MNEE_TOKEN_ADDRESS

if (!MNEE_TOKEN_ADDRESS) {
  console.error('NEXT_PUBLIC_MNEE_TOKEN_ADDRESS not configured in environment');
}

// Vault Contract Address from environment
export const VAULT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS

// Multi-Agent Addresses from environment
export const AGENT_ADDRESSES = {
  '1': process.env.NEXT_PUBLIC_AGENT_1_ADDRESS,
  '2': process.env.NEXT_PUBLIC_AGENT_2_ADDRESS,
  '3': process.env.NEXT_PUBLIC_AGENT_3_ADDRESS
}

// Legacy single agent support
export const AGENT_ADDRESS = process.env.NEXT_PUBLIC_AGENT_ADDRESS || AGENT_ADDRESSES['1']

// Get agent address by ID
export function getAgentAddress(agentId: string): string | undefined {
  return AGENT_ADDRESSES[agentId as keyof typeof AGENT_ADDRESSES]
}

// Get all configured agents
export function getConfiguredAgents(): Array<{id: string, address: string, name: string}> {
  return Object.entries(AGENT_ADDRESSES)
    .filter(([_, address]) => address)
    .map(([id, address]) => ({
      id,
      address: address!,
      name: `Agent ${id}`
    }))
}

// AgentPayVault ABI (complete interface)
export const VAULT_ABI = [
  // View functions
  "function getAgentInfo(address agent) view returns (uint256 balance, uint256 dailyLimit, uint256 dailySpent)",
  "function getRemainingDailyAllowance(address agent) view returns (uint256)",
  "function isWhitelisted(address agent, address recipient) view returns (bool)",
  
  // State-changing functions
  "function deposit(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function setDailyLimit(uint256 limit)",
  "function addRecipient(address recipient)",
  "function removeRecipient(address recipient)",
  "function executePayment(address recipient, uint256 amount, string purpose)",
  
  // Events for monitoring
  "event PaymentExecuted(address indexed agent, address indexed recipient, uint256 amount, string purpose)",
  "event Deposited(address indexed agent, uint256 amount)",
  "event Withdrawn(address indexed agent, uint256 amount)",
  "event DailyLimitSet(address indexed agent, uint256 newLimit)",
  "event RecipientWhitelisted(address indexed agent, address indexed recipient)",
  "event RecipientRemoved(address indexed agent, address indexed recipient)"
]

// Contract instance factory
export function getVaultContract(provider: ethers.Provider, contractAddress: string) {
  return new ethers.Contract(contractAddress, VAULT_ABI, provider)
}

// Get signer for transactions
export function getVaultContractWithSigner(signer: ethers.Signer, contractAddress: string) {
  return new ethers.Contract(contractAddress, VAULT_ABI, signer)
}