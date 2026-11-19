const connect = require('./config/database');
const app = require('./app');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

async function start() {
  if (!process.env.JWT_SECRET?.trim()) throw new Error('Set JWT_SECRET in backend/.env.');
  await connect();
  await Promise.all([User.init(), Course.init(), Enrollment.init()]);
  console.log('MongoDB Connected Successfully');
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => console.log('Server running on port ' + port));
  server.on('error', error => {
    console.error('LearnHub could not listen:', error.code);
    process.exit(1);
  });
}

start().catch(error => {
  console.error('LearnHub startup failed:', error.name, error.code || '');
  process.exit(1);
});
