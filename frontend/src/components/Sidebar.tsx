'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Settings, 
  Send, 
  History,
  Wallet
} from 'lucide-react'

const navigation = [
  { name: 'Overview', icon: LayoutDashboard, href: '/', current: true },
  { name: 'Payment Policy', icon: Settings, href: '/policy', current: false },
  { name: 'Execute Payment', icon: Send, href: '/payment', current: false },
  { name: 'Transaction History', icon: History, href: '/history', current: false },
]

export function Sidebar() {
  const [current, setCurrent] = useState('Overview')

  return (
    <div className="flex flex-col w-64 bg-card border-r">
      <div className="flex items-center gap-2 p-6 border-b">
        <Wallet className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-lg font-semibold">AgentPay</h1>
          <p className="text-sm text-muted-foreground">MNEE Vault</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={current === item.name ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3',
              current === item.name && 'bg-primary text-primary-foreground'
            )}
            onClick={() => setCurrent(item.name)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </nav>
    </div>
  )
}