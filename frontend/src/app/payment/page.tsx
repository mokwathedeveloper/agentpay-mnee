import { Sidebar } from '@/components/Sidebar'
import { ExecutePayment } from '@/components/ExecutePayment'

export default function PaymentPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ExecutePayment />
      </main>
    </div>
  )
}