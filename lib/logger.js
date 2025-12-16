/**
 * @fileoverview Structured logging utility for production environments
 * @author AgentPay Team
 * @version 1.0.0
 */

'use strict';

const { LOG_LEVELS } = require('./constants');

/**
 * Production-grade logger with structured output
 * Provides consistent logging format across the application
 */
class Logger {
  /**
   * Creates a new Logger instance
   * @param {string} component - Component name for log identification
   * @param {string} [level='info'] - Minimum log level to output
   */
  constructor(component, level = LOG_LEVELS.INFO) {
    this.component = component;
    this.level = level;
    this.levels = {
      [LOG_LEVELS.ERROR]: 0,
      [LOG_LEVELS.WARN]: 1,
      [LOG_LEVELS.INFO]: 2,
      [LOG_LEVELS.DEBUG]: 3
    };
  }

  /**
   * Checks if a log level should be output
   * @param {string} level - Log level to check
   * @returns {boolean} True if level should be logged
   * @private
   */
  _shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  /**
   * Formats log entry with timestamp and metadata
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} [metadata={}] - Additional metadata
   * @returns {Object} Formatted log entry
   * @private
   */
  _formatLog(level, message, metadata = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      ...metadata
    };
  }

  /**
   * Outputs log entry to console
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} [metadata={}] - Additional metadata
   * @private
   */
  _output(level, message, metadata = {}) {
    if (!this._shouldLog(level)) {
      return;
    }

    const logEntry = this._formatLog(level, message, metadata);
    
    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(JSON.stringify(logEntry));
        break;
      case LOG_LEVELS.WARN:
        console.warn(JSON.stringify(logEntry));
        break;
      case LOG_LEVELS.DEBUG:
        console.debug(JSON.stringify(logEntry));
        break;
      default:
        console.log(JSON.stringify(logEntry));
    }
  }

  /**
   * Logs an error message
   * @param {string} message - Error message
   * @param {Object} [metadata={}] - Additional error context
   */
  error(message, metadata = {}) {
    this._output(LOG_LEVELS.ERROR, message, metadata);
  }

  /**
   * Logs a warning message
   * @param {string} message - Warning message
   * @param {Object} [metadata={}] - Additional warning context
   */
  warn(message, metadata = {}) {
    this._output(LOG_LEVELS.WARN, message, metadata);
  }

  /**
   * Logs an info message
   * @param {string} message - Info message
   * @param {Object} [metadata={}] - Additional info context
   */
  info(message, metadata = {}) {
    this._output(LOG_LEVELS.INFO, message, metadata);
  }

  /**
   * Logs a debug message
   * @param {string} message - Debug message
   * @param {Object} [metadata={}] - Additional debug context
   */
  debug(message, metadata = {}) {
    this._output(LOG_LEVELS.DEBUG, message, metadata);
  }

  /**
   * Logs transaction-related events with structured format
   * @param {string} txId - Transaction identifier
   * @param {string} status - Transaction status
   * @param {Object} details - Transaction details
   */
  transaction(txId, status, details = {}) {
    this.info('Transaction event', {
      txId,
      status,
      ...details
    });
  }

  /**
   * Logs agent decision events with structured format
   * @param {string} agentId - Agent identifier
   * @param {string} decision - Decision outcome
   * @param {Object} context - Decision context
   */
  decision(agentId, decision, context = {}) {
    this.info('Agent decision', {
      agentId,
      decision,
      ...context
    });
  }
}

/**
 * Creates a logger instance for a specific component
 * @param {string} component - Component name
 * @param {string} [level] - Log level
 * @returns {Logger} Logger instance
 */
function createLogger(component, level) {
  return new Logger(component, level);
}

module.exports = {
  Logger,
  createLogger
};