/**
 * Advanced AI Decision Engine for AgentPay v2.0
 * Integrates Neural Networks, Swarm Intelligence, and Quantum Risk Assessment
 * @author AgentPay Team
 * @version 2.0.0
 */

const NeuralNetworkEngine = require('./neuralNetworkEngine');
const SwarmIntelligence = require('./swarmIntelligence');
const QuantumRiskEngine = require('./quantumRiskEngine');

class AIDecisionEngine {
  constructor() {
    // Legacy components (maintained for compatibility)
    this.transactionHistory = [];
    this.riskThreshold = 0.7;
    this.learningRate = 0.1;
    this.weights = {
      amount: 0.3,
      frequency: 0.25,
      recipient: 0.2,
      timePattern: 0.15,
      purpose: 0.1
    };
    
    // Advanced AI Components
    this.neuralNetwork = new NeuralNetworkEngine();
    this.swarmIntelligence = new SwarmIntelligence();
    this.quantumRiskEngine = new QuantumRiskEngine();
    
    // AI System Configuration
    this.aiMode = 'hybrid'; // 'neural', 'swarm', 'quantum', 'hybrid'
    this.confidenceThreshold = 0.75;
    this.quantumAdvantageThreshold = 0.3;
    
    // Performance Metrics
    this.performanceMetrics = {
      totalDecisions: 0,
      neuralAccuracy: 0,
      swarmConsensus: 0,
      quantumAdvantage: 0,
      hybridPerformance: 0
    };
    
    // Real-time Learning
    this.adaptiveLearning = true;
    this.learningBuffer = [];
    
    console.log('🧠 Advanced AI Decision Engine v2.0 Initialized');
    console.log('   🔬 Neural Network: Multi-layer perceptron with 24-16-8 architecture');
    console.log('   🐝 Swarm Intelligence: 5-agent collaborative decision system');
    console.log('   ⚛️  Quantum Risk Engine: 8-qubit quantum-inspired risk assessment');
  }

  /**
   * Advanced AI-powered payment decision using multi-system integration
   * Combines Neural Networks, Swarm Intelligence, and Quantum Risk Assessment
   */
  async makePaymentDecision(paymentRequest) {
    const startTime = performance.now();
    console.log('\n🧠 Advanced AI Analysis Starting...');
    
    try {
      // Phase 1: Neural Network Analysis
      console.log('🔬 Phase 1: Neural Network Deep Learning Analysis');
      const neuralResult = await this.runNeuralAnalysis(paymentRequest);
      
      // Phase 2: Swarm Intelligence Consensus
      console.log('🐝 Phase 2: Multi-Agent Swarm Intelligence Consensus');
      const swarmResult = await this.runSwarmAnalysis(paymentRequest, neuralResult);
      
      // Phase 3: Quantum Risk Assessment
      console.log('⚛️  Phase 3: Quantum-Inspired Risk Assessment');
      const quantumResult = await this.runQuantumAnalysis(paymentRequest);
      
      // Phase 4: Hybrid Decision Fusion
      console.log('🔮 Phase 4: Advanced Decision Fusion');
      const hybridDecision = await this.fuseAIDecisions(neuralResult, swarmResult, quantumResult, paymentRequest);
      
      // Phase 5: Adaptive Learning Update
      if (this.adaptiveLearning) {
        this.updateAdaptiveLearning(paymentRequest, hybridDecision);
      }
      
      const processingTime = performance.now() - startTime;
      console.log(`⚡ AI Analysis Complete: ${processingTime.toFixed(2)}ms`);
      
      return hybridDecision;
      
    } catch (error) {
      console.error('❌ AI Analysis Error:', error.message);
      // Fallback to legacy decision
      return this.legacyPaymentDecision(paymentRequest);
    }
  }
  
