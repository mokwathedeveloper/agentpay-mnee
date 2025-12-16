/**
 * @fileoverview Reinforcement Learning Engine with Deep Q-Network
 * Advanced RL for autonomous payment optimization
 * @author AgentPay Team
 * @version 3.0.0
 */

'use strict';

class ReinforcementLearningEngine {
  constructor() {
    // DQN Architecture
    this.stateDim = 16;
    this.actionDim = 4; // approve, reject, modify_amount, request_info
    this.hiddenDim = 64;
    
    // Q-Network
    this.qNetwork = this.initializeQNetwork();
    this.targetNetwork = this.deepCopy(this.qNetwork);
    
    // RL Parameters
    this.epsilon = 0.1; // Exploration rate
    this.epsilonDecay = 0.995;
    this.epsilonMin = 0.01;
    this.gamma = 0.95; // Discount factor
    this.learningRate = 0.001;
    this.batchSize = 32;
    this.targetUpdateFreq = 100;
    
    // Experience Replay
    this.replayBuffer = [];
    this.maxBufferSize = 10000;
    this.minBufferSize = 1000;
    
    // Training State
    this.totalSteps = 0;
    this.totalReward = 0;
    this.episodeRewards = [];
    this.lossHistory = [];
    
    // Advanced Features
    this.prioritizedReplay = true;
    this.doubleDQN = true;
    this.duelingNetwork = true;
    
    console.log('🎮 Reinforcement Learning Engine Initialized');
    console.log(`   🧠 Q-Network: ${this.stateDim}→${this.hiddenDim}→${this.actionDim}`);
    console.log(`   🎯 Actions: Approve, Reject, Modify, Request Info`);
    console.log(`   📚 Experience Replay Buffer: ${this.maxBufferSize} transitions`);
  }

  /**
   * Initialize Deep Q-Network with dueling architecture
   */
  initializeQNetwork() {
    return {
      // Shared feature layers
      featureWeights1: this.initializeWeights(this.stateDim, this.hiddenDim),
      featureBias1: new Array(this.hiddenDim).fill(0),
      featureWeights2: this.initializeWeights(this.hiddenDim, this.hiddenDim),
      featureBias2: new Array(this.hiddenDim).fill(0),
      
      // Value stream (dueling architecture)
      valueWeights: this.initializeWeights(this.hiddenDim, 1),
      valueBias: [0],
      
      // Advantage stream (dueling architecture)
      advantageWeights: this.initializeWeights(this.hiddenDim, this.actionDim),
      advantageBias: new Array(this.actionDim).fill(0)
    };
  }

  /**
   * Initialize weights with He initialization
   */
  initializeWeights(inputSize, outputSize) {
    const weights = [];
    const std = Math.sqrt(2 / inputSize);
    
    for (let i = 0; i < outputSize; i++) {
      weights[i] = [];
      for (let j = 0; j < inputSize; j++) {
        weights[i][j] = this.randomNormal() * std;
      }
    }
    
    return weights;
  }

  /**
   * Generate random number from normal distribution
   */
  randomNormal() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  /**
   * RL-based payment decision making
   */
  async makeRLDecision(paymentRequest, currentState, previousReward = 0) {
    console.log('🎮 Running Reinforcement Learning Analysis...');
    
    // Extract state representation
    const state = this.extractStateFeatures(paymentRequest, currentState);
    
    // Get Q-values for all actions
    const qValues = this.forward(state, this.qNetwork);
    
    // Select action using epsilon-greedy policy
    const action = this.selectAction(qValues);
    
    // Calculate action confidence
    const actionConfidence = this.calculateActionConfidence(qValues, action);
    
    // Generate RL insights
    const rlInsights = this.generateRLInsights(qValues, action, state);
    
    console.log(`   🎯 Selected Action: ${this.getActionName(action)}`);
    console.log(`   📊 Q-Values: [${qValues.map(q => q.toFixed(3)).join(', ')}]`);
    console.log(`   🎲 Exploration Rate: ${(this.epsilon * 100).toFixed(1)}%`);
    console.log(`   💪 Action Confidence: ${(actionConfidence * 100).toFixed(1)}%`);
    
    // Store experience for training
    if (this.replayBuffer.length > 0) {
      const lastExperience = this.replayBuffer[this.replayBuffer.length - 1];
      if (lastExperience && !lastExperience.nextState) {
        lastExperience.nextState = state;
        lastExperience.reward = previousReward;
        lastExperience.done = false;
      }
    }
    
    // Add current experience
    this.addExperience(state, action, 0, null, false); // Reward will be updated next step
    
    // Train if enough experiences
    if (this.replayBuffer.length >= this.minBufferSize) {
      await this.trainDQN();
    }
    
    // Update target network periodically
    if (this.totalSteps % this.targetUpdateFreq === 0) {
      this.updateTargetNetwork();
    }
    
    this.totalSteps++;
    
    return {
      action: this.getActionName(action),
      actionIndex: action,
      qValues,
      actionConfidence,
      explorationRate: this.epsilon,
      rlInsights,
      stateRepresentation: state,
      networkStats: this.getNetworkStats()
    };
  }

