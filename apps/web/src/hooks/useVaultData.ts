'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getVaultContract } from '@/lib/contracts'

interface VaultData {
  balance: string
  dailyLimit: string
  dailySpent: string
  remainingAllowance: string
  isLoading: boolean
  error: string | null
}

export function useVaultData(agentAddress?: string, contractAddress?: string) {
  const [data, setData] = useState<VaultData>({
    balance: '0',
    dailyLimit: '0',
    dailySpent: '0',
    remainingAllowance: '0',
    isLoading: true,
    error: null
  })

  useEffect(() => {
    async function fetchVaultData() {
      if (!agentAddress || !contractAddress) {
        setData(prev => ({ ...prev, isLoading: false, error: 'Missing address configuration' }))
        return
      }

      try {
        // Use environment RPC or fallback to public endpoint
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo'
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const contract = getVaultContract(provider, contractAddress)

        // Fetch real on-chain data
        const [balance, dailyLimit, dailySpent] = await contract.getAgentInfo(agentAddress)
        const remainingAllowance = await contract.getRemainingDailyAllowance(agentAddress)

        setData({
          balance: ethers.formatUnits(balance, 18),
          dailyLimit: ethers.formatUnits(dailyLimit, 18),
          dailySpent: ethers.formatUnits(dailySpent, 18),
          remainingAllowance: ethers.formatUnits(remainingAllowance, 18),
          isLoading: false,
          error: null
        })
      } catch (error) {
        console.error('Failed to fetch vault data:', error)
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch data'
        }))
      }
    }

    fetchVaultData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchVaultData, 30000)
    return () => clearInterval(interval)
  }, [agentAddress, contractAddress])

  return data
}