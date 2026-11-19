const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { fail } = require('../middleware/http');
const { field } = require('./validation');

async function findCourse(id) {
  const course = await Course.findById(id);
  if (!course) fail(404, 'Course not found.');
  return course;
}

async function managedCourse(req) {
  const course = await findCourse(req.params.id);
  if (req.user.role !== 'admin' && !course.instructor.equals(req.user._id)) {
    fail(403, 'You can manage only your own courses.');
  }
  return course;
}

async function list(req, res) {
  const filter = {};
  if (req.query.category !== undefined) filter.category = field(req.query.category, 'Category', 60);
  if (req.query.q !== undefined) {
    const search = field(req.query.q, 'Search', 120).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = ['title', 'description', 'category'].map(key => ({ [key]: { $regex: search, $options: 'i' } }));
  }
  res.json(await Course.find(filter).select('-lessons').populate('instructor', 'name').sort({ createdAt: -1 }));
}

async function details(req, res) {
  const course = await findCourse(req.params.id);
  await course.populate('instructor', 'name');
  const record = course.toObject();
  record.lessons = record.lessons.map(({ _id, title }) => ({ _id, title }));
  res.json(record);
}

async function mine(req, res) {
  const filter = req.user.role === 'admin' ? {} : { instructor: req.user._id };
  res.json(await Course.find(filter).populate('instructor', 'name').sort({ createdAt: -1 }));
}

function courseInput(body = {}) {
  const { title, description, category, price } = body || {};
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0 || price > 100000) {
    fail(400, 'Price must be a number between 0 and 100000.');
  }
  return {
    title: field(title, 'Title', 120),
    description: field(description, 'Description', 5000),
    category: field(category, 'Category', 60),
    price,
  };
}

async function create(req, res) {
  const input = courseInput(req.body);
  const course = await mongoose.connection.transaction(async session => {
    const owner = await User.lockRole(req.user._id, ['admin', 'instructor'], session);
    if (!owner.matchedCount) fail(403, 'Your account cannot create courses.');
    const [record] = await Course.create([{ ...input, instructor: req.user._id }], { session });
    return record;
  });
  res.status(201).json(course);
}

async function update(req, res) {
  const course = await managedCourse(req);
  course.set(courseInput(req.body));
  res.json(await course.save());
}

async function remove(req, res) {
  const course = await managedCourse(req);
  await mongoose.connection.transaction(async session => {
    await Course.deleteOne({ _id: course._id }, { session });
    await Enrollment.deleteMany({ course: course._id }, { session });
  });
  res.json({ message: 'Course deleted.' });
}

function lessonInput(body) {
  return { title: field(body?.title, 'Lesson title', 120), content: field(body?.content, 'Lesson content', 20000) };
}

async function addLesson(req, res) {
  const course = await managedCourse(req);
  course.lessons.push(lessonInput(req.body));
  await course.save();
  res.status(201).json(course.lessons.at(-1));
}

async function changeLesson(req, res) {
  const course = await managedCourse(req);
  const lesson = course.lessons.id(req.params.lessonId);
  if (!lesson) fail(404, 'Lesson not found.');
  if (req.method === 'DELETE') {
    lesson.deleteOne();
    await course.save();
    return res.json({ message: 'Lesson deleted.' });
  }
  lesson.set(lessonInput(req.body));
  await course.save();
  res.json(lesson);
}

module.exports = { list, details, mine, create, update, remove, addLesson, changeLesson };