  /**
   * Run neural network analysis
   */
  async runNeuralAnalysis(paymentRequest) {
    const features = this.neuralNetwork.extractNeuralFeatures(paymentRequest, this.transactionHistory);
    const neuralOutput = this.neuralNetwork.forward(features);
    
    console.log(`   🎯 Neural Confidence: ${(neuralOutput.confidence * 100).toFixed(1)}%`);
    console.log(`   ⚠️  Neural Risk: ${(neuralOutput.risk * 100).toFixed(1)}%`);
    console.log(`   💰 Amount Optimization: ${(neuralOutput.optimization * 100).toFixed(1)}%`);
    
    return {
      type: 'neural',
      confidence: neuralOutput.confidence,
      risk: neuralOutput.risk,
      optimization: neuralOutput.optimization,
      approve: neuralOutput.risk < 0.5 && neuralOutput.confidence > 0.6,
      reasoning: `Neural network analysis with ${(neuralOutput.confidence * 100).toFixed(1)}% confidence`,
      features,
      networkStats: this.neuralNetwork.getVisualizationData()
    };
  }
  
  /**
   * Run swarm intelligence analysis
   */
  async runSwarmAnalysis(paymentRequest, neuralResult) {
    const swarmDecision = await this.swarmIntelligence.makeSwarmDecision(paymentRequest, neuralResult);
    
    console.log(`   🤝 Swarm Agreement: ${(swarmDecision.swarmAgreement * 100).toFixed(1)}%`);
    console.log(`   👥 Agent Consensus: ${swarmDecision.individualDecisions.filter(d => d.approve).length}/${swarmDecision.individualDecisions.length}`);
    console.log(`   🔍 Emerging Patterns: ${swarmDecision.emergingPatterns.length}`);
    
    return {
      type: 'swarm',
      decision: swarmDecision.decision,
      confidence: swarmDecision.confidence,
      swarmAgreement: swarmDecision.swarmAgreement,
      approve: swarmDecision.decision,
      reasoning: `Swarm consensus with ${(swarmDecision.swarmAgreement * 100).toFixed(1)}% agreement`,
      individualDecisions: swarmDecision.individualDecisions,
      emergingPatterns: swarmDecision.emergingPatterns,
      swarmInsights: swarmDecision.swarmInsights
    };
  }
  
  /**
   * Run quantum risk analysis
   */
  async runQuantumAnalysis(paymentRequest) {
    const quantumResult = await this.quantumRiskEngine.assessQuantumRisk(paymentRequest, this.transactionHistory);
    
    console.log(`   ⚛️  Quantum Risk: ${(quantumResult.quantumRisk * 100).toFixed(1)}%`);
    console.log(`   🌊 Superposition Coherence: ${(quantumResult.superpositionCoherence * 100).toFixed(1)}%`);
    console.log(`   🔗 Entanglement Strength: ${(quantumResult.entanglementStrength * 100).toFixed(1)}%`);
    console.log(`   🚀 Quantum Advantage: ${(quantumResult.quantumAdvantage.total * 100).toFixed(1)}%`);
    
    return {
      type: 'quantum',
      risk: quantumResult.quantumRisk,
      confidence: quantumResult.confidence,
      uncertainty: quantumResult.quantumUncertainty,
      approve: quantumResult.quantumRisk < 0.5 && quantumResult.confidence > 0.7,
      reasoning: `Quantum analysis with ${(quantumResult.quantumAdvantage.total * 100).toFixed(1)}% quantum advantage`,
      entanglementStrength: quantumResult.entanglementStrength,
      superpositionCoherence: quantumResult.superpositionCoherence,
      quantumAdvantage: quantumResult.quantumAdvantage,
      quantumInsights: quantumResult.quantumInsights
    };
  }
  
