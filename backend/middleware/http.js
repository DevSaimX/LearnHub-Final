const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

function fail(status, message) {
  throw Object.assign(new Error(message), { status });
}

function validateId(_req, _res, next, id) {
  if (!mongoose.isObjectIdOrHexString(id)) fail(400, 'Invalid ID.');
  next();
}

async function authenticate(req, _res, next) {
  const token = req.get('Authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) fail(401, 'Sign in to continue.');
  let claims;
  try {
    claims = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    fail(401, 'Your session is invalid or expired.');
  }
  if (!mongoose.isObjectIdOrHexString(claims.sub)) fail(401, 'Invalid session.');
  req.user = await User.findById(claims.sub);
  if (!req.user) fail(401, 'Account is no longer available.');
  next();
}

function allow(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) fail(403, 'This action is unavailable for your role.');
    next();
  };
}

function errorHandler(error, _req, res, _next) {
  let status = error.status || 500;
  let message = status < 500 ? error.message : 'An unexpected server error occurred.';
  if (error.type === 'entity.parse.failed') message = 'Invalid JSON body.';
  if (error.name === 'ValidationError') { status = 400; message = error.message; }
  if (error.code === 11000) {
    status = 409;
    message = error.keyPattern?.email ? 'Email is already registered.' : 'You are already enrolled in this course.';
  }
  if (['VersionError', 'DocumentNotFoundError'].includes(error.name) || error.code === 112) {
    status = 409;
    message = 'This record changed. Refresh and try again.';
  }
  if (status >= 500) console.error('API error:', error.name, error.code || '');
  res.status(status).json({ message });
}

module.exports = { fail, validateId, authenticate, allow, errorHandler };