  /**
   * Extract state features for RL
   */
  extractStateFeatures(paymentRequest, currentState) {
    const features = new Array(this.stateDim).fill(0);
    
    // Payment features
    features[0] = Math.log(parseFloat(paymentRequest.amount) + 1) / 10; // Log amount
    features[1] = this.hashToFloat(paymentRequest.recipient); // Recipient hash
    features[2] = this.analyzePurposeRL(paymentRequest.purpose); // Purpose score
    
    // Temporal features
    const now = new Date();
    features[3] = now.getHours() / 24; // Hour of day
    features[4] = now.getDay() / 7; // Day of week
    features[5] = now.getDate() / 31; // Day of month
    
    // Vault state features
    if (currentState) {
      features[6] = Math.min(parseFloat(currentState.balance) / 1000, 1); // Normalized balance
      features[7] = Math.min(parseFloat(currentState.dailyLimit) / 1000, 1); // Normalized limit
      features[8] = Math.min(parseFloat(currentState.dailySpent) / 1000, 1); // Normalized spent
      features[9] = Math.min(parseFloat(currentState.remainingAllowance) / 1000, 1); // Normalized remaining
    }
    
    // Historical features
    features[10] = this.calculateRecentSuccessRate();
    features[11] = this.calculateAverageAmount();
    features[12] = this.calculateFrequencyScore(paymentRequest.recipient);
    
    // Risk indicators
    features[13] = this.calculateRiskIndicator(paymentRequest);
    features[14] = this.calculateUrgencyScore(paymentRequest.purpose);
    features[15] = Math.random() * 0.1; // Noise for exploration
    
    return features;
  }

  /**
   * Forward pass through Q-Network with dueling architecture
   */
  forward(state, network) {
    // Shared feature extraction
    let hidden1 = this.matrixVectorMultiply(network.featureWeights1, state);
    hidden1 = this.addBias(hidden1, network.featureBias1);
    hidden1 = this.relu(hidden1);
    
    let hidden2 = this.matrixVectorMultiply(network.featureWeights2, hidden1);
    hidden2 = this.addBias(hidden2, network.featureBias2);
    hidden2 = this.relu(hidden2);
    
    // Value stream
    const value = this.matrixVectorMultiply(network.valueWeights, hidden2)[0] + network.valueBias[0];
    
    // Advantage stream
    let advantages = this.matrixVectorMultiply(network.advantageWeights, hidden2);
    advantages = this.addBias(advantages, network.advantageBias);
    
    // Combine value and advantages (dueling architecture)
    const meanAdvantage = advantages.reduce((sum, adv) => sum + adv, 0) / advantages.length;
    const qValues = advantages.map(adv => value + adv - meanAdvantage);
    
    return qValues;
  }

  /**
   * Select action using epsilon-greedy policy with advanced exploration
   */
  selectAction(qValues) {
    // Epsilon-greedy with decay
    if (Math.random() < this.epsilon) {
      // Exploration: random action
      return Math.floor(Math.random() * this.actionDim);
    } else {
      // Exploitation: best action
      return qValues.indexOf(Math.max(...qValues));
    }
  }

  /**
   * Calculate action confidence based on Q-value distribution
   */
  calculateActionConfidence(qValues, selectedAction) {
    const maxQ = Math.max(...qValues);
    const minQ = Math.min(...qValues);
    const range = maxQ - minQ;
    
    if (range === 0) return 0.5;
    
    const selectedQ = qValues[selectedAction];
    return (selectedQ - minQ) / range;
  }

