const crypto = require('crypto');

/* ── Password utilities (shared by auth flows) ─────────────────
   - Temporary passwords: cryptographically secure (crypto.randomInt),
     14 chars, mixed case + digits + specials, ambiguous characters
     (O/0, I/l/1) excluded so the password can be typed from an email.
   - Policy: matches the signup form rules (6+ chars, upper, lower, digit). */

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';   // no I, O
const LOWER = 'abcdefghjkmnpqrstuvwxyz';    // no i, l, o
const DIGITS = '23456789';                  // no 0, 1
const SPECIAL = '!@#$%&*?';
const ALL = UPPER + LOWER + DIGITS + SPECIAL;
const TEMP_PASSWORD_LENGTH = 14;

const pick = (charset) => {
  return charset[crypto.randomInt(charset.length)];
};

const generateTemporaryPassword = () => {
  const chars = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SPECIAL)];
  while (chars.length < TEMP_PASSWORD_LENGTH) chars.push(pick(ALL));
  // Fisher–Yates shuffle so the guaranteed characters are not predictable
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
};

const isValidPassword = (password) =>
  typeof password === 'string' &&
  password.length >= 6 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password);

const PASSWORD_POLICY_MESSAGE = 'Password must be at least 6 characters and contain uppercase, lowercase, and a number.';

module.exports = { generateTemporaryPassword, isValidPassword, PASSWORD_POLICY_MESSAGE };