  /**
   * Fuse decisions from all AI systems
   */
  async fuseAIDecisions(neuralResult, swarmResult, quantumResult, paymentRequest) {
    // Weighted fusion based on system confidence and performance
    const weights = this.calculateDynamicWeights(neuralResult, swarmResult, quantumResult);
    
    console.log(`   ⚖️  Neural Weight: ${(weights.neural * 100).toFixed(1)}%`);
    console.log(`   ⚖️  Swarm Weight: ${(weights.swarm * 100).toFixed(1)}%`);
    console.log(`   ⚖️  Quantum Weight: ${(weights.quantum * 100).toFixed(1)}%`);
    
    // Fused confidence score
    const fusedConfidence = 
      weights.neural * neuralResult.confidence +
      weights.swarm * swarmResult.confidence +
      weights.quantum * quantumResult.confidence;
    
    // Fused risk score
    const fusedRisk = 
      weights.neural * neuralResult.risk +
      weights.swarm * (1 - swarmResult.confidence) + // Swarm uses agreement as inverse risk
      weights.quantum * quantumResult.risk;
    
    // Consensus decision
    const approvals = [neuralResult.approve, swarmResult.approve, quantumResult.approve];
    const approvalCount = approvals.filter(a => a).length;
    const consensusApproval = approvalCount >= 2; // Majority vote
    
    // Final decision with confidence threshold
    const finalApproval = consensusApproval && fusedConfidence > this.confidenceThreshold;
    
    // Generate comprehensive reasoning
    const reasoning = this.generateHybridReasoning(neuralResult, swarmResult, quantumResult, weights, finalApproval);
    
    // Calculate suggested amount optimization
    const suggestedAmount = this.calculateOptimizedAmount(paymentRequest.amount, neuralResult, swarmResult, quantumResult);
    
    // Update performance metrics
    this.updatePerformanceMetrics(neuralResult, swarmResult, quantumResult, finalApproval);
    
    console.log(`   🎯 Final Decision: ${finalApproval ? '✅ APPROVE' : '❌ REJECT'}`);
    console.log(`   📊 Fused Confidence: ${(fusedConfidence * 100).toFixed(1)}%`);
    console.log(`   ⚠️  Fused Risk: ${(fusedRisk * 100).toFixed(1)}%`);
    
    return {
      approve: finalApproval,
      confidence: fusedConfidence,
      risk: fusedRisk,
      reasoning,
      suggestedAmount,
      
      // Individual system results
      neuralAnalysis: neuralResult,
      swarmAnalysis: swarmResult,
      quantumAnalysis: quantumResult,
      
      // Fusion metadata
      fusionWeights: weights,
      consensusVote: { approvals: approvalCount, total: 3 },
      
      // Advanced insights
      aiInsights: this.generateAIInsights(neuralResult, swarmResult, quantumResult),
      performanceMetrics: { ...this.performanceMetrics },
      
      // Visualization data
      visualizationData: {
        neuralNetwork: neuralResult.networkStats,
        swarmStats: this.swarmIntelligence.getSwarmStats(),
        quantumStats: this.quantumRiskEngine.getQuantumStats()
      }
    };
  }
  
  /**
   * Legacy payment decision (fallback)
   */
  legacyPaymentDecision(paymentRequest) {
    console.log('⚠️  Using legacy AI decision (fallback mode)');
    
    const { recipient, amount, purpose } = paymentRequest;
    
    // Extract features for AI analysis
    const features = this.extractFeatures(paymentRequest);
    
    // Calculate AI confidence score
    const confidenceScore = this.calculateConfidence(features);
    
    // Risk assessment using pattern recognition
    const riskScore = this.assessRisk(features);
    
    // AI decision logic
    const decision = {
      approve: confidenceScore > this.riskThreshold && riskScore < 0.5,
      confidence: confidenceScore,
      risk: riskScore,
      reasoning: `Legacy AI: ${this.generateReasoning(features, confidenceScore, riskScore)}`,
      suggestedAmount: this.optimizeAmount(amount, features),
      
      // Indicate this is legacy mode
      mode: 'legacy',
      neuralAnalysis: null,
      swarmAnalysis: null,
      quantumAnalysis: null
    };

    // Learn from decision (update weights)
    this.updateWeights(features, decision);
    
    return decision;
  }

