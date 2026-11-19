const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
}, { timestamps: true, optimisticConcurrency: true });

// Serialize dependent writes with account deletion and role changes.
schema.statics.lockRole = function (user, roles, session) {
  return this.updateOne({ _id: user, role: { $in: roles } }, { $inc: { __v: 1 } }, { session, timestamps: false });
};

schema.set('toJSON', { transform: (_doc, result) => { delete result.password; } });
module.exports = mongoose.model('User', schema);
