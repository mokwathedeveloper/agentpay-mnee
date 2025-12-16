import { ethers } from 'ethers'

// MNEE Token Contract Address from environment
export const MNEE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MNEE_TOKEN_ADDRESS

if (!MNEE_TOKEN_ADDRESS) {
  console.error('NEXT_PUBLIC_MNEE_TOKEN_ADDRESS not configured in environment');
}

// RPC URL from environment
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL

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