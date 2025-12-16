'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Play, Eye, Code } from "lucide-react"

export default function JudgeGuide() {
  return (
    <Card className="border-blue-500/20 bg-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-400" />
          Judge Demo Guide
          <Badge variant="secondary">MNEE Hackathon</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Play className="h-5 w-5 text-green-400 mt-1" />
            <div>
              <h4 className="font-medium">1. Run AI Agent</h4>
              <p className="text-sm text-gray-400">
                <code>cd apps/agent && node paymentAgent.js 1</code>
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-400 mt-1" />
            <div>
              <h4 className="font-medium">2. Watch AI Decisions</h4>
              <p className="text-sm text-gray-400">
                Check AI Insights tab for ML analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 text-purple-400 mt-1" />
            <div>
              <h4 className="font-medium">3. Verify Contract</h4>
              <p className="text-sm text-gray-400">
                Source code in /contracts/AgentPayVault.sol
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-sm">
            <strong>Demo Network:</strong> Local Hardhat | 
            <strong> Contract:</strong> 0x5FbDB...180aa3 | 
            <strong> MNEE Token:</strong> 0x8cce...D6cF
          </p>
        </div>
      </CardContent>
    </Card>
  )
}