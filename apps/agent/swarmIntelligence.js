/**
 * @fileoverview Multi-Agent Swarm Intelligence for Collaborative Decision Making
 * Implements collective intelligence algorithms for enhanced payment decisions
 * @author AgentPay Team
 * @version 2.0.0
 */

'use strict';

class SwarmIntelligence {
  constructor() {
    this.agents = new Map();
    this.globalKnowledge = {
      riskPatterns: new Map(),
      successPatterns: new Map(),
      emergingThreats: [],
      consensusHistory: []
    };
    
    // Swarm parameters
    this.swarmSize = 5;
    this.consensusThreshold = 0.7;
    this.diversityWeight = 0.3;
    this.explorationRate = 0.1;
    
    // Particle Swarm Optimization parameters
    this.inertiaWeight = 0.9;
    this.cognitiveWeight = 2.0;
    this.socialWeight = 2.0;
    
    // Initialize swarm agents
    this.initializeSwarm();
  }

  /**
   * Initialize swarm with diverse agent personalities
   */
  initializeSwarm() {
    const personalities = [
      { name: 'Conservative', riskTolerance: 0.2, explorationRate: 0.05 },
      { name: 'Balanced', riskTolerance: 0.5, explorationRate: 0.1 },
      { name: 'Aggressive', riskTolerance: 0.8, explorationRate: 0.2 },
      { name: 'Analytical', riskTolerance: 0.4, explorationRate: 0.15 },
      { name: 'Adaptive', riskTolerance: 0.6, explorationRate: 0.25 }
    ];

    personalities.forEach((personality, index) => {
      this.agents.set(`agent_${index}`, {
        id: `agent_${index}`,
        personality,
        position: this.randomPosition(),
        velocity: this.randomVelocity(),
        bestPosition: null,
        bestFitness: -Infinity,
        experience: [],
        specialization: this.getSpecialization(personality.name)
      });
    });
  }

  /**
   * Generate random position in decision space
   */
  randomPosition() {
    return {
      riskThreshold: Math.random(),
      confidenceWeight: Math.random(),
      amountSensitivity: Math.random(),
      timePreference: Math.random(),
      recipientTrust: Math.random()
    };
  }

  /**
   * Generate random velocity
   */
  randomVelocity() {
    return {
      riskThreshold: (Math.random() - 0.5) * 0.1,
      confidenceWeight: (Math.random() - 0.5) * 0.1,
      amountSensitivity: (Math.random() - 0.5) * 0.1,
      timePreference: (Math.random() - 0.5) * 0.1,
      recipientTrust: (Math.random() - 0.5) * 0.1
    };
  }

  /**
   * Get agent specialization based on personality
   */
  getSpecialization(personalityName) {
    const specializations = {
      'Conservative': ['fraud_detection', 'risk_assessment'],
      'Balanced': ['pattern_recognition', 'optimization'],
      'Aggressive': ['opportunity_detection', 'speed_optimization'],
      'Analytical': ['data_analysis', 'trend_prediction'],
      'Adaptive': ['learning_adaptation', 'context_awareness']
    };
    return specializations[personalityName] || ['general'];
  }

  /**
   * Swarm-based payment decision using collective intelligence
   */
  async makeSwarmDecision(paymentRequest, neuralNetworkOutput) {
    const decisions = new Map();
    const confidenceScores = [];
    
    // Each agent makes independent decision
    for (const [agentId, agent] of this.agents) {
      const decision = await this.agentDecision(agent, paymentRequest, neuralNetworkOutput);
      decisions.set(agentId, decision);
      confidenceScores.push(decision.confidence);
    }

    // Calculate swarm consensus
    const consensus = this.calculateConsensus(decisions);
    
    // Update global knowledge
    this.updateGlobalKnowledge(paymentRequest, decisions, consensus);
    
    // Optimize swarm using PSO
    this.optimizeSwarm(decisions, consensus);
    
    return {
      decision: consensus.approve,
      confidence: consensus.confidence,
      swarmAgreement: consensus.agreement,
      individualDecisions: Array.from(decisions.values()),
      emergingPatterns: this.detectEmergingPatterns(decisions),
      swarmInsights: this.generateSwarmInsights(decisions, consensus)
    };
  }

