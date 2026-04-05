'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_PATH = path.join(__dirname, '..', 'authorized.json');

/**
 * Load and parse the authorized users file.
 * @param {string} [filePath] - Path to the authorized.json file.
 * @returns {object} Parsed authorization data.
 * @throws {Error} If the file cannot be read or parsed.
 */
function loadAuthorizedUsers(filePath = DEFAULT_PATH) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  validate(data);
  return data;
}

/**
 * Validate the structure of the authorization data.
 * @param {object} data - The parsed JSON object.
 * @throws {Error} If the data does not match the expected schema.
 */
function validate(data) {
  if (typeof data.version !== 'number') {
    throw new Error('authorized.json: "version" must be a number');
  }
  if (!Array.isArray(data.users)) {
    throw new Error('authorized.json: "users" must be an array');
  }
  for (const user of data.users) {
    if (typeof user.email !== 'string' || user.email.length === 0) {
      throw new Error('authorized.json: each user must have a non-empty "email" string');
    }
    if (typeof user.active !== 'boolean') {
      throw new Error(`authorized.json: user "${user.email}" must have a boolean "active" field`);
    }
    if (user.until !== undefined) {
      if (typeof user.until !== 'string' || isNaN(Date.parse(user.until))) {
        throw new Error(`authorized.json: user "${user.email}" has an invalid "until" date`);
      }
    }
  }
}

/**
 * Check whether a user is currently authorized.
 * A user is authorized when:
 *   1. They exist in the users list.
 *   2. Their "active" flag is true.
 *   3. If an "until" date is set, it has not yet passed.
 *
 * @param {string} email - The email to check.
 * @param {object} data - Parsed authorization data (from loadAuthorizedUsers).
 * @param {Date}   [now=new Date()] - Reference date for expiration checks.
 * @returns {boolean} True if the user is authorized.
 */
function isAuthorized(email, data, now = new Date()) {
  const user = data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) return false;
  if (!user.active) return false;
  if (user.until && new Date(user.until) < now) return false;
  return true;
}

/**
 * Return the list of currently active (non-expired) users.
 * @param {object} data - Parsed authorization data.
 * @param {Date}   [now=new Date()] - Reference date for expiration checks.
 * @returns {object[]} Array of active user objects.
 */
function getActiveUsers(data, now = new Date()) {
  return data.users.filter((u) => {
    if (!u.active) return false;
    if (u.until && new Date(u.until) < now) return false;
    return true;
  });
}

module.exports = { loadAuthorizedUsers, validate, isAuthorized, getActiveUsers };
