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
      // Check if configuration is missing
      if (!agentAddress || !contractAddress) {
        setData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Vault not configured. Deploy contract and update environment variables.' 
        }))
        return
      }

      // Check if addresses are placeholder values
      if (contractAddress.includes('1234567890') || agentAddress.includes('8ba1f109551bD432')) {
        setData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Using placeholder addresses. Update .env with real deployed contract address.' 
        }))
        return
      }

      try {
        // Use environment RPC or fallback
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
        if (!rpcUrl || rpcUrl.includes('YOUR_')) {
          setData(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'RPC URL not configured. Update NEXT_PUBLIC_RPC_URL in environment.' 
          }))
          return
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const contract = getVaultContract(provider, contractAddress)

        // Test contract existence
        const code = await provider.getCode(contractAddress)
        if (code === '0x') {
          setData(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'Contract not found at address. Verify deployment and network.' 
          }))
          return
        }

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
        let errorMessage = 'Failed to fetch data'
        
        if (error instanceof Error) {
          if (error.message.includes('network')) {
            errorMessage = 'Network connection failed. Check RPC URL.'
          } else if (error.message.includes('revert')) {
            errorMessage = 'Contract call failed. Verify agent is registered.'
          } else {
            errorMessage = error.message
          }
        }
        
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }))
      }
    }

    fetchVaultData()
    
    // Only set interval if we have valid configuration
    if (agentAddress && contractAddress && !contractAddress.includes('1234567890')) {
      const interval = setInterval(fetchVaultData, 30000)
      return () => clearInterval(interval)
    }
  }, [agentAddress, contractAddress])

  return data
}