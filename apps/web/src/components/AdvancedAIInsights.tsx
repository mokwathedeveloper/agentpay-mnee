'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Network, 
  Atom, 
  Zap, 
  TrendingUp, 
  Shield, 
  Eye,
  Activity,
  Cpu,
  Layers,
  GitBranch,
  Sparkles
} from "lucide-react"

interface AdvancedAIInsightsProps {
  selectedAgent: string
}

export default function AdvancedAIInsights({ selectedAgent }: AdvancedAIInsightsProps) {
  // Mock advanced AI data - in production this would come from the AI engines
  const aiSystemData = {
    neuralNetwork: {
      architecture: { input: 12, hidden1: 24, hidden2: 16, hidden3: 8, output: 3 },
      performance: {
        accuracy: 94.7,
        loss: 0.023,
        epochs: 156,
        learningRate: 0.001
      },
      activations: {
        layer1: [0.8, 0.6, 0.9, 0.4, 0.7],
        layer2: [0.5, 0.8, 0.3, 0.9],
        layer3: [0.7, 0.4, 0.6],
        output: [0.12, 0.87, 0.76]
      },
      trainingHistory: [
        { epoch: 150, loss: 0.045, accuracy: 92.1 },
        { epoch: 151, loss: 0.041, accuracy: 92.8 },
        { epoch: 152, loss: 0.038, accuracy: 93.2 },
        { epoch: 153, loss: 0.035, accuracy: 93.9 },
        { epoch: 154, loss: 0.029, accuracy: 94.3 },
        { epoch: 155, loss: 0.025, accuracy: 94.5 },
        { epoch: 156, loss: 0.023, accuracy: 94.7 }
      ]
    },
    swarmIntelligence: {
      agents: [
        { id: 'Conservative', accuracy: 96.2, specialization: ['fraud_detection', 'risk_assessment'] },
        { id: 'Balanced', accuracy: 94.8, specialization: ['pattern_recognition', 'optimization'] },
        { id: 'Aggressive', accuracy: 91.3, specialization: ['opportunity_detection', 'speed_optimization'] },
        { id: 'Analytical', accuracy: 97.1, specialization: ['data_analysis', 'trend_prediction'] },
        { id: 'Adaptive', accuracy: 93.6, specialization: ['learning_adaptation', 'context_awareness'] }
      ],
      consensus: {
        agreement: 87.3,
        diversity: 0.68,
        emergingPatterns: [
          { type: 'consensus_shift', significance: 0.73, description: 'Approval rate shifted from 89.2% to 94.1%' },
          { type: 'specialization_excellence', significance: 0.91, description: 'fraud_detection specialization showing 97.1% accuracy' }
        ]
      },
      globalKnowledge: {
        successPatterns: 1247,
        riskPatterns: 89,
        consensusHistory: 2156
      }
    },
    quantumRisk: {
      qubits: 8,
      superpositionStates: 256,
      coherence: 0.847,
      entanglement: 0.723,
      quantumAdvantage: {
        total: 0.634,
        uncertainty: 0.521,
        superposition: 0.789,
        entanglement: 0.592
      },
      measurements: {
        risk: 0.127,
        confidence: 0.891,
        uncertainty: 0.156
      },
      correlations: {
        'amount_frequency': 0.82,
        'recipient_purpose': 0.67,
        'time_historical': 0.54,
        'pattern_anomaly': 0.73
      }
    },
    hybridPerformance: {
      totalDecisions: 2847,
      neuralAccuracy: 94.7,
      swarmConsensus: 87.3,
      quantumAdvantage: 63.4,
      hybridPerformance: 96.2,
      processingTime: 23.7, // milliseconds
      memoryUsage: 47.3 // MB
    },
    recentDecisions: [
      {
        timestamp: '2024-01-15T14:30:22Z',
        neural: { confidence: 0.94, risk: 0.08, approve: true },
        swarm: { agreement: 0.89, approve: true },
        quantum: { risk: 0.12, advantage: 0.67, approve: true },
        final: { approve: true, confidence: 0.92 },
        purpose: 'API service payment'
      },
      {
        timestamp: '2024-01-15T14:28:15Z',
        neural: { confidence: 0.76, risk: 0.31, approve: true },
        swarm: { agreement: 0.72, approve: true },
        quantum: { risk: 0.28, advantage: 0.54, approve: true },
        final: { approve: true, confidence: 0.74 },
        purpose: 'Data processing fee'
      },
      {
        timestamp: '2024-01-15T14:25:08Z',
        neural: { confidence: 0.23, risk: 0.78, approve: false },
        swarm: { agreement: 0.91, approve: false },
        quantum: { risk: 0.82, advantage: 0.71, approve: false },
        final: { approve: false, confidence: 0.89 },
        purpose: 'Unknown transaction'
      }
    ]
  }

  return (
    <div className="space-y-6">
      {/* AI System Overview */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Advanced AI System v2.0 - Agent {selectedAgent}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{aiSystemData.hybridPerformance.hybridPerformance}%</div>
              <div className="text-sm text-gray-500">Hybrid Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{aiSystemData.hybridPerformance.processingTime}ms</div>
              <div className="text-sm text-gray-500">Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{aiSystemData.hybridPerformance.totalDecisions}</div>
              <div className="text-sm text-gray-500">Total Decisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{aiSystemData.hybridPerformance.memoryUsage}MB</div>
              <div className="text-sm text-gray-500">Memory Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="neural" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="neural" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Neural Network
          </TabsTrigger>
          <TabsTrigger value="swarm" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Swarm Intelligence
          </TabsTrigger>
          <TabsTrigger value="quantum" className="flex items-center gap-2">
            <Atom className="h-4 w-4" />
            Quantum Risk
          </TabsTrigger>
          <TabsTrigger value="hybrid" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Hybrid Fusion
          </TabsTrigger>
        </TabsList>

        {/* Neural Network Tab */}
        <TabsContent value="neural" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Network Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Input Layer</span>
                    <Badge variant="outline">{aiSystemData.neuralNetwork.architecture.input} neurons</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hidden Layer 1</span>
                    <Badge variant="outline">{aiSystemData.neuralNetwork.architecture.hidden1} neurons</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hidden Layer 2</span>
                    <Badge variant="outline">{aiSystemData.neuralNetwork.architecture.hidden2} neurons</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hidden Layer 3</span>
                    <Badge variant="outline">{aiSystemData.neuralNetwork.architecture.hidden3} neurons</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Output Layer</span>
                    <Badge variant="outline">{aiSystemData.neuralNetwork.architecture.output} neurons</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Training Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Accuracy</span>
                      <span>{aiSystemData.neuralNetwork.performance.accuracy}%</span>
                    </div>
                    <Progress value={aiSystemData.neuralNetwork.performance.accuracy} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Loss</span>
                      <span>{aiSystemData.neuralNetwork.performance.loss}</span>
                    </div>
                    <Progress value={(1 - aiSystemData.neuralNetwork.performance.loss) * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Epochs</span>
                      <div className="font-semibold">{aiSystemData.neuralNetwork.performance.epochs}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Learning Rate</span>
                      <div className="font-semibold">{aiSystemData.neuralNetwork.performance.learningRate}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Real-time Activations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Output Layer (Risk, Confidence, Optimization)</div>
                  <div className="grid grid-cols-3 gap-4">
                    {aiSystemData.neuralNetwork.activations.output.map((activation, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-bold">{(activation * 100).toFixed(1)}%</div>
                        <Progress value={activation * 100} className="h-2 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Neural network processes {aiSystemData.neuralNetwork.architecture.input} input features through {aiSystemData.neuralNetwork.architecture.hidden1 + aiSystemData.neuralNetwork.architecture.hidden2 + aiSystemData.neuralNetwork.architecture.hidden3} hidden neurons using GELU, Swish, and Leaky ReLU activations.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Swarm Intelligence Tab */}
        <TabsContent value="swarm" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Agent Swarm Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiSystemData.swarmIntelligence.agents.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{agent.id}</div>
                        <div className="text-xs text-gray-500">{agent.specialization.join(', ')}</div>
                      </div>
                      <Badge variant={agent.accuracy > 95 ? "default" : "secondary"}>
                        {agent.accuracy}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Consensus Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Swarm Agreement</span>
                      <span>{aiSystemData.swarmIntelligence.consensus.agreement}%</span>
                    </div>
                    <Progress value={aiSystemData.swarmIntelligence.consensus.agreement} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Decision Diversity</span>
                      <span>{(aiSystemData.swarmIntelligence.consensus.diversity * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={aiSystemData.swarmIntelligence.consensus.diversity * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold">{aiSystemData.swarmIntelligence.globalKnowledge.successPatterns}</div>
                      <div className="text-gray-500">Success Patterns</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{aiSystemData.swarmIntelligence.globalKnowledge.riskPatterns}</div>
                      <div className="text-gray-500">Risk Patterns</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{aiSystemData.swarmIntelligence.globalKnowledge.consensusHistory}</div>
                      <div className="text-gray-500">Decisions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Emerging Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiSystemData.swarmIntelligence.consensus.emergingPatterns.map((pattern, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{pattern.type.replace('_', ' ')}</Badge>
                      <span className="text-sm font-medium">{(pattern.significance * 100).toFixed(1)}% significance</span>
                    </div>
                    <p className="text-sm text-gray-700">{pattern.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quantum Risk Tab */}
        <TabsContent value="quantum" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-4 w-4" />
                  Quantum System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{aiSystemData.quantumRisk.qubits}</div>
                      <div className="text-xs text-gray-500">Qubits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{aiSystemData.quantumRisk.superpositionStates}</div>
                      <div className="text-xs text-gray-500">States</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Coherence</span>
                      <span>{(aiSystemData.quantumRisk.coherence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={aiSystemData.quantumRisk.coherence * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Entanglement</span>
                      <span>{(aiSystemData.quantumRisk.entanglement * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={aiSystemData.quantumRisk.entanglement * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quantum Advantage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Advantage</span>
                      <span>{(aiSystemData.quantumRisk.quantumAdvantage.total * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={aiSystemData.quantumRisk.quantumAdvantage.total * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold">{(aiSystemData.quantumRisk.quantumAdvantage.uncertainty * 100).toFixed(0)}%</div>
                      <div className="text-gray-500">Uncertainty</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{(aiSystemData.quantumRisk.quantumAdvantage.superposition * 100).toFixed(0)}%</div>
                      <div className="text-gray-500">Superposition</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{(aiSystemData.quantumRisk.quantumAdvantage.entanglement * 100).toFixed(0)}%</div>
                      <div className="text-gray-500">Entanglement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Quantum Correlations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(aiSystemData.quantumRisk.correlations).map(([pair, correlation]) => (
                  <div key={pair} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{pair.replace('_', ' ↔ ')}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={correlation * 100} className="h-2 w-20" />
                      <span className="text-sm font-medium w-12">{(correlation * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Quantum entanglement reveals hidden correlations between risk factors that classical analysis might miss.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hybrid Fusion Tab */}
        <TabsContent value="hybrid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                System Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{aiSystemData.hybridPerformance.neuralAccuracy}%</div>
                  <div className="text-sm text-gray-600">Neural Network</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Network className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{aiSystemData.hybridPerformance.swarmConsensus}%</div>
                  <div className="text-sm text-gray-600">Swarm Intelligence</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Atom className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{aiSystemData.hybridPerformance.quantumAdvantage}%</div>
                  <div className="text-sm text-gray-600">Quantum Risk</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent AI Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiSystemData.recentDecisions.map((decision, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium">{decision.purpose}</div>
                      <Badge variant={decision.final.approve ? "default" : "destructive"}>
                        {decision.final.approve ? "Approved" : "Rejected"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Neural</div>
                        <div className="font-medium">
                          {decision.neural.approve ? "✓" : "✗"} {(decision.neural.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Swarm</div>
                        <div className="font-medium">
                          {decision.swarm.approve ? "✓" : "✗"} {(decision.swarm.agreement * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Quantum</div>
                        <div className="font-medium">
                          {decision.quantum.approve ? "✓" : "✗"} {(decision.quantum.advantage * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Final confidence: {(decision.final.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}