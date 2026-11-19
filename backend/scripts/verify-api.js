const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const path = require('node:path');
const mongoose = require('mongoose');
require('../config/database');
const app = require('../app');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const runFile = promisify(execFile);
const database = 'learnhub_verify_' + randomBytes(8).toString('hex');
const password = randomBytes(18).toString('hex');
const courseInput = { title: 'React Foundations', description: 'Build interactive pages.', category: 'Development', price: 0 };
let server;
let base;

async function request(method, route, expected, body, token) {
  const response = await fetch(base + route, {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: 'Bearer ' + token }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  assert.equal(response.status, expected, method + ' ' + route + ': ' + (data.message || 'unexpected status'));
  assert.doesNotMatch(JSON.stringify(data), /"password"\s*:/);
  return data;
}

async function registerAndLogin(role, email) {
  const input = { name: role + ' test', email, password, role };
  const registered = await request('POST', '/register', 201, input);
  assert.equal(registered.user.role, role);
  const login = await request('POST', '/login', 200, { email, password });
  assert.equal(login.user._id, registered.user._id);
  const current = await request('GET', '/me', 200, undefined, login.token);
  assert.equal(current.role, role);
  console.log('PASS ' + role + ' registration, login, and current session');
  return login;
}

async function verify() {
  const uri = new URL(process.env.MONGO_URI);
  uri.pathname = '/' + database;
  await mongoose.connect(uri.toString(), { dbName: database, serverSelectionTimeoutMS: 10000 });
  await Promise.all([User.init(), Course.init(), Enrollment.init()]);
  server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
    listener.once('error', reject);
  });
  base = 'http://127.0.0.1:' + server.address().port + '/api';
  const health = await request('GET', '/health', 200);
  assert.equal(health.database, 'connected');
  console.log('PASS database connection and API health');

  const student = await registerAndLogin('student', 'student@example.test');
  const instructor = await registerAndLogin('instructor', 'instructor@example.test');
  const other = await registerAndLogin('instructor', 'other@example.test');
  const course = await request('POST', '/courses', 201, courseInput, instructor.token);
  const coursePath = '/courses/' + course._id;
  const listing = await request('GET', '/courses?q=react&category=Development', 200);
  assert.ok(listing.some(item => item._id === course._id && item.instructor._id === instructor.user._id));
  const changed = await request('PUT', coursePath, 200, { ...courseInput, title: 'React Workshop' }, instructor.token);
  assert.equal(changed.title, 'React Workshop');
  await request('POST', '/courses', 403, courseInput, student.token);
  await request('PUT', coursePath, 403, courseInput, student.token);
  await request('DELETE', coursePath, 403, undefined, student.token);
  await request('PUT', coursePath, 403, courseInput, other.token);
  await request('DELETE', coursePath, 403, undefined, other.token);
  await request('POST', coursePath + '/lessons', 403, { title: 'Forbidden', content: 'Forbidden' }, other.token);
  console.log('PASS course creation, public listing, owner edit, and role/ownership enforcement');

  const lesson = await request('POST', coursePath + '/lessons', 201, { title: 'Components', content: 'Compose an interface.' }, instructor.token);
  const lessonPath = coursePath + '/lessons/' + lesson._id;
  const updatedLesson = await request('PUT', lessonPath, 200, { title: 'JSX', content: 'Write markup inside components.' }, instructor.token);
  assert.equal(updatedLesson.title, 'JSX');
  const details = await request('GET', coursePath, 200);
  assert.equal(details.lessons[0].title, 'JSX');
  assert.equal(details.lessons[0].content, undefined);
  await request('POST', '/enroll', 403, { courseId: course._id }, instructor.token);
  // Parallel requests exercise the unique index and transaction retry.
  const attempts = await Promise.all([1, 2].map(() => fetch(base + '/enroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + student.token },
    body: JSON.stringify({ courseId: course._id }),
  })));
  assert.deepEqual(attempts.map(result => result.status).sort(), [201, 409]);
  await Promise.all(attempts.map(result => result.json()));
  const status = await request('GET', '/enroll/' + course._id, 200, undefined, student.token);
  assert.equal(status.enrolled, true);
  const enrolled = await request('GET', '/my-courses', 200, undefined, student.token);
  assert.equal(enrolled[0].course._id, course._id);
  assert.equal(enrolled[0].course.lessons[0].content, updatedLesson.content);
  const progress = await request('PUT', '/my-courses/' + course._id + '/lessons/' + lesson._id, 200, { completed: true }, student.token);
  assert.equal(progress.progress, 100);
  await request('DELETE', lessonPath, 200, undefined, instructor.token);
  const revised = await request('GET', '/my-courses', 200, undefined, student.token);
  assert.equal(revised[0].progress, 0);
  await request('DELETE', coursePath, 200, undefined, instructor.token);
  await request('GET', coursePath, 404);
  assert.equal(await Enrollment.countDocuments({ course: course._id }), 0);
  console.log('PASS lesson management, enrollment, duplicate rejection, progress, and owner deletion');

  await request('POST', '/register', 400, { name: 'Invalid', email: 'admin@example.test', password, role: 'admin' });
  await request('POST', '/register', 409, { name: 'Duplicate', email: 'STUDENT@example.test', password, role: 'student' });
  await request('GET', '/courses/bad-id', 400);
  await request('POST', '/courses', 400, { ...courseInput, price: -1 }, instructor.token);
  await request('GET', '/me', 401, undefined, 'bad-token');
  await request('GET', '/admin/users', 403, undefined, instructor.token);
  console.log('PASS invalid input, duplicate email, and unauthorized requests');

  await runFile(process.execPath, [path.join(__dirname, 'create-admin.js'), 'Test Admin', 'admin@example.test'], {
    env: { ...process.env, MONGO_URI: uri.toString(), ADMIN_PASSWORD: password },
  });
  const admin = await request('POST', '/login', 200, { email: 'admin@example.test', password });
  const accounts = await request('GET', '/admin/users', 200, undefined, admin.token);
  assert.equal(accounts.length, 4);
  const person = await request('PUT', '/admin/users/' + other.user._id, 200, {
    name: 'Edited user', email: other.user.email, role: 'student',
  }, admin.token);
  assert.equal(person.name, 'Edited user');
  assert.equal(person.role, 'student');
  await request('POST', '/courses', 403, courseInput, other.token);
  await request('DELETE', '/admin/users/' + other.user._id, 200, undefined, admin.token);
  await request('GET', '/me', 401, undefined, other.token);
  const second = await request('POST', '/courses', 201, courseInput, instructor.token);
  await request('PUT', '/courses/' + second._id, 200, { ...courseInput, title: 'Admin edit' }, admin.token);
  await request('DELETE', '/courses/' + second._id, 200, undefined, admin.token);
  const analytics = await request('GET', '/admin/analytics', 200, undefined, admin.token);
  assert.deepEqual(analytics, { users: 3, courses: 0, enrollments: 0, roles: { student: 1, instructor: 1, admin: 1 } });
  console.log('PASS local admin provisioning, user management, course management, and analytics');
}

verify().catch(error => {
  console.error('Verification failed:', error.name, error.code || '', error instanceof assert.AssertionError ? error.message : '');
  process.exitCode = 1;
}).finally(async () => {
  try {
    if (server) await new Promise(resolve => server.close(resolve));
    if (mongoose.connection.readyState === 1 && mongoose.connection.name === database) {
      await mongoose.connection.dropDatabase();
      console.log('Temporary verification database removed.');
    }
  } catch (error) {
    console.error('Temporary database cleanup failed for ' + database + ':', error.name, error.code || '');
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
});
