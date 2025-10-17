/**
 * Security and Event Logger
 * Provides structured logging for authentication and errors
 */

/**
 * Log authentication events
 * @param {string} event - Event type (login, register, etc.)
 * @param {string} username - Username involved
 * @param {boolean} success - Whether event was successful
 * @param {string} ip - IP address
 */
function logAuthEvent(event, username, success, ip = 'unknown') {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'FAILURE';
  console.log(`[${timestamp}] AUTH ${status} - ${event} - User: ${username} - IP: ${ip}`);
}

/**
 * Log error events
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 */
function logError(context, error) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR - ${context}:`, error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
}

/**
 * Log info events
 * @param {string} message - Info message
 */
function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] INFO - ${message}`);
}

module.exports = {
  logAuthEvent,
  logError,
  logInfo
};

