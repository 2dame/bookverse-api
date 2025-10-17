/**
 * Input Validation Utilities
 * Provides validation functions for user input sanitization
 */

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
function isValidUsername(username) {
  if (!username || typeof username !== 'string') return false;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid
 */
function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
}

/**
 * Validate ISBN format (basic validation)
 * @param {string} isbn - ISBN to validate
 * @returns {boolean} - True if valid
 */
function isValidISBN(isbn) {
  if (!isbn || typeof isbn !== 'string') return false;
  const isbnRegex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
  return isbnRegex.test(isbn.replace(/[- ]/g, ''));
}

/**
 * Validate review rating
 * @param {number} rating - Rating to validate (1-5)
 * @returns {boolean} - True if valid
 */
function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Sanitize text input (remove dangerous characters)
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[<>]/g, '');
}

module.exports = {
  isValidUsername,
  isValidPassword,
  isValidISBN,
  isValidRating,
  sanitizeText
};

