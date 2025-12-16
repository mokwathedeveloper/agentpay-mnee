/**
 * AI Decision Engine for AgentPay
 * Uses machine learning algorithms to make intelligent payment decisions
 */

class AIDecisionEngine {
  constructor() {
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
  }

  /**
   * AI-powered payment decision using weighted scoring algorithm
   */
  async makePaymentDecision(paymentRequest) {
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
      reasoning: this.generateReasoning(features, confidenceScore, riskScore),
      suggestedAmount: this.optimizeAmount(amount, features)
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
   * Get AI model statistics
   */
  getModelStats() {
    return {
      totalTransactions: this.transactionHistory.length,
      weights: { ...this.weights },
      riskThreshold: this.riskThreshold,
      learningRate: this.learningRate
    };
  }
}

module.exports = AIDecisionEngine;