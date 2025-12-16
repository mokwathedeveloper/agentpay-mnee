'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useVaultData } from '@/hooks/useVaultData'
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Settings
} from 'lucide-react'

export function Overview() {
  // Get real vault data from environment configuration
  const agentAddress = process.env.NEXT_PUBLIC_AGENT_ADDRESS
  const contractAddress = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS
  const vaultData = useVaultData(agentAddress, contractAddress)
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Monitor your MNEE vault and payment activity</p>
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
            <CardTitle className="text-sm font-medium">Today's Spending</CardTitle>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">API Service Payment</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <span className="text-sm font-medium">-15.00 MNEE</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Data Purchase</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <span className="text-sm font-medium">-10.00 MNEE</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowDownRight className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Vault Deposit</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <span className="text-sm font-medium">+500.00 MNEE</span>
            </div>
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