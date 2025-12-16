import { ethers } from 'ethers'

// MNEE Token Contract Address
export const MNEE_TOKEN_ADDRESS = '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF'

// AgentPayVault ABI (essential functions)
export const VAULT_ABI = [
  "function getAgentInfo(address agent) view returns (uint256 balance, uint256 dailyLimit, uint256 dailySpent)",
  "function getRemainingDailyAllowance(address agent) view returns (uint256)",
  "function isWhitelisted(address agent, address recipient) view returns (bool)",
  "function deposit(uint256 amount)",
  "function setDailyLimit(uint256 limit)",
  "function addRecipient(address recipient)",
  "function removeRecipient(address recipient)",
  "function executePayment(address recipient, uint256 amount, string purpose)",
  "event PaymentExecuted(address indexed agent, address indexed recipient, uint256 amount, string purpose)",
  "event Deposited(address indexed agent, uint256 amount)"
]

// Contract instance factory
export function getVaultContract(provider: ethers.Provider, contractAddress: string) {
  return new ethers.Contract(contractAddress, VAULT_ABI, provider)
}

// Get signer for transactions
export function getVaultContractWithSigner(signer: ethers.Signer, contractAddress: string) {
  return new ethers.Contract(contractAddress, VAULT_ABI, signer)
}