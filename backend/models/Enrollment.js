const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true, optimisticConcurrency: true });

schema.index({ student: 1, course: 1 }, { unique: true });
module.exports = mongoose.model('Enrollment', schema);
