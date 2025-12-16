'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useVaultData } from '@/hooks/useVaultData'
import { useTransactionHistory } from '@/hooks/useTransactionHistory'
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Loader2
} from 'lucide-react'

interface OverviewProps {
  agentAddress?: string
}

export function Overview({ agentAddress }: OverviewProps) {
  // Get real vault data from environment configuration
  const contractAddress = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS
  const vaultData = useVaultData(agentAddress, contractAddress)
  const { transactions, isLoading: txLoading } = useTransactionHistory(agentAddress, contractAddress)
  
  // Get recent transactions (last 3)
  const recentTransactions = transactions.slice(0, 3)
  
  // Check configuration status
  const isConfigured = agentAddress && contractAddress && !contractAddress.includes('1234567890')
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Monitor your MNEE vault and payment activity</p>
        {!isConfigured && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Configuration Required</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Deploy the AgentPayVault contract and update environment variables to see live data.
            </p>
          </div>
        )}
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vault Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.balance).toFixed(2)} MNEE`}
            </div>
            <p className="text-xs text-muted-foreground">
              {vaultData.error ? 'Error loading data' : 'Live on-chain balance'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Limit</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.dailyLimit).toFixed(2)} MNEE`}
            </div>
            <p className="text-xs text-muted-foreground">
              {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.remainingAllowance).toFixed(2)} MNEE remaining today`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Spending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.dailySpent).toFixed(2)} MNEE`}
            </div>
            <p className="text-xs text-muted-foreground">
              {vaultData.isLoading ? 'Loading...' : 'Spent today from on-chain data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground">
              All policies enforced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {txLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading transactions...</span>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No recent transactions</p>
                <p className="text-xs">Activity will appear here once you start using the vault</p>
              </div>
            ) : (
              recentTransactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {tx.type === 'deposit' ? (
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{tx.purpose}</p>
                      <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {parseFloat(tx.amount).toFixed(2)} MNEE
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your vault and payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Execute Payment
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Update Policy
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Wallet className="h-4 w-4" />
              Deposit MNEE
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}