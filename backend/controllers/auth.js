const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fail } = require('../middleware/http');
const { field, emailAddress, passwordInput } = require('./validation');

function session(user) {
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '8h' });
  return { token, user };
}

async function register(req, res) {
  const { name, email, password, role } = req.body || {};
  if (!['student', 'instructor'].includes(role)) fail(400, 'Choose student or instructor.');
  const user = await User.create({
    name: field(name, 'Name', 100),
    email: emailAddress(email),
    password: await bcrypt.hash(passwordInput(password), 12),
    role,
  });
  res.status(201).json(session(user));
}

async function login(req, res) {
  const { email, password } = req.body || {};
  const address = emailAddress(email);
  const candidate = passwordInput(password, 1);
  const user = await User.findOne({ email: address }).select('+password');
  if (!user || !await bcrypt.compare(candidate, user.password)) fail(401, 'Incorrect email or password.');
  res.json(session(user));
}

function me(req, res) {
  res.json(req.user);
}

module.exports = { register, login, me };
