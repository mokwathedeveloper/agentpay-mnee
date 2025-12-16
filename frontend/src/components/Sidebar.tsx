'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
  { name: 'Overview', icon: LayoutDashboard, href: '/' },
  { name: 'Payment Policy', icon: Settings, href: '/policy' },
  { name: 'Execute Payment', icon: Send, href: '/payment' },
  { name: 'Transaction History', icon: History, href: '/history' },
]

export function Sidebar() {
  const pathname = usePathname()

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
          <Link key={item.name} href={item.href}>
            <Button
              variant={pathname === item.href ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                pathname === item.href && 'bg-primary text-primary-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}