  /**
   * Individual agent decision making
   */
  async agentDecision(agent, paymentRequest, neuralNetworkOutput) {
    const { personality, position, experience } = agent;
    
    // Agent-specific feature weighting
    const features = this.extractAgentFeatures(paymentRequest, agent);
    
    // Apply personality bias
    const personalityBias = this.applyPersonalityBias(features, personality);
    
    // Incorporate neural network output with agent perspective
    const hybridScore = this.combineNeuralAndSwarm(neuralNetworkOutput, personalityBias, position);
    
    // Make decision based on agent's risk tolerance
    const decision = {
      approve: hybridScore.risk < personality.riskTolerance && hybridScore.confidence > 0.5,
      confidence: hybridScore.confidence,
      risk: hybridScore.risk,
      reasoning: this.generateAgentReasoning(agent, hybridScore),
      agentId: agent.id,
      personality: personality.name,
      specialization: agent.specialization
    };

    // Update agent experience
    agent.experience.push({
      request: paymentRequest,
      decision,
      timestamp: Date.now()
    });

    // Keep experience bounded
    if (agent.experience.length > 100) {
      agent.experience = agent.experience.slice(-50);
    }

    return decision;
  }

  /**
   * Extract agent-specific features
   */
  extractAgentFeatures(paymentRequest, agent) {
    const baseFeatures = {
      amount: parseFloat(paymentRequest.amount),
      recipientHash: this.hashString(paymentRequest.recipient),
      purposeScore: this.analyzePurpose(paymentRequest.purpose),
      timeScore: this.analyzeTime(new Date())
    };

    // Apply agent specialization
    if (agent.specialization.includes('fraud_detection')) {
      baseFeatures.fraudIndicators = this.detectFraudIndicators(paymentRequest);
    }
    
    if (agent.specialization.includes('pattern_recognition')) {
      baseFeatures.patternScore = this.recognizePatterns(paymentRequest, agent.experience);
    }
    
    if (agent.specialization.includes('trend_prediction')) {
      baseFeatures.trendScore = this.predictTrends(paymentRequest, agent.experience);
    }

    return baseFeatures;
  }

  /**
   * Apply personality bias to features
   */
  applyPersonalityBias(features, personality) {
    const biasedFeatures = { ...features };
    
    // Conservative agents emphasize risk factors
    if (personality.name === 'Conservative') {
      biasedFeatures.riskMultiplier = 1.5;
      biasedFeatures.confidenceThreshold = 0.8;
    }
    
    // Aggressive agents emphasize opportunities
    if (personality.name === 'Aggressive') {
      biasedFeatures.opportunityMultiplier = 1.3;
      biasedFeatures.speedBonus = 0.2;
    }
    
    // Analytical agents focus on data quality
    if (personality.name === 'Analytical') {
      biasedFeatures.dataQualityWeight = 1.4;
      biasedFeatures.uncertaintyPenalty = 0.3;
    }

    return biasedFeatures;
  }

  /**
   * Combine neural network output with swarm intelligence
   */
  combineNeuralAndSwarm(neuralOutput, agentFeatures, agentPosition) {
    const neuralWeight = 0.6;
    const swarmWeight = 0.4;
    
    return {
      risk: neuralWeight * neuralOutput.risk + swarmWeight * this.calculateSwarmRisk(agentFeatures, agentPosition),
      confidence: neuralWeight * neuralOutput.confidence + swarmWeight * this.calculateSwarmConfidence(agentFeatures, agentPosition),
      optimization: neuralWeight * neuralOutput.optimization + swarmWeight * agentPosition.amountSensitivity
    };
  }

  /**
   * Calculate swarm-based risk assessment
   */
  calculateSwarmRisk(features, position) {
    let risk = 0.5; // Base risk
    
    // Amount-based risk
    if (features.amount > 100) risk += 0.2;
    if (features.amount > 500) risk += 0.3;
    
    // Purpose-based risk
    if (features.purposeScore < 0.3) risk += 0.4;
    
    // Time-based risk
    if (features.timeScore < 0.3) risk += 0.2;
    
    // Apply agent position bias
    risk = risk * (1 + position.riskThreshold - 0.5);
    
    return Math.max(0, Math.min(1, risk));
  }

