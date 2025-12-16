'use client'

import { Sidebar } from '@/components/Sidebar'
import { Overview } from '@/components/Overview'

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Overview />
      </main>
    </div>
  )
}