  /**
   * Extract AI features from payment request
   */
  extractFeatures(request) {
    const { recipient, amount, purpose } = request;
    const now = new Date();
    
    return {
      amountNormalized: Math.min(parseFloat(amount) / 100, 1), // Normalize to 0-1
      recipientTrust: this.calculateRecipientTrust(recipient),
      purposeScore: this.analyzePurpose(purpose),
      timeScore: this.analyzeTimePattern(now),
      frequencyScore: this.analyzeFrequency(recipient),
      historicalSuccess: this.getHistoricalSuccess(recipient)
    };
  }

  /**
   * AI confidence calculation using weighted features
   */
  calculateConfidence(features) {
    return (
      features.amountNormalized * this.weights.amount +
      features.recipientTrust * this.weights.recipient +
      features.purposeScore * this.weights.purpose +
      features.timeScore * this.weights.timePattern +
      features.frequencyScore * this.weights.frequency
    );
  }

  /**
   * Risk assessment using anomaly detection
   */
  assessRisk(features) {
    // Detect anomalies in payment patterns
    const amountAnomaly = this.detectAmountAnomaly(features.amountNormalized);
    const frequencyAnomaly = this.detectFrequencyAnomaly(features.frequencyScore);
    const timeAnomaly = this.detectTimeAnomaly(features.timeScore);
    
    return (amountAnomaly + frequencyAnomaly + timeAnomaly) / 3;
  }

  /**
   * Calculate recipient trust score using historical data
   */
  calculateRecipientTrust(recipient) {
    const history = this.transactionHistory.filter(tx => tx.recipient === recipient);
    if (history.length === 0) return 0.5; // Neutral for new recipients
    
    const successRate = history.filter(tx => tx.success).length / history.length;
    const avgAmount = history.reduce((sum, tx) => sum + tx.amount, 0) / history.length;
    
    // Trust increases with successful transactions and reasonable amounts
    return Math.min(successRate * (1 - Math.min(avgAmount / 1000, 0.5)), 1);
  }

