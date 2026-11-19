const mongoose = require('mongoose');

const lesson = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
});

const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, trim: true, maxlength: 60, index: true },
  price: { type: Number, required: true, min: 0, max: 100000 },
  lessons: [lesson],
}, { timestamps: true, optimisticConcurrency: true });

module.exports = mongoose.model('Course', schema);
