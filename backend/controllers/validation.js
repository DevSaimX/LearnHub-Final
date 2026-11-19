const { fail } = require('../middleware/http');

function field(value, name, max) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    fail(400, name + ' must contain 1 to ' + max + ' characters.');
  }
  return value.trim();
}

function emailAddress(value) {
  const email = field(value, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Enter a valid email address.');
  return email;
}

function passwordInput(value, minimum = 8) {
  if (typeof value !== 'string' || value.length < minimum || Buffer.byteLength(value) > 72) {
    fail(400, 'Password must contain at least ' + minimum + ' characters and at most 72 bytes.');
  }
  return value;
}

module.exports = { field, emailAddress, passwordInput };
