const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { fail } = require('../middleware/http');
const { field, emailAddress } = require('./validation');

async function users(_req, res) {
  res.json(await User.find().sort({ createdAt: -1 }));
}

async function findUser(id, session) {
  const user = await User.findById(id).session(session);
  if (!user) fail(404, 'User not found.');
  return user;
}

async function update(req, res) {
  const user = await mongoose.connection.transaction(async session => {
    const account = await findUser(req.params.id, session);
    const { name, email, role = account.role } = req.body || {};
    if (role !== account.role) {
      if (account.role === 'admin' || !['student', 'instructor'].includes(role)) {
        fail(400, 'Admin roles are managed locally.');
      }
      if (await Course.exists({ instructor: account._id }).session(session)) {
        fail(409, 'Remove courses owned by this user before changing their role.');
      }
      if (await Enrollment.exists({ student: account._id }).session(session)) {
        fail(409, 'This user has enrollments and cannot change roles.');
      }
    }
    account.set({ name: field(name, 'Name', 100), email: emailAddress(email), role });
    return account.save({ session });
  });
  res.json(user);
}

async function remove(req, res) {
  if (req.user._id.equals(req.params.id)) fail(400, 'You cannot delete your own admin account.');
  await mongoose.connection.transaction(async session => {
    const actor = await User.lockRole(req.user._id, ['admin'], session);
    if (!actor.matchedCount) fail(403, 'An active admin account is required.');
    const user = await findUser(req.params.id, session);
    if (await Course.exists({ instructor: user._id }).session(session)) {
      fail(409, 'Remove courses owned by this user before deleting their account.');
    }
    await User.deleteOne({ _id: user._id }, { session });
    await Enrollment.deleteMany({ student: user._id }, { session });
  });
  res.json({ message: 'User deleted.' });
}

async function analytics(_req, res) {
  const [users, courses, enrollments, breakdown] = await Promise.all([
    User.countDocuments(), Course.countDocuments(), Enrollment.countDocuments(),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);
  res.json({
    users, courses, enrollments,
    roles: { student: 0, instructor: 0, admin: 0, ...Object.fromEntries(breakdown.map(row => [row._id, row.count])) },
  });
}

module.exports = { users, update, remove, analytics };
