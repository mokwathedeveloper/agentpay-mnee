'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Overview } from '@/components/Overview'
import { AgentSelector } from '@/components/AgentSelector'
import AIInsights from '@/components/AIInsights'
import { getAgentAddress } from '@/lib/contracts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [selectedAgentId, setSelectedAgentId] = useState('1')
  const currentAgentAddress = getAgentAddress(selectedAgentId)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">🧠 AI-Powered AgentPay Dashboard</h1>
            <AgentSelector 
              selectedAgentId={selectedAgentId}
              onAgentChange={setSelectedAgentId}
            />
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Vault Overview</TabsTrigger>
              <TabsTrigger value="ai">🧠 AI Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Overview agentAddress={currentAgentAddress} />
            </TabsContent>
            
            <TabsContent value="ai">
              <AIInsights selectedAgent={selectedAgentId} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}