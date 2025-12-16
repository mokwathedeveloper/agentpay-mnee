'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

const transactions = [
  {
    id: '0x1a2b3c...',
    type: 'payment',
    amount: '-15.00',
    recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
    purpose: 'API service payment for data processing',
    status: 'confirmed',
    timestamp: '2 hours ago',
    block: '18,234,567'
  },
  {
    id: '0x2b3c4d...',
    type: 'payment',
    amount: '-10.00',
    recipient: '0x8ba1f109551bD432803012645Hac136c30C6756M',
    purpose: 'Monthly subscription renewal',
    status: 'confirmed',
    timestamp: '5 hours ago',
    block: '18,234,445'
  },
  {
    id: '0x3c4d5e...',
    type: 'deposit',
    amount: '+500.00',
    recipient: 'Vault Deposit',
    purpose: 'Initial vault funding',
    status: 'confirmed',
    timestamp: '1 day ago',
    block: '18,233,890'
  },
  {
    id: '0x4d5e6f...',
    type: 'payment',
    amount: '-25.00',
    recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
    purpose: 'Data purchase transaction',
    status: 'pending',
    timestamp: '2 days ago',
    block: 'Pending'
  },
  {
    id: '0x5e6f7g...',
    type: 'payment',
    amount: '-5.00',
    recipient: '0x9cb2f209661cE432903022645Hac146c40D6866N',
    purpose: 'API usage fee',
    status: 'failed',
    timestamp: '3 days ago',
    block: 'Failed'
  }
]

export function TransactionHistory() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500'
      case 'pending':
        return 'text-yellow-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">View all vault transactions and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">1,245 MNEE</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">98.4%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest vault activity and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {tx.type === 'deposit' ? (
                      <ArrowDownRight className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    )}
                    {getStatusIcon(tx.status)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tx.purpose}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)} bg-current/10`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>To: {tx.recipient.length > 20 ? `${tx.recipient.slice(0, 10)}...${tx.recipient.slice(-8)}` : tx.recipient}</span>
                      <span>{tx.timestamp}</span>
                      {tx.block !== 'Pending' && tx.block !== 'Failed' && (
                        <span>Block: {tx.block}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-medium ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount} MNEE
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {tx.id}
                    </p>
                  </div>
                  
                  {tx.status === 'confirmed' && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline">
              Load More Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}