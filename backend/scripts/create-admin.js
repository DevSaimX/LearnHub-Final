const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connect = require('../config/database');
const User = require('../models/User');
const { field, emailAddress, passwordInput } = require('../controllers/validation');

async function main() {
  const name = field(process.argv[2], 'Name', 100);
  const email = emailAddress(process.argv[3]);
  const password = passwordInput(process.env.ADMIN_PASSWORD, 12);
  delete process.env.ADMIN_PASSWORD;
  await connect();
  await User.init();
  await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'admin' });
  console.log('Admin account created.');
}

main().catch(error => {
  console.error(error.code === 11000 ? 'Email is already registered.' :
    error.status === 400 ? error.message : 'Admin creation failed. Check your database connection.');
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
