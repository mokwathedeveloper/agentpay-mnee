/**
 * @fileoverview Configuration management utilities to reduce duplication
 * @author AgentPay Team
 * @version 1.0.0
 */

'use strict';

const { ErrorHandler } = require('./errorHandler');
const { createLogger } = require('./logger');

const logger = createLogger('ConfigManager');

/**
 * Configuration manager for consistent environment handling
 */
class ConfigManager {
  /**
   * Gets required environment variable with validation
   * @param {string} key - Environment variable key
   * @param {string} description - Human readable description
   * @returns {string} Environment variable value
   * @throws {Error} If variable is missing or empty
   */
  static getRequiredEnv(key, description) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      throw ErrorHandler.validationError(
        `Missing required environment variable: ${key} (${description})`
      );
    }
    return value.trim();
  }

  /**
   * Gets optional environment variable with default
   * @param {string} key - Environment variable key
   * @param {string} defaultValue - Default value if not set
   * @returns {string} Environment variable value or default
   */
  static getOptionalEnv(key, defaultValue) {
    const value = process.env[key];
    return value && value.trim() !== '' ? value.trim() : defaultValue;
  }

  /**
   * Gets agent-specific configuration
   * @param {string} agentId - Agent identifier
   * @returns {Object} Agent configuration
   */
  static getAgentConfig(agentId) {
    return {
      name: this.getRequiredEnv(`AGENT_${agentId}_NAME`, `Agent ${agentId} name`),
      privateKey: this.getRequiredEnv(`AGENT_${agentId}_PRIVATE_KEY`, `Agent ${agentId} private key`),
      walletAddress: this.getRequiredEnv(`AGENT_${agentId}_WALLET_ADDRESS`, `Agent ${agentId} wallet address`)
    };
  }

  /**
   * Gets shared system configuration
   * @returns {Object} System configuration
   */
  static getSystemConfig() {
    return {
      rpcUrl: this.getRequiredEnv('RPC_URL', 'RPC endpoint URL'),
      vaultAddress: this.getRequiredEnv('VAULT_CONTRACT_ADDRESS', 'Vault contract address'),
      mneeTokenAddress: this.getRequiredEnv('MNEE_TOKEN_ADDRESS', 'MNEE token contract address')
    };
  }

  /**
   * Gets policy configuration
   * @returns {Object} Policy configuration
   */
  static getPolicyConfig() {
    const validPurposes = this.getRequiredEnv('AGENT_VALID_PURPOSES', 'Valid payment purposes');
    const minAmount = this.getRequiredEnv('AGENT_MIN_AMOUNT', 'Minimum payment amount');
    const maxAmount = this.getRequiredEnv('AGENT_MAX_AMOUNT', 'Maximum payment amount');
    const requestDelay = this.getRequiredEnv('AGENT_REQUEST_DELAY_MS', 'Request delay in milliseconds');

    return {
      validPurposes: validPurposes.split(',').map(p => p.trim()),
      minAmount: parseFloat(minAmount),
      maxAmount: parseFloat(maxAmount),
      requestDelay: parseInt(requestDelay, 10)
    };
  }

  /**
   * Validates configuration completeness
   * @param {string} component - Component being validated
   * @throws {Error} If configuration is incomplete
   */
  static validateConfig(component) {
    try {
      switch (component) {
        case 'system':
          this.getSystemConfig();
          break;
        case 'policy':
          this.getPolicyConfig();
          break;
        default:
          throw new Error(`Unknown component: ${component}`);
      }
      logger.info('Configuration validated', { component });
    } catch (error) {
      logger.error('Configuration validation failed', { component, error: error.message });
      throw error;
    }
  }
}

module.exports = ConfigManager;