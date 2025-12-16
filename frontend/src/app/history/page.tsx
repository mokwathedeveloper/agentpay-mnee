import { Sidebar } from '@/components/Sidebar'
import { TransactionHistory } from '@/components/TransactionHistory'

export default function HistoryPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <TransactionHistory />
      </main>
    </div>
  )
}