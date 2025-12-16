// MNEE Token Contract Address
export const MNEE_TOKEN_ADDRESS = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF";

// Type definitions for AgentPay
export interface Agent {
  id: string;
  address: string;
  name: string;
  permissions: string[];
}

export interface PaymentPolicy {
  id: string;
  maxAmount: bigint;
  dailyLimit: bigint;
  allowedRecipients: string[];
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: bigint;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}