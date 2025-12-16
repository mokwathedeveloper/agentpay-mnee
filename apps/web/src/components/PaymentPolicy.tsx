'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Plus, 
  Trash2, 
  Settings,
  Users,
  Clock,
  DollarSign
} from 'lucide-react'

export function PaymentPolicy() {
  const [dailyLimit, setDailyLimit] = useState('100')
  const [whitelist, setWhitelist] = useState([
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
    '0x8ba1f109551bD432803012645Hac136c30C6756M'
  ])
  const [newAddress, setNewAddress] = useState('')

  const addAddress = () => {
    if (newAddress && !whitelist.includes(newAddress)) {
      setWhitelist([...whitelist, newAddress])
      setNewAddress('')
    }
  }

  const removeAddress = (address: string) => {
    setWhitelist(whitelist.filter(addr => addr !== address))
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
                placeholder="Enter daily limit"
              />
              <span className="text-sm text-muted-foreground">MNEE</span>
            </div>
            <Button className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Update Daily Limit
            </Button>
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
                <span className="text-sm text-green-500">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Whitelist</span>
                <span className="text-sm text-green-500">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Balance Check</span>
                <span className="text-sm text-green-500">✓ Active</span>
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
            />
            <Button onClick={addAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Address List */}
          <div className="space-y-2">
            {whitelist.map((address, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-mono text-sm">{address}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {index === 0 ? '2 days ago' : '1 week ago'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAddress(address)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {whitelist.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No authorized recipients</p>
              <p className="text-sm">Add addresses to enable payments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}