  /**
   * Calculate swarm-based confidence
   */
  calculateSwarmConfidence(features, position) {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence for known patterns
    if (features.patternScore > 0.7) confidence += 0.3;
    
    // Boost for good purpose
    if (features.purposeScore > 0.7) confidence += 0.2;
    
    // Apply agent position bias
    confidence = confidence * (0.5 + position.confidenceWeight);
    
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Calculate swarm consensus
   */
  calculateConsensus(decisions) {
    const decisionArray = Array.from(decisions.values());
    const approvals = decisionArray.filter(d => d.approve).length;
    const totalDecisions = decisionArray.length;
    
    const approvalRate = approvals / totalDecisions;
    const avgConfidence = decisionArray.reduce((sum, d) => sum + d.confidence, 0) / totalDecisions;
    const avgRisk = decisionArray.reduce((sum, d) => sum + d.risk, 0) / totalDecisions;
    
    // Calculate agreement level (how similar are the decisions)
    const confidenceVariance = this.calculateVariance(decisionArray.map(d => d.confidence));
    const agreement = 1 - Math.min(confidenceVariance, 1);
    
    return {
      approve: approvalRate >= this.consensusThreshold,
      confidence: avgConfidence,
      risk: avgRisk,
      agreement,
      approvalRate,
      diversityScore: this.calculateDiversityScore(decisionArray)
    };
  }

  /**
   * Calculate variance of array
   */
  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  }

  /**
   * Calculate diversity score of decisions
   */
  calculateDiversityScore(decisions) {
    const personalities = [...new Set(decisions.map(d => d.personality))];
    const specializations = [...new Set(decisions.flatMap(d => d.specialization))];
    
    return (personalities.length / 5) * 0.5 + (specializations.length / 10) * 0.5;
  }

  /**
   * Update global knowledge base
   */
  updateGlobalKnowledge(paymentRequest, decisions, consensus) {
    const pattern = {
      amount: parseFloat(paymentRequest.amount),
      purpose: paymentRequest.purpose,
      consensus: consensus.approve,
      confidence: consensus.confidence,
      timestamp: Date.now()
    };

    // Update success patterns
    if (consensus.approve && consensus.confidence > 0.8) {
      const key = `${Math.floor(pattern.amount / 10)}_${paymentRequest.purpose.substring(0, 10)}`;
      this.globalKnowledge.successPatterns.set(key, pattern);
    }

    // Update risk patterns
    if (!consensus.approve || consensus.risk > 0.7) {
      const key = `risk_${Math.floor(pattern.amount / 10)}_${paymentRequest.purpose.substring(0, 10)}`;
      this.globalKnowledge.riskPatterns.set(key, pattern);
    }

    // Store consensus history
    this.globalKnowledge.consensusHistory.push({
      ...consensus,
      timestamp: Date.now(),
      paymentAmount: pattern.amount
    });

    // Keep history bounded
    if (this.globalKnowledge.consensusHistory.length > 1000) {
      this.globalKnowledge.consensusHistory = this.globalKnowledge.consensusHistory.slice(-500);
    }
  }

  /**
   * Optimize swarm using Particle Swarm Optimization
   */
  optimizeSwarm(decisions, consensus) {
    const globalBest = this.findGlobalBest();
    
    for (const [agentId, agent] of this.agents) {
      const decision = decisions.get(agentId);
      const fitness = this.calculateFitness(decision, consensus);
      
      // Update personal best
      if (fitness > agent.bestFitness) {
        agent.bestFitness = fitness;
        agent.bestPosition = { ...agent.position };
      }
      
      // Update velocity and position
      this.updateAgentVelocity(agent, globalBest);
      this.updateAgentPosition(agent);
    }
  }

  /**
   * Calculate fitness of agent decision
   */
  calculateFitness(decision, consensus) {
    let fitness = 0;
    
    // Reward correct decisions
    if (decision.approve === consensus.approve) fitness += 0.5;
    
    // Reward high confidence when correct
    if (decision.approve === consensus.approve) {
      fitness += decision.confidence * 0.3;
    }
    
    // Penalize overconfidence when wrong
    if (decision.approve !== consensus.approve) {
      fitness -= decision.confidence * 0.2;
    }
    
    // Reward diversity (different from consensus)
    if (Math.abs(decision.confidence - consensus.confidence) > 0.1) {
      fitness += 0.1;
    }
    
    return fitness;
  }

