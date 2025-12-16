'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useVaultData } from '@/hooks/useVaultData'
import { useContractWrite } from '@/hooks/useContractWrite'
import { 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Wallet,
  Clock,
  Shield,
  Loader2
} from 'lucide-react'

export function ExecutePayment() {
  const agentAddress = process.env.NEXT_PUBLIC_AGENT_ADDRESS
  const contractAddress = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS
  const vaultData = useVaultData(agentAddress, contractAddress)
  const { executeTransaction, isLoading, isSuccess, error, txHash, resetState } = useContractWrite()
  
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [isWhitelistChecked, setIsWhitelistChecked] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState(false)

  // Check whitelist status when recipient changes
  useEffect(() => {
    const checkWhitelist = async () => {
      if (!recipient || !ethers.isAddress(recipient) || !contractAddress) {
        setIsWhitelistChecked(false)
        setIsWhitelisted(false)
        return
      }

      try {
        if (!window.ethereum) return
        
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, [
          "function isWhitelisted(address agent, address recipient) view returns (bool)"
        ], provider)
        
        const whitelisted = await contract.isWhitelisted(agentAddress, recipient)
        setIsWhitelisted(whitelisted)
        setIsWhitelistChecked(true)
      } catch (error) {
        console.error('Failed to check whitelist:', error)
        setIsWhitelistChecked(false)
        setIsWhitelisted(false)
      }
    }

    checkWhitelist()
  }, [recipient, agentAddress, contractAddress])

  const handlePayment = async () => {
    if (!contractAddress || !recipient || !amount || !purpose) return
    
    const amountWei = ethers.parseUnits(amount, 18)
    await executeTransaction(contractAddress, 'executePayment', [recipient, amountWei, purpose])
  }

  const isValidAddress = ethers.isAddress(recipient)
  const remainingAllowance = parseFloat(vaultData.remainingAllowance || '0')
  const amountNum = parseFloat(amount || '0')
  const isValidAmount = amountNum > 0 && amountNum <= remainingAllowance
  const canExecute = isValidAddress && isValidAmount && purpose.trim().length > 0 && isWhitelisted && !vaultData.isLoading

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Execute Payment</h1>
        <p className="text-muted-foreground">Send MNEE tokens to authorized recipients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Enter recipient address, amount, and purpose
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Address</label>
                <Input
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                {recipient && !isValidAddress && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Invalid Ethereum address
                  </p>
                )}
                {isValidAddress && (
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Valid address format
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <span className="text-sm text-muted-foreground">MNEE</span>
                </div>
                {amount && !isValidAmount && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Amount exceeds daily allowance ({parseFloat(vaultData.remainingAllowance || '0').toFixed(2)} MNEE)
                  </p>
                )}
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Purpose</label>
                <Textarea
                  placeholder="Describe the purpose of this payment..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This will be recorded on-chain for audit purposes
                </p>
              </div>

              {/* Execute Button */}
              <Button 
                className="w-full" 
                disabled={!canExecute || isLoading}
                onClick={handlePayment}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Execute Payment
                  </>
                )}
              </Button>
              
              {isSuccess && (
                <div className="flex items-center gap-2 text-green-500 text-sm mt-2">
                  <CheckCircle className="h-4 w-4" />
                  Payment executed: {txHash?.slice(0, 10)}...
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Vault Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Balance</span>
                  <span className="text-sm font-medium">
                    {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.balance).toFixed(2)} MNEE`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Daily Limit</span>
                  <span className="text-sm font-medium">
                    {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.dailyLimit).toFixed(2)} MNEE`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Remaining Today</span>
                  <span className="text-sm font-medium">
                    {vaultData.isLoading ? 'Loading...' : `${parseFloat(vaultData.remainingAllowance).toFixed(2)} MNEE`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Policy Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Recipient Whitelisted</span>
                {!isWhitelistChecked ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isWhitelisted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sufficient Balance</span>
                {vaultData.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : parseFloat(vaultData.balance) >= amountNum ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Within Daily Limit</span>
                {vaultData.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isValidAmount ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </CardContent>
          </Card>

          {canExecute && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready to Execute</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All policy checks passed
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}