  /**
   * Add experience to replay buffer with prioritization
   */
  addExperience(state, action, reward, nextState, done) {
    const experience = {
      state: [...state],
      action,
      reward,
      nextState: nextState ? [...nextState] : null,
      done,
      priority: 1.0, // Will be updated based on TD error
      timestamp: Date.now()
    };
    
    this.replayBuffer.push(experience);
    
    // Remove old experiences if buffer is full
    if (this.replayBuffer.length > this.maxBufferSize) {
      this.replayBuffer.shift();
    }
  }

  /**
   * Train Deep Q-Network using experience replay
   */
  async trainDQN() {
    if (this.replayBuffer.length < this.minBufferSize) return;
    
    // Sample batch from replay buffer
    const batch = this.sampleBatch();
    
    // Calculate target Q-values
    const targets = this.calculateTargets(batch);
    
    // Calculate loss and gradients
    const loss = this.calculateLoss(batch, targets);
    
    // Update network weights (simplified gradient descent)
    this.updateWeights(batch, targets);
    
    // Update exploration rate
    this.epsilon = Math.max(this.epsilonMin, this.epsilon * this.epsilonDecay);
    
    // Record training metrics
    this.lossHistory.push(loss);
    if (this.lossHistory.length > 1000) {
      this.lossHistory.shift();
    }
    
    console.log(`   📈 Training Loss: ${loss.toFixed(6)}, ε: ${this.epsilon.toFixed(4)}`);
  }

  /**
   * Sample batch from replay buffer (prioritized sampling)
   */
  sampleBatch() {
    const batch = [];
    
    if (this.prioritizedReplay) {
      // Prioritized experience replay
      const priorities = this.replayBuffer.map(exp => exp.priority);
      const totalPriority = priorities.reduce((sum, p) => sum + p, 0);
      
      for (let i = 0; i < Math.min(this.batchSize, this.replayBuffer.length); i++) {
        const rand = Math.random() * totalPriority;
        let cumSum = 0;
        
        for (let j = 0; j < this.replayBuffer.length; j++) {
          cumSum += priorities[j];
          if (cumSum >= rand) {
            batch.push(this.replayBuffer[j]);
            break;
          }
        }
      }
    } else {
      // Uniform random sampling
      for (let i = 0; i < Math.min(this.batchSize, this.replayBuffer.length); i++) {
        const randomIndex = Math.floor(Math.random() * this.replayBuffer.length);
        batch.push(this.replayBuffer[randomIndex]);
      }
    }
    
    return batch;
  }

  /**
   * Calculate target Q-values using Double DQN
   */
  calculateTargets(batch) {
    const targets = [];
    
    for (const experience of batch) {
      if (experience.done || !experience.nextState) {
        targets.push(experience.reward);
      } else {
        if (this.doubleDQN) {
          // Double DQN: use main network to select action, target network to evaluate
          const nextQValues = this.forward(experience.nextState, this.qNetwork);
          const bestAction = nextQValues.indexOf(Math.max(...nextQValues));
          const targetQValues = this.forward(experience.nextState, this.targetNetwork);
          const target = experience.reward + this.gamma * targetQValues[bestAction];
          targets.push(target);
        } else {
          // Standard DQN
          const targetQValues = this.forward(experience.nextState, this.targetNetwork);
          const target = experience.reward + this.gamma * Math.max(...targetQValues);
          targets.push(target);
        }
      }
    }
    
    return targets;
  }

  /**
   * Calculate training loss
   */
  calculateLoss(batch, targets) {
    let totalLoss = 0;
    
    for (let i = 0; i < batch.length; i++) {
      const experience = batch[i];
      const qValues = this.forward(experience.state, this.qNetwork);
      const predicted = qValues[experience.action];
      const target = targets[i];
      
      const tdError = target - predicted;
      totalLoss += tdError * tdError;
      
      // Update priority for prioritized replay
      if (this.prioritizedReplay) {
        experience.priority = Math.abs(tdError) + 0.01;
      }
    }
    
    return totalLoss / batch.length;
  }

  /**
   * Update network weights (simplified)
   */
  updateWeights(batch, targets) {
    // Simplified weight update - in production would use proper backpropagation
    const learningRate = this.learningRate;
    
    for (let i = 0; i < batch.length; i++) {
      const experience = batch[i];
      const qValues = this.forward(experience.state, this.qNetwork);
      const predicted = qValues[experience.action];
      const target = targets[i];
      const error = target - predicted;
      
      // Update advantage weights (simplified gradient)
      for (let j = 0; j < this.actionDim; j++) {
        if (j === experience.action) {
          this.qNetwork.advantageBias[j] += learningRate * error;
        }
      }
    }
  }