  /**
   * Find global best position
   */
  findGlobalBest() {
    let globalBest = null;
    let bestFitness = -Infinity;
    
    for (const agent of this.agents.values()) {
      if (agent.bestFitness > bestFitness) {
        bestFitness = agent.bestFitness;
        globalBest = agent.bestPosition;
      }
    }
    
    return globalBest;
  }

  /**
   * Update agent velocity using PSO
   */
  updateAgentVelocity(agent, globalBest) {
    if (!globalBest || !agent.bestPosition) return;
    
    Object.keys(agent.velocity).forEach(key => {
      const r1 = Math.random();
      const r2 = Math.random();
      
      agent.velocity[key] = 
        this.inertiaWeight * agent.velocity[key] +
        this.cognitiveWeight * r1 * (agent.bestPosition[key] - agent.position[key]) +
        this.socialWeight * r2 * (globalBest[key] - agent.position[key]);
      
      // Clamp velocity
      agent.velocity[key] = Math.max(-0.1, Math.min(0.1, agent.velocity[key]));
    });
  }

  /**
   * Update agent position
   */
  updateAgentPosition(agent) {
    Object.keys(agent.position).forEach(key => {
      agent.position[key] += agent.velocity[key];
      
      // Clamp position to [0, 1]
      agent.position[key] = Math.max(0, Math.min(1, agent.position[key]));
    });
  }

  /**
   * Detect emerging patterns in swarm decisions
   */
  detectEmergingPatterns(decisions) {
    const patterns = [];
    
    // Detect consensus shifts
    const recentHistory = this.globalKnowledge.consensusHistory.slice(-20);
    if (recentHistory.length > 10) {
      const recentApprovalRate = recentHistory.filter(h => h.approve).length / recentHistory.length;
      const historicalApprovalRate = this.globalKnowledge.consensusHistory.filter(h => h.approve).length / this.globalKnowledge.consensusHistory.length;
      
      if (Math.abs(recentApprovalRate - historicalApprovalRate) > 0.2) {
        patterns.push({
          type: 'consensus_shift',
          description: `Approval rate shifted from ${(historicalApprovalRate * 100).toFixed(1)}% to ${(recentApprovalRate * 100).toFixed(1)}%`,
          significance: Math.abs(recentApprovalRate - historicalApprovalRate)
        });
      }
    }
    
    // Detect agent specialization emergence
    const decisionArray = Array.from(decisions.values());
    const specializationPerformance = {};
    
    decisionArray.forEach(decision => {
      decision.specialization.forEach(spec => {
        if (!specializationPerformance[spec]) {
          specializationPerformance[spec] = { correct: 0, total: 0 };
        }
        specializationPerformance[spec].total++;
        // Simplified correctness check
        if (decision.confidence > 0.7) {
          specializationPerformance[spec].correct++;
        }
      });
    });
    
    Object.entries(specializationPerformance).forEach(([spec, perf]) => {
      const accuracy = perf.correct / perf.total;
      if (accuracy > 0.8 && perf.total > 3) {
        patterns.push({
          type: 'specialization_excellence',
          description: `${spec} specialization showing ${(accuracy * 100).toFixed(1)}% accuracy`,
          significance: accuracy
        });
      }
    });
    
    return patterns;
  }

  /**
   * Generate swarm insights
   */
  generateSwarmInsights(decisions, consensus) {
    const insights = [];
    
    // Diversity analysis
    if (consensus.diversityScore > 0.7) {
      insights.push('High decision diversity indicates complex payment scenario');
    } else if (consensus.diversityScore < 0.3) {
      insights.push('Low diversity suggests clear-cut decision case');
    }
    
    // Agreement analysis
    if (consensus.agreement > 0.9) {
      insights.push('Strong swarm consensus indicates high decision confidence');
    } else if (consensus.agreement < 0.5) {
      insights.push('Low agreement suggests need for additional analysis');
    }
    
    // Risk distribution analysis
    const riskLevels = Array.from(decisions.values()).map(d => d.risk);
    const riskVariance = this.calculateVariance(riskLevels);
    
    if (riskVariance > 0.1) {
      insights.push('High risk assessment variance indicates uncertain conditions');
    }
    
    return insights;
  }

