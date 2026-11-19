const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const mongoose = require('mongoose');
const { fail } = require('../middleware/http');

function progressFor(course, completed) {
  const lessonIds = new Set(course.lessons.map(lesson => lesson.id));
  const matched = completed.filter(id => lessonIds.has(String(id)));
  return {
    completedLessons: matched,
    progress: lessonIds.size ? Math.round(matched.length * 100 / lessonIds.size) : 0,
  };
}

async function enroll(req, res) {
  const { courseId } = req.body || {};
  if (!mongoose.isObjectIdOrHexString(courseId)) fail(400, 'Invalid course ID.');
  const enrollment = await mongoose.connection.transaction(async session => {
    const student = await User.lockRole(req.user._id, ['student'], session);
    if (!student.matchedCount) fail(403, 'Only students can enroll.');
    // Touch the course version so a concurrent deletion cannot miss this enrollment.
    const course = await Course.updateOne({ _id: courseId }, { $inc: { __v: 1 } }, { session, timestamps: false });
    if (!course.matchedCount) fail(404, 'Course not found.');
    const [record] = await Enrollment.create([{ student: req.user._id, course: courseId }], { session });
    return record;
  });
  res.status(201).json(enrollment);
}

async function status(req, res) {
  const enrolled = await Enrollment.exists({ student: req.user._id, course: req.params.id });
  res.json({ enrolled: Boolean(enrolled) });
}

async function mine(req, res) {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate({
    path: 'course', populate: { path: 'instructor', select: 'name' },
  }).sort({ createdAt: -1 });
  res.json(enrollments.filter(record => record.course).map(record => ({
    ...record.toObject(),
    ...progressFor(record.course, record.completedLessons),
  })));
}

async function completeLesson(req, res) {
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.id }).populate('course');
  if (!enrollment?.course) fail(404, 'Enrollment not found.');
  const lesson = enrollment.course.lessons.id(req.params.lessonId);
  if (!lesson) fail(404, 'Lesson not found.');
  const completed = new Set(enrollment.completedLessons.map(String));
  if (req.body?.completed === false) completed.delete(lesson.id);
  else if (req.body?.completed === true) completed.add(lesson.id);
  else fail(400, 'Completed must be true or false.');
  enrollment.set(progressFor(enrollment.course, [...completed]));
  await enrollment.save();
  res.json({ _id: enrollment.id, ...progressFor(enrollment.course, enrollment.completedLessons) });
}

module.exports = { enroll, status, mine, completeLesson };
