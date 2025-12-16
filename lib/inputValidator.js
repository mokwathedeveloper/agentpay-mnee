/**
 * @fileoverview Input validation utilities for security and data integrity
 * @author AgentPay Team
 * @version 1.0.0
 */

'use strict';

const { VALIDATION } = require('./constants');

/**
 * Input validator for secure data validation
 */
class InputValidator {
  /**
   * Validates Ethereum address format
   * @param {string} address - Address to validate
   * @returns {boolean} True if valid Ethereum address
   */
  static isValidEthereumAddress(address) {
    if (typeof address !== 'string') {
      return false;
    }
    return VALIDATION.ETHEREUM_ADDRESS.test(address);
  }

  /**
   * Validates private key format
   * @param {string} privateKey - Private key to validate
   * @returns {boolean} True if valid private key format
   */
  static isValidPrivateKey(privateKey) {
    if (typeof privateKey !== 'string') {
      return false;
    }
    return VALIDATION.PRIVATE_KEY.test(privateKey);
  }

  /**
   * Validates payment amount
   * @param {number|string} amount - Amount to validate
   * @returns {boolean} True if valid amount
   */
  static isValidAmount(amount) {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && isFinite(numAmount);
  }

  /**
   * Validates payment purpose string
   * @param {string} purpose - Purpose to validate
   * @returns {boolean} True if valid purpose
   */
  static isValidPurpose(purpose) {
    if (typeof purpose !== 'string') {
      return false;
    }
    return purpose.length > 0 && purpose.length <= VALIDATION.MAX_PURPOSE_LENGTH;
  }

  /**
   * Sanitizes string input to prevent injection attacks
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized input
   */
  static sanitizeString(input) {
    if (typeof input !== 'string') {
      return '';
    }
    return input.replace(/[<>\"'&]/g, '').trim();
  }

  /**
   * Validates agent ID
   * @param {string|number} agentId - Agent ID to validate
   * @returns {boolean} True if valid agent ID
   */
  static isValidAgentId(agentId) {
    const numId = parseInt(agentId, 10);
    return !isNaN(numId) && numId > 0 && numId <= VALIDATION.MAX_AGENTS;
  }
}

module.exports = InputValidator;