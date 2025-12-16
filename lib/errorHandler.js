/**
 * @fileoverview Centralized error handling for production applications
 * @author AgentPay Team
 * @version 1.0.0
 */

'use strict';

const { ERROR_CODES } = require('./constants');
const { createLogger } = require('./logger');

const logger = createLogger('ErrorHandler');

/**
 * Custom error class for AgentPay operations
 */
class AgentPayError extends Error {
  /**
   * Creates a new AgentPayError
   * @param {string} message - Error message
   * @param {string} code - Error code from ERROR_CODES
   * @param {Object} [context={}] - Additional error context
   */
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'AgentPayError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Centralized error handler
 */
class ErrorHandler {
  /**
   * Handles and logs errors consistently
   * @param {Error} error - Error to handle
   * @param {Object} [context={}] - Additional context
   * @returns {Object} Standardized error response
   */
  static handle(error, context = {}) {
    const errorInfo = {
      message: error.message,
      code: error.code || ERROR_CODES.UNKNOWN_ERROR,
      timestamp: new Date().toISOString(),
      context: { ...error.context, ...context }
    };

    // Log error with appropriate level
    if (error.code === ERROR_CODES.VALIDATION_ERROR) {
      logger.warn('Validation error', errorInfo);
    } else if (error.code === ERROR_CODES.NETWORK_ERROR) {
      logger.error('Network error', errorInfo);
    } else {
      logger.error('Application error', errorInfo);
    }

    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || ERROR_CODES.UNKNOWN_ERROR
      }
    };
  }

  /**
   * Creates a validation error
   * @param {string} message - Error message
   * @param {Object} [context={}] - Additional context
   * @returns {AgentPayError} Validation error
   */
  static validationError(message, context = {}) {
    return new AgentPayError(message, ERROR_CODES.VALIDATION_ERROR, context);
  }

  /**
   * Creates a network error
   * @param {string} message - Error message
   * @param {Object} [context={}] - Additional context
   * @returns {AgentPayError} Network error
   */
  static networkError(message, context = {}) {
    return new AgentPayError(message, ERROR_CODES.NETWORK_ERROR, context);
  }

  /**
   * Creates a transaction error
   * @param {string} message - Error message
   * @param {Object} [context={}] - Additional context
   * @returns {AgentPayError} Transaction error
   */
  static transactionError(message, context = {}) {
    return new AgentPayError(message, ERROR_CODES.TRANSACTION_FAILED, context);
  }
}

module.exports = {
  AgentPayError,
  ErrorHandler
};