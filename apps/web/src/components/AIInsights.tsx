'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Shield, Zap } from "lucide-react"

interface AIInsightsProps {
  selectedAgent: string
}

export default function AIInsights({ selectedAgent }: AIInsightsProps) {
  // Mock AI data - in production this would come from the AI engine
  const aiStats = {
    confidence: 87.3,
    riskScore: 12.5,
    totalDecisions: 156,
    approvalRate: 94.2,
    learningProgress: 78,
    topRiskFactors: [
      { factor: "Amount Anomaly", score: 15 },
      { factor: "Time Pattern", score: 8 },
      { factor: "New Recipient", score: 5 }
    ],
    recentDecisions: [
      { purpose: "API Service Payment", confidence: 92, approved: true },
      { purpose: "Data Processing", confidence: 88, approved: true },
      { purpose: "Infrastructure Fee", confidence: 76, approved: true },
      { purpose: "Unknown Service", confidence: 23, approved: false }
    ]
  }

  return (
    <div className="space-y-6">
      {/* AI Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            AI Decision Engine - Agent {selectedAgent}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{aiStats.confidence}%</div>
              <div className="text-sm text-gray-400">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{aiStats.riskScore}%</div>
              <div className="text-sm text-gray-400">Risk Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{aiStats.totalDecisions}</div>
              <div className="text-sm text-gray-400">Total Decisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{aiStats.approvalRate}%</div>
              <div className="text-sm text-gray-400">Approval Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Model Training</span>
                  <span>{aiStats.learningProgress}%</span>
                </div>
                <Progress value={aiStats.learningProgress} className="h-2" />
              </div>
              <div className="text-sm text-gray-400">
                AI model has processed {aiStats.totalDecisions} transactions and continues learning from each decision.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiStats.topRiskFactors.map((factor, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{factor.factor}</span>
                  <Badge variant={factor.score > 10 ? "destructive" : "secondary"}>
                    {factor.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Recent AI Decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiStats.recentDecisions.map((decision, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium">{decision.purpose}</div>
                  <div className="text-sm text-gray-400">Confidence: {decision.confidence}%</div>
                </div>
                <Badge variant={decision.approved ? "default" : "destructive"}>
                  {decision.approved ? "Approved" : "Rejected"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle>AI Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Machine Learning Features</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Weighted feature analysis</li>
                <li>• Pattern recognition</li>
                <li>• Anomaly detection</li>
                <li>• Adaptive learning</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Decision Factors</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Amount optimization</li>
                <li>• Recipient trust scoring</li>
                <li>• Purpose NLP analysis</li>
                <li>• Time pattern recognition</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}