  /**
   * Update target network
   */
  updateTargetNetwork() {
    this.targetNetwork = this.deepCopy(this.qNetwork);
    console.log('   🎯 Target network updated');
  }

  /**
   * Generate RL insights
   */
  generateRLInsights(qValues, selectedAction, state) {
    const insights = [];
    
    // Q-value analysis
    const maxQ = Math.max(...qValues);
    const minQ = Math.min(...qValues);
    const qRange = maxQ - minQ;
    
    if (qRange > 0.5) {
      insights.push('High Q-value variance indicates clear action preferences');
    } else if (qRange < 0.1) {
      insights.push('Low Q-value variance suggests uncertain decision');
    }
    
    // Action analysis
    const actionName = this.getActionName(selectedAction);
    if (selectedAction === 0) { // Approve
      insights.push('RL agent recommends approval based on learned policy');
    } else if (selectedAction === 1) { // Reject
      insights.push('RL agent recommends rejection to minimize risk');
    } else if (selectedAction === 2) { // Modify
      insights.push('RL agent suggests amount modification for optimization');
    }
    
    // Exploration analysis
    if (this.epsilon > 0.05) {
      insights.push(`Active exploration with ${(this.epsilon * 100).toFixed(1)}% random actions`);
    }
    
    return insights;
  }

  /**
   * Get action name from index
   */
  getActionName(actionIndex) {
    const actions = ['APPROVE', 'REJECT', 'MODIFY_AMOUNT', 'REQUEST_INFO'];
    return actions[actionIndex] || 'UNKNOWN';
  }

  /**
   * Get network statistics
   */
  getNetworkStats() {
    return {
      totalSteps: this.totalSteps,
      explorationRate: this.epsilon,
      replayBufferSize: this.replayBuffer.length,
      averageLoss: this.lossHistory.length > 0 ? 
        this.lossHistory.reduce((sum, loss) => sum + loss, 0) / this.lossHistory.length : 0,
      totalReward: this.totalReward,
      episodeCount: this.episodeRewards.length,
      networkParameters: this.calculateNetworkParameters()
    };
  }

  /**
   * Calculate total network parameters
   */
  calculateNetworkParameters() {
    let params = 0;
    params += this.stateDim * this.hiddenDim; // Feature layer 1
    params += this.hiddenDim * this.hiddenDim; // Feature layer 2
    params += this.hiddenDim * 1; // Value stream
    params += this.hiddenDim * this.actionDim; // Advantage stream
    params += this.hiddenDim * 2 + 1 + this.actionDim; // Biases
    return params;
  }

  // Helper methods
  matrixVectorMultiply(matrix, vector) {
    return matrix.map(row => row.reduce((sum, weight, i) => sum + weight * vector[i], 0));
  }
  
  addBias(vector, bias) {
    return vector.map((val, i) => val + bias[i]);
  }
  
  relu(vector) {
    return vector.map(val => Math.max(0, val));
  }
  
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  hashToFloat(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) / 0xffffffff;
  }
  
  analyzePurposeRL(purpose) {
    const validKeywords = ['api', 'service', 'subscription', 'data'];
    const score = validKeywords.reduce((acc, keyword) => 
      acc + (purpose.toLowerCase().includes(keyword) ? 0.25 : 0), 0);
    return Math.min(score, 1);
  }
  
  calculateRecentSuccessRate() {
    // Simplified - would use actual transaction history
    return 0.85 + Math.random() * 0.1;
  }
  
  calculateAverageAmount() {
    return 0.5 + Math.random() * 0.3;
  }
  
  calculateFrequencyScore(recipient) {
    return Math.random() * 0.5;
  }
  
  calculateRiskIndicator(request) {
    return parseFloat(request.amount) > 100 ? 0.7 : 0.3;
  }
  
  calculateUrgencyScore(purpose) {
    const urgentKeywords = ['emergency', 'urgent', 'critical'];
    return urgentKeywords.some(keyword => purpose.toLowerCase().includes(keyword)) ? 0.9 : 0.1;
  }
}

module.exports = ReinforcementLearningEngine;