import { ethers } from 'ethers'

// MNEE Token Contract Address
export const MNEE_TOKEN_ADDRESS = '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF'

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

// TODO: Add Web3 utility functions
// - Connect wallet
// - Get MNEE token balance
// - Interact with AgentPayVault contract

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}