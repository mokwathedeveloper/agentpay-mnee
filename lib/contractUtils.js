/**
 * @fileoverview Contract utility functions to reduce code duplication
 * @author AgentPay Team
 * @version 1.0.0
 */

'use strict';

const ethers = require('ethers');
const { createLogger } = require('./logger');
const { ErrorHandler } = require('./errorHandler');

const logger = createLogger('ContractUtils');

/**
 * Common contract interaction utilities
 */
class ContractUtils {
  /**
   * Formats token amount from wei to human readable
   * @param {BigInt|string} amount - Amount in wei
   * @param {number} [decimals=18] - Token decimals
   * @returns {string} Formatted amount
   */
  static formatTokenAmount(amount, decimals = 18) {
    try {
      return ethers.formatUnits(amount, decimals);
    } catch (error) {
      logger.error('Failed to format token amount', { amount, decimals, error: error.message });
      return '0';
    }
  }

  /**
   * Parses token amount from human readable to wei
   * @param {string|number} amount - Human readable amount
   * @param {number} [decimals=18] - Token decimals
   * @returns {BigInt} Amount in wei
   */
  static parseTokenAmount(amount, decimals = 18) {
    try {
      return ethers.parseUnits(amount.toString(), decimals);
    } catch (error) {
      logger.error('Failed to parse token amount', { amount, decimals, error: error.message });
      throw ErrorHandler.validationError('Invalid token amount format');
    }
  }

  /**
   * Gets contract info with error handling
   * @param {Object} contract - Ethers contract instance
   * @param {string} method - Contract method name
   * @param {Array} [params=[]] - Method parameters
   * @returns {Promise<any>} Contract call result
   */
  static async safeContractCall(contract, method, params = []) {
    try {
      logger.debug('Contract call', { method, params });
      const result = await contract[method](...params);
      logger.debug('Contract call success', { method, result });
      return result;
    } catch (error) {
      logger.error('Contract call failed', { method, params, error: error.message });
      throw ErrorHandler.networkError(`Contract call failed: ${method}`);
    }
  }

  /**
   * Formats vault status data consistently
   * @param {Array} vaultData - Raw vault data from contract
   * @returns {Object} Formatted vault status
   */
  static formatVaultStatus(vaultData) {
    const [balance, dailyLimit, dailySpent] = vaultData;
    return {
      balance: this.formatTokenAmount(balance),
      dailyLimit: this.formatTokenAmount(dailyLimit),
      dailySpent: this.formatTokenAmount(dailySpent),
      remainingLimit: this.formatTokenAmount(dailyLimit - dailySpent)
    };
  }

  /**
   * Validates Ethereum address
   * @param {string} address - Address to validate
   * @throws {Error} If address is invalid
   */
  static validateAddress(address) {
    if (!ethers.isAddress(address)) {
      throw ErrorHandler.validationError('Invalid Ethereum address format');
    }
  }

  /**
   * Masks sensitive address for logging
   * @param {string} address - Full address
   * @returns {string} Masked address
   */
  static maskAddress(address) {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

module.exports = ContractUtils;