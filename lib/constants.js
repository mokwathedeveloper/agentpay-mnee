/**
 * @fileoverview Application constants and configuration values
 * @author AgentPay Team
 * @version 1.0.0
 */

'use strict';

/**
 * Network configuration constants
 * @readonly
 * @enum {string}
 */
const NETWORKS = Object.freeze({
  MAINNET: 'mainnet',
  SEPOLIA: 'sepolia',
  HARDHAT: 'hardhat',
  LOCALHOST: 'localhost'
});

/**
 * Contract addresses for different networks
 * @readonly
 * @type {Object<string, Object<string, string>>}
 */
const CONTRACT_ADDRESSES = Object.freeze({
  [NETWORKS.MAINNET]: {
    MNEE_TOKEN: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF'
  },
  [NETWORKS.SEPOLIA]: {
    MNEE_TOKEN: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF'
  }
});

/**
 * Default configuration values
 * @readonly
 * @type {Object<string, number>}
 */
const DEFAULTS = Object.freeze({
  AGENT_REQUEST_DELAY_MS: 2000,
  MIN_PAYMENT_AMOUNT: 0.1,
  MAX_PAYMENT_AMOUNT: 1000,
  TRANSACTION_TIMEOUT_MS: 300000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  GAS_LIMIT_BUFFER: 1.2 // 20% buffer
});

/**
 * Validation patterns and limits
 * @readonly
 * @type {Object<string, RegExp|number>}
 */
const VALIDATION = Object.freeze({
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  PRIVATE_KEY: /^0x[a-fA-F0-9]{64}$/,
  MAX_PURPOSE_LENGTH: 256,
  MIN_AMOUNT_WEI: 1,
  MAX_AGENTS: 10
});

/**
 * Error codes for consistent error handling
 * @readonly
 * @enum {string}
 */
const ERROR_CODES = Object.freeze({
  INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',
  RECIPIENT_NOT_WHITELISTED: 'RECIPIENT_NOT_WHITELISTED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
});

/**
 * Log levels for structured logging
 * @readonly
 * @enum {string}
 */
const LOG_LEVELS = Object.freeze({
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
});

module.exports = {
  NETWORKS,
  CONTRACT_ADDRESSES,
  DEFAULTS,
  VALIDATION,
  ERROR_CODES,
  LOG_LEVELS
};