  /**
   * NLP-based purpose analysis
   */
  analyzePurpose(purpose) {
    const validPurposes = ['api', 'service', 'subscription', 'data', 'infrastructure'];
    const emergencyKeywords = ['urgent', 'emergency', 'critical', 'immediate'];
    const suspiciousKeywords = ['test', 'random', 'unknown', 'misc'];
    
    let score = 0.5; // Base score
    
    // Boost for valid purposes
    if (validPurposes.some(p => purpose.toLowerCase().includes(p))) {
      score += 0.3;
    }
    
    // Penalty for suspicious purposes
    if (suspiciousKeywords.some(p => purpose.toLowerCase().includes(p))) {
      score -= 0.4;
    }
    
    // Emergency handling
    if (emergencyKeywords.some(p => purpose.toLowerCase().includes(p))) {
      score += 0.2;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Time pattern analysis for optimal payment timing
   */
  analyzeTimePattern(timestamp) {
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    
    // Business hours get higher score
    const businessHours = hour >= 9 && hour <= 17;
    const weekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    
    let score = 0.5;
    if (businessHours) score += 0.3;
    if (weekday) score += 0.2;
    
    return score;
  }

  /**
   * Frequency analysis to detect spam or unusual patterns
   */
  analyzeFrequency(recipient) {
    const recentTxs = this.transactionHistory.filter(tx => 
      tx.recipient === recipient && 
      Date.now() - tx.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    // Penalize too frequent transactions
    if (recentTxs.length > 10) return 0.1;
    if (recentTxs.length > 5) return 0.3;
    if (recentTxs.length > 2) return 0.7;
    
    return 0.9;
  }

  /**
   * Anomaly detection for amounts
   */
  detectAmountAnomaly(normalizedAmount) {
    const recentAmounts = this.transactionHistory
      .slice(-20)
      .map(tx => tx.amount);
    
    if (recentAmounts.length < 3) return 0;
    
    const mean = recentAmounts.reduce((a, b) => a + b, 0) / recentAmounts.length;
    const variance = recentAmounts.reduce((sum, amount) => 
      sum + Math.pow(amount - mean, 2), 0) / recentAmounts.length;
    const stdDev = Math.sqrt(variance);
    
    const currentAmount = normalizedAmount * 100;
    const zScore = Math.abs((currentAmount - mean) / (stdDev || 1));
    
    return Math.min(zScore / 3, 1); // Normalize z-score to 0-1
  }

  /**
   * Detect frequency anomalies
   */
  detectFrequencyAnomaly(frequencyScore) {
    return 1 - frequencyScore; // Inverse of frequency score
  }

  /**
   * Detect time anomalies
   */
  detectTimeAnomaly(timeScore) {
    return 1 - timeScore; // Inverse of time score
  }

  /**
   * Get historical success rate for recipient
   */
  getHistoricalSuccess(recipient) {
    const history = this.transactionHistory.filter(tx => tx.recipient === recipient);
    if (history.length === 0) return 0.5;
    
    return history.filter(tx => tx.success).length / history.length;
  }

  /**
   * AI-optimized amount suggestion
   */
  optimizeAmount(requestedAmount, features) {
    const baseAmount = parseFloat(requestedAmount);
    
    // Adjust based on recipient trust
    let optimizedAmount = baseAmount * (0.5 + features.recipientTrust * 0.5);
    
    // Adjust based on purpose confidence
    optimizedAmount *= (0.7 + features.purposeScore * 0.3);
    
    // Round to reasonable precision
    return Math.round(optimizedAmount * 100) / 100;
  }

  /**
   * Generate human-readable AI reasoning
   */
  generateReasoning(features, confidence, risk) {
    const reasons = [];
    
    if (confidence > 0.8) {
      reasons.push("High confidence based on positive patterns");
    } else if (confidence < 0.3) {
      reasons.push("Low confidence due to suspicious indicators");
    }
    
    if (features.recipientTrust > 0.7) {
      reasons.push("Trusted recipient with good history");
    } else if (features.recipientTrust < 0.3) {
      reasons.push("New or untrusted recipient");
    }
    
    if (features.purposeScore > 0.7) {
      reasons.push("Valid business purpose detected");
    } else if (features.purposeScore < 0.3) {
      reasons.push("Suspicious or unclear purpose");
    }
    
    if (risk > 0.7) {
      reasons.push("High risk due to anomalous patterns");
    }
    
    return reasons.join("; ") || "Standard payment pattern";
  }

  /**
   * Machine learning: Update weights based on outcomes
   */
  updateWeights(features, decision) {
    // Simplified gradient descent for weight updates
    // In production, this would use actual outcome feedback
    
    const error = decision.approve ? 0 : 1; // Simplified error calculation
    
    // Update weights based on feature importance
    Object.keys(this.weights).forEach(key => {
      const featureValue = features[key + 'Score'] || features[key] || 0;
      this.weights[key] += this.learningRate * error * featureValue;
      
      // Keep weights normalized
      this.weights[key] = Math.max(0, Math.min(1, this.weights[key]));
    });
    
    // Normalize weights to sum to 1
    const weightSum = Object.values(this.weights).reduce((a, b) => a + b, 0);
    Object.keys(this.weights).forEach(key => {
      this.weights[key] /= weightSum;
    });
  }

  /**
   * Record transaction for learning
   */
  recordTransaction(transaction) {
    this.transactionHistory.push({
      ...transaction,
      timestamp: Date.now()
    });
    
    // Keep only recent history for performance
    if (this.transactionHistory.length > 1000) {
      this.transactionHistory = this.transactionHistory.slice(-500);
    }
  }

  /**
   * Calculate dynamic weights for AI system fusion
   */
  calculateDynamicWeights(neuralResult, swarmResult, quantumResult) {
    // Base weights
    let neuralWeight = 0.4;
    let swarmWeight = 0.35;
    let quantumWeight = 0.25;
    
    // Adjust based on confidence levels
    if (neuralResult.confidence > 0.9) neuralWeight += 0.1;
    if (swarmResult.swarmAgreement > 0.9) swarmWeight += 0.1;
    if (quantumResult.quantumAdvantage.total > this.quantumAdvantageThreshold) quantumWeight += 0.15;
    
    // Adjust based on historical performance
    neuralWeight *= (1 + this.performanceMetrics.neuralAccuracy - 0.5);
    swarmWeight *= (1 + this.performanceMetrics.swarmConsensus - 0.5);
    quantumWeight *= (1 + this.performanceMetrics.quantumAdvantage - 0.5);
    
    // Normalize weights
    const totalWeight = neuralWeight + swarmWeight + quantumWeight;
    
    return {
      neural: neuralWeight / totalWeight,
      swarm: swarmWeight / totalWeight,
      quantum: quantumWeight / totalWeight
    };
  }
  
  /**
   * Generate hybrid reasoning from all AI systems
   */
  generateHybridReasoning(neuralResult, swarmResult, quantumResult, weights, finalApproval) {
    const reasons = [];
    
    // Neural network reasoning
    if (weights.neural > 0.3) {
      reasons.push(`Neural: ${neuralResult.reasoning}`);
    }
    
    // Swarm intelligence reasoning
    if (weights.swarm > 0.3) {
      reasons.push(`Swarm: ${swarmResult.reasoning}`);
      if (swarmResult.emergingPatterns.length > 0) {
        reasons.push(`Patterns: ${swarmResult.emergingPatterns[0].description}`);
      }
    }
    
    // Quantum reasoning
    if (weights.quantum > 0.3) {
      reasons.push(`Quantum: ${quantumResult.reasoning}`);
      if (quantumResult.quantumInsights.length > 0) {
        reasons.push(`Quantum Insight: ${quantumResult.quantumInsights[0]}`);
      }
    }
    
    // Final decision reasoning
    const decisionReason = finalApproval 
      ? 'Multi-AI consensus approves transaction'
      : 'Multi-AI analysis indicates high risk';
    
    reasons.push(decisionReason);
    
    return reasons.join('; ');
  }
  
  /**
   * Calculate optimized amount using all AI systems
   */
  calculateOptimizedAmount(originalAmount, neuralResult, swarmResult, quantumResult) {
    const baseAmount = parseFloat(originalAmount);
    
    // Neural network optimization
    const neuralOptimization = neuralResult.optimization || 1.0;
    
    // Swarm optimization (based on consensus)
    const swarmOptimization = swarmResult.swarmAgreement;
    
    // Quantum optimization (based on superposition coherence)
    const quantumOptimization = quantumResult.superpositionCoherence || 1.0;
    
    // Weighted optimization
    const weights = this.calculateDynamicWeights(neuralResult, swarmResult, quantumResult);
    const optimizationFactor = 
      weights.neural * neuralOptimization +
      weights.swarm * swarmOptimization +
      weights.quantum * quantumOptimization;
    
    const optimizedAmount = baseAmount * optimizationFactor;
    
    // Ensure reasonable bounds
    return Math.max(baseAmount * 0.5, Math.min(baseAmount * 1.5, optimizedAmount));
  }
  
  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(neuralResult, swarmResult, quantumResult, finalDecision) {
    this.performanceMetrics.totalDecisions++;
    
    // Update neural accuracy (simplified)
    this.performanceMetrics.neuralAccuracy = 
      (this.performanceMetrics.neuralAccuracy * 0.9) + (neuralResult.confidence * 0.1);
    
    // Update swarm consensus
    this.performanceMetrics.swarmConsensus = 
      (this.performanceMetrics.swarmConsensus * 0.9) + (swarmResult.swarmAgreement * 0.1);
    
    // Update quantum advantage
    this.performanceMetrics.quantumAdvantage = 
      (this.performanceMetrics.quantumAdvantage * 0.9) + (quantumResult.quantumAdvantage.total * 0.1);
    
    // Update hybrid performance
    const systemAgreement = [neuralResult.approve, swarmResult.approve, quantumResult.approve]
      .filter(a => a === finalDecision).length / 3;
    
    this.performanceMetrics.hybridPerformance = 
      (this.performanceMetrics.hybridPerformance * 0.9) + (systemAgreement * 0.1);
  }
  
  /**
   * Generate AI insights
   */
  generateAIInsights(neuralResult, swarmResult, quantumResult) {
    const insights = [];
    
    // Neural insights
    if (neuralResult.confidence > 0.95) {
      insights.push('Neural network shows extremely high confidence');
    }
    
    // Swarm insights
    if (swarmResult.swarmAgreement > 0.9) {
      insights.push('Strong multi-agent consensus achieved');
    }
    
    if (swarmResult.emergingPatterns.length > 0) {
      insights.push(`Detected ${swarmResult.emergingPatterns.length} emerging patterns`);
    }
    
    // Quantum insights
    if (quantumResult.quantumAdvantage.total > 0.5) {
      insights.push('Significant quantum computational advantage detected');
    }
    
    if (quantumResult.entanglementStrength > 0.8) {
      insights.push('Strong quantum correlations between risk factors');
    }
    
    // System disagreement insights
    const decisions = [neuralResult.approve, swarmResult.approve, quantumResult.approve];
    const uniqueDecisions = [...new Set(decisions)].length;
    
    if (uniqueDecisions === 3) {
      insights.push('All AI systems disagree - complex decision scenario');
    } else if (uniqueDecisions === 2) {
      insights.push('Mixed AI consensus - moderate complexity');
    }
    
    return insights;
  }
  
  /**
   * Update adaptive learning
   */
  updateAdaptiveLearning(paymentRequest, decision) {
    this.learningBuffer.push({
      request: paymentRequest,
      decision,
      timestamp: Date.now()
    });
    
    // Train neural network periodically
    if (this.learningBuffer.length >= 10) {
      const trainingData = this.learningBuffer.map(item => ({
        input: this.neuralNetwork.extractNeuralFeatures(item.request, this.transactionHistory),
        target: [item.decision.risk, item.decision.confidence, 1.0] // Simplified target
      }));
      
      this.neuralNetwork.train(trainingData, 5); // Quick training
      this.learningBuffer = []; // Clear buffer
    }
  }
  
  /**
   * Get comprehensive AI model statistics
   */
  getModelStats() {
    return {
      // Legacy stats
      totalTransactions: this.transactionHistory.length,
      weights: { ...this.weights },
      riskThreshold: this.riskThreshold,
      learningRate: this.learningRate,
      
      // Advanced AI stats
      aiMode: this.aiMode,
      performanceMetrics: { ...this.performanceMetrics },
      
      // Individual system stats
      neuralNetwork: this.neuralNetwork.getVisualizationData(),
      swarmIntelligence: this.swarmIntelligence.getSwarmStats(),
      quantumRiskEngine: this.quantumRiskEngine.getQuantumStats(),
      
      // System health
      adaptiveLearning: this.adaptiveLearning,
      learningBufferSize: this.learningBuffer.length,
      
      // Capabilities
      capabilities: [
        'Multi-layer Neural Networks',
        'Swarm Intelligence Consensus',
        'Quantum Risk Assessment',
        'Real-time Adaptive Learning',
        'Dynamic Weight Optimization',
        'Pattern Recognition',
        'Anomaly Detection',
        'Predictive Analytics'
      ]
    };
  }
}

module.exports = AIDecisionEngine;