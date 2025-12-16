'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getVaultContract } from '@/lib/contracts'

interface Transaction {
  id: string
  type: 'payment' | 'deposit'
  amount: string
  recipient: string
  purpose: string
  status: 'confirmed' | 'pending' | 'failed'
  timestamp: string
  block: string
  txHash: string
}

interface TransactionStats {
  totalTransactions: number
  thisMonth: number
  totalSpent: string
  successRate: string
}

export function useTransactionHistory(agentAddress?: string, contractAddress?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    thisMonth: 0,
    totalSpent: '0',
    successRate: '0'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!agentAddress || !contractAddress) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        if (!window.ethereum) {
          throw new Error('No wallet provider found')
        }

        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = getVaultContract(provider, contractAddress)

        // Get recent PaymentExecuted events
        const currentBlock = await provider.getBlockNumber()
        const fromBlock = Math.max(0, currentBlock - 10000) // Last ~10k blocks

        const paymentFilter = contract.filters.PaymentExecuted(agentAddress)
        const depositFilter = contract.filters.Deposited(agentAddress)

        const [paymentEvents, depositEvents] = await Promise.all([
          contract.queryFilter(paymentFilter, fromBlock, currentBlock),
          contract.queryFilter(depositFilter, fromBlock, currentBlock)
        ])

        // Process payment events
        const paymentTxs = await Promise.all(
          paymentEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber)
            const args = event.args as any
            
            return {
              id: event.transactionHash.slice(0, 10) + '...',
              type: 'payment' as const,
              amount: `-${ethers.formatUnits(args.amount, 18)}`,
              recipient: args.recipient,
              purpose: args.purpose || 'Payment transaction',
              status: 'confirmed' as const,
              timestamp: formatTimestamp(block?.timestamp || 0),
              block: event.blockNumber.toString(),
              txHash: event.transactionHash
            }
          })
        )

        // Process deposit events
        const depositTxs = await Promise.all(
          depositEvents.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber)
            const args = event.args as any
            
            return {
              id: event.transactionHash.slice(0, 10) + '...',
              type: 'deposit' as const,
              amount: `+${ethers.formatUnits(args.amount, 18)}`,
              recipient: 'Vault Deposit',
              purpose: 'Vault funding',
              status: 'confirmed' as const,
              timestamp: formatTimestamp(block?.timestamp || 0),
              block: event.blockNumber.toString(),
              txHash: event.transactionHash
            }
          })
        )

        // Combine and sort by block number (newest first)
        const allTxs = [...paymentTxs, ...depositTxs].sort(
          (a, b) => parseInt(b.block) - parseInt(a.block)
        )

        setTransactions(allTxs)

        // Calculate stats
        const totalSpent = paymentTxs.reduce((sum, tx) => {
          return sum + parseFloat(tx.amount.replace('-', ''))
        }, 0)

        const thisMonth = allTxs.filter(tx => {
          const txTime = new Date(tx.timestamp)
          const now = new Date()
          return txTime.getMonth() === now.getMonth() && txTime.getFullYear() === now.getFullYear()
        }).length

        setStats({
          totalTransactions: allTxs.length,
          thisMonth,
          totalSpent: totalSpent.toFixed(2),
          successRate: allTxs.length > 0 ? '100.0' : '0' // All on-chain events are successful
        })

      } catch (err: any) {
        console.error('Failed to fetch transaction history:', err)
        setError(err.message || 'Failed to load transaction history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionHistory()
  }, [agentAddress, contractAddress])

  return { transactions, stats, isLoading, error }
}

function formatTimestamp(timestamp: number): string {
  if (!timestamp) return 'Unknown'
  
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Less than 1 hour ago'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}