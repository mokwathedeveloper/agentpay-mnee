'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Overview } from '@/components/Overview'
import { AgentSelector } from '@/components/AgentSelector'
import { getAgentAddress } from '@/lib/contracts'

export default function Home() {
  const [selectedAgentId, setSelectedAgentId] = useState('1')
  const currentAgentAddress = getAgentAddress(selectedAgentId)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">AgentPay Dashboard</h1>
            <AgentSelector 
              selectedAgentId={selectedAgentId}
              onAgentChange={setSelectedAgentId}
            />
          </div>
          <Overview agentAddress={currentAgentAddress} />
        </div>
      </main>
    </div>
  )
}