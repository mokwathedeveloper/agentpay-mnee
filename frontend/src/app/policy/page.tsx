import { Sidebar } from '@/components/Sidebar'
import { PaymentPolicy } from '@/components/PaymentPolicy'

export default function PolicyPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <PaymentPolicy />
      </main>
    </div>
  )
}