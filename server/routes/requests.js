const router = require('express').Router();
const {
  createRequest, getAllRequests, getRequest,
  updateStatus, assignTeacher, getStats, getMyAssignments, getMyRequests
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.post('/', createRequest);
router.get('/public-stats', require('../controllers/requestController').getPublicStats);

// Student
router.get('/my', protect, authorize('student'), getMyRequests);

// Admin / Teacher
router.get('/', protect, authorize('admin'), getAllRequests);
router.get('/my-assignments', protect, authorize('teacher'), getMyAssignments);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/:id', protect, authorize('admin', 'teacher', 'student'), getRequest);
router.patch('/:id/status', protect, authorize('admin'), updateStatus);
router.patch('/:id/assign', protect, authorize('admin'), assignTeacher);

module.exports = router;