  /**
   * Helper methods for feature extraction
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) / 0xffffffff;
  }

  analyzePurpose(purpose) {
    const validKeywords = ['api', 'service', 'subscription', 'data', 'infrastructure'];
    const suspiciousKeywords = ['test', 'random', 'unknown'];
    
    let score = 0.5;
    const lowerPurpose = purpose.toLowerCase();
    
    validKeywords.forEach(keyword => {
      if (lowerPurpose.includes(keyword)) score += 0.2;
    });
    
    suspiciousKeywords.forEach(keyword => {
      if (lowerPurpose.includes(keyword)) score -= 0.3;
    });
    
    return Math.max(0, Math.min(1, score));
  }

  analyzeTime(timestamp) {
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    
    let score = 0.5;
    
    // Business hours bonus
    if (hour >= 9 && hour <= 17) score += 0.3;
    
    // Weekday bonus
    if (dayOfWeek >= 1 && dayOfWeek <= 5) score += 0.2;
    
    return score;
  }

  detectFraudIndicators(paymentRequest) {
    let indicators = 0;
    
    // Large amount indicator
    if (parseFloat(paymentRequest.amount) > 1000) indicators++;
    
    // Suspicious purpose indicator
    if (paymentRequest.purpose.length < 5) indicators++;
    
    // Weekend/night indicator
    const now = new Date();
    if (now.getHours() < 6 || now.getHours() > 22) indicators++;
    if (now.getDay() === 0 || now.getDay() === 6) indicators++;
    
    return indicators / 4; // Normalize to [0-1]
  }

  recognizePatterns(paymentRequest, experience) {
    if (experience.length < 5) return 0.5;
    
    const similarRequests = experience.filter(exp => 
      Math.abs(parseFloat(exp.request.amount) - parseFloat(paymentRequest.amount)) < 10 &&
      exp.request.purpose.toLowerCase().includes(paymentRequest.purpose.toLowerCase().substring(0, 5))
    );
    
    return Math.min(similarRequests.length / 10, 1);
  }

  predictTrends(paymentRequest, experience) {
    if (experience.length < 10) return 0.5;
    
    const recentExperience = experience.slice(-10);
    const amounts = recentExperience.map(exp => parseFloat(exp.request.amount));
    const trend = amounts.slice(-3).reduce((a, b) => a + b, 0) / 3 - amounts.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    
    // Normalize trend to [0-1]
    return 0.5 + Math.max(-0.5, Math.min(0.5, trend / 100));
  }

  generateAgentReasoning(agent, hybridScore) {
    const reasons = [];
    
    reasons.push(`${agent.personality.name} agent perspective`);
    
    if (hybridScore.confidence > 0.8) {
      reasons.push('High confidence from swarm analysis');
    } else if (hybridScore.confidence < 0.3) {
      reasons.push('Low confidence indicates uncertainty');
    }
    
    if (agent.specialization.includes('fraud_detection') && hybridScore.risk > 0.7) {
      reasons.push('Fraud detection specialist flagged high risk');
    }
    
    if (agent.specialization.includes('pattern_recognition')) {
      reasons.push('Pattern analysis incorporated');
    }
    
    return reasons.join('; ');
  }

  /**
   * Get swarm statistics for monitoring
   */
  getSwarmStats() {
    const agentStats = Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      personality: agent.personality.name,
      specialization: agent.specialization,
      bestFitness: agent.bestFitness,
      experienceCount: agent.experience.length
    }));

    return {
      swarmSize: this.agents.size,
      agents: agentStats,
      globalKnowledge: {
        successPatterns: this.globalKnowledge.successPatterns.size,
        riskPatterns: this.globalKnowledge.riskPatterns.size,
        consensusHistory: this.globalKnowledge.consensusHistory.length
      },
      parameters: {
        consensusThreshold: this.consensusThreshold,
        diversityWeight: this.diversityWeight,
        explorationRate: this.explorationRate
      }
    };
  }
}

module.exports = SwarmIntelligence;