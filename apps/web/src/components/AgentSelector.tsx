'use client'

import { useState } from 'react'
import { getConfiguredAgents } from '@/lib/contracts'

interface AgentSelectorProps {
  selectedAgentId: string
  onAgentChange: (agentId: string) => void
}

export function AgentSelector({ selectedAgentId, onAgentChange }: AgentSelectorProps) {
  const agents = getConfiguredAgents()
  
  if (agents.length <= 1) {
    return null // Don't show selector for single agent
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="agent-select" className="text-sm font-medium text-gray-300">
        Active Agent:
      </label>
      <select
        id="agent-select"
        value={selectedAgentId}
        onChange={(e) => onAgentChange(e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name} ({agent.address.slice(0, 6)}...{agent.address.slice(-4)})
          </option>
        ))}
      </select>
    </div>
  )
}