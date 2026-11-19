const router = require('express').Router();
const auth = require('../controllers/auth');
const courses = require('../controllers/courses');
const enrollments = require('../controllers/enrollments');
const admin = require('../controllers/admin');
const { authenticate, allow, validateId } = require('../middleware/http');

const managers = allow('admin', 'instructor');
const students = allow('student');
router.param('id', validateId);
router.param('lessonId', validateId);

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', authenticate, auth.me);

router.route('/courses')
  .get(courses.list)
  .post(authenticate, managers, courses.create);
router.get('/managed-courses', authenticate, managers, courses.mine);
router.route('/courses/:id')
  .get(courses.details)
  .put(authenticate, managers, courses.update)
  .delete(authenticate, managers, courses.remove);
router.post('/courses/:id/lessons', authenticate, managers, courses.addLesson);
router.route('/courses/:id/lessons/:lessonId')
  .put(authenticate, managers, courses.changeLesson)
  .delete(authenticate, managers, courses.changeLesson);

router.post('/enroll', authenticate, students, enrollments.enroll);
router.get('/enroll/:id', authenticate, students, enrollments.status);
router.get('/my-courses', authenticate, students, enrollments.mine);
router.put('/my-courses/:id/lessons/:lessonId', authenticate, students, enrollments.completeLesson);

router.use('/admin', authenticate, allow('admin'));
router.get('/admin/users', admin.users);
router.route('/admin/users/:id').put(admin.update).delete(admin.remove);
router.get('/admin/analytics', admin.analytics);

module.exports = router;
