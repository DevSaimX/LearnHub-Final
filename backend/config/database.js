const path = require('node:path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

async function connect() {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in backend/.env.');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
}

module.exports = connect;
