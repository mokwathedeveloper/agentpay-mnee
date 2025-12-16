'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { getVaultContractWithSigner } from '@/lib/contracts'

interface TransactionState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  txHash: string | null
}

export function useContractWrite() {
  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    txHash: null
  })

  const executeTransaction = async (
    contractAddress: string,
    functionName: string,
    args: any[]
  ) => {
    setTxState({ isLoading: true, isSuccess: false, error: null, txHash: null })

    try {
      // Get wallet provider
      if (!window.ethereum) {
        throw new Error('No wallet found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = getVaultContractWithSigner(signer, contractAddress)

      // Execute transaction
      const tx = await contract[functionName](...args)
      setTxState(prev => ({ ...prev, txHash: tx.hash }))

      // Wait for confirmation
      const receipt = await tx.wait()
      
      setTxState({
        isLoading: false,
        isSuccess: true,
        error: null,
        txHash: receipt.hash
      })

      return { success: true, txHash: receipt.hash, receipt }
    } catch (error: any) {
      setTxState({
        isLoading: false,
        isSuccess: false,
        error: error.message || 'Transaction failed',
        txHash: null
      })
      return { success: false, error: error.message }
    }
  }

  const resetState = () => {
    setTxState({ isLoading: false, isSuccess: false, error: null, txHash: null })
  }

  return {
    ...txState,
    executeTransaction,
    resetState
  }
}