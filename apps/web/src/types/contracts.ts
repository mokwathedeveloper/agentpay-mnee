// Contract type definitions

export interface AgentPayVaultContract {
  // TODO: Add contract interface definitions
}

export interface MNEETokenContract {
  address: string
  symbol: string
  decimals: number
}

export interface PaymentPolicy {
  id: string
  agentId: string
  maxAmount: string
  dailyLimit: string
  allowedRecipients: string[]
  isActive: boolean
}