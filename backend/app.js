const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const api = require('./routes/api');
const { errorHandler } = require('./middleware/http');

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map(origin => origin.trim()) || [
  'http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173', 'http://127.0.0.1:4173',
] }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    message: connected ? 'LearnHub API is running' : 'Database unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});
app.use('/api', api);
app.use((_req, res) => res.status(404).json({ message: 'Endpoint not found.' }));
app.use(errorHandler);

module.exports = app;
