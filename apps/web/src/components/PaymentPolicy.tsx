'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useVaultData } from '@/hooks/useVaultData'
import { useContractWrite } from '@/hooks/useContractWrite'
import { 
  Shield, 
  Plus, 
  Trash2, 
  Settings,
  Users,
  Clock,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export function PaymentPolicy() {
  const agentAddress = process.env.NEXT_PUBLIC_AGENT_ADDRESS
  const contractAddress = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS
  const vaultData = useVaultData(agentAddress, contractAddress)
  const { executeTransaction, isLoading, isSuccess, error, txHash, resetState } = useContractWrite()
  
  const [dailyLimit, setDailyLimit] = useState('')
  const [newAddress, setNewAddress] = useState('')
  
  // Update daily limit from contract data
  useEffect(() => {
    if (vaultData.dailyLimit && !dailyLimit) {
      setDailyLimit(parseFloat(vaultData.dailyLimit).toString())
    }
  }, [vaultData.dailyLimit, dailyLimit])

  const updateDailyLimit = async () => {
    if (!contractAddress || !dailyLimit) return
    
    const limitWei = ethers.parseUnits(dailyLimit, 18)
    await executeTransaction(contractAddress, 'setDailyLimit', [limitWei])
  }

  const addAddress = async () => {
    if (!contractAddress || !newAddress || !ethers.isAddress(newAddress)) return
    
    const result = await executeTransaction(contractAddress, 'addRecipient', [newAddress])
    if (result.success) {
      setNewAddress('')
    }
  }

  const removeAddress = async (address: string) => {
    if (!contractAddress) return
    
    await executeTransaction(contractAddress, 'removeRecipient', [address])
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Payment Policy</h1>
        <p className="text-muted-foreground">Configure spending limits and authorized recipients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Limit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Spending Limit
            </CardTitle>
            <CardDescription>
              Maximum MNEE tokens that can be spent per day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder={vaultData.isLoading ? 'Loading...' : 'Enter daily limit'}
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">MNEE</span>
            </div>
            <Button 
              className="w-full" 
              onClick={updateDailyLimit}
              disabled={isLoading || !dailyLimit || vaultData.isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Updating...' : 'Update Daily Limit'}
            </Button>
            {isSuccess && (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="h-4 w-4" />
                Transaction confirmed: {txHash?.slice(0, 10)}...
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
            <CardDescription>
              Current policy enforcement status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Daily Limit</span>
                <span className="text-sm text-green-500">
                  {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.dailyLimit).toFixed(2)} MNEE`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Daily Spent</span>
                <span className="text-sm text-blue-500">
                  {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.dailySpent).toFixed(2)} MNEE`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Remaining</span>
                <span className="text-sm text-green-500">
                  {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.remainingAllowance).toFixed(2)} MNEE`}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                All security policies are enforced
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Whitelist Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Authorized Recipients
          </CardTitle>
          <CardDescription>
            Manage addresses that can receive payments from your vault
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Address */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter Ethereum address (0x...)"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              onClick={addAddress}
              disabled={isLoading || !newAddress || !ethers.isAddress(newAddress)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </div>

          {/* Note: Whitelist display requires contract extension */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              📝 Note: Whitelist display requires contract event indexing.
              Added addresses are stored on-chain but not displayed here.
              Use block explorer to verify whitelist changes.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction Status */}
      {(isSuccess || error) && (
        <Card className={isSuccess ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {isSuccess ? 'Transaction Successful' : 'Transaction Failed'}
              </span>
            </div>
            {txHash && (
              <p className="text-xs text-muted-foreground mt-1">
                Hash: {txHash}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetState}
              className="mt-2"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}