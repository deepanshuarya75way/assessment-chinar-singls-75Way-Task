const router = require('express').Router();
const {
  applyAsTeacher, getAllTeachers, getTeacher,
  approveTeacher, rejectTeacher, getMyProfile, updateMyProfile, getStats,
  getTeacherApplications, getTeacherApplicationById, fetchTeachers
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.post('/apply', upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]), applyAsTeacher);
router.get('/', getAllTeachers);
router.get('/fetch', fetchTeachers);

// Teacher
router.get('/me/profile', protect, authorize('teacher'), getMyProfile);
router.patch('/me/profile', protect, authorize('teacher'), updateMyProfile);

// Admin
router.get('/applications', protect, authorize('admin'), getTeacherApplications);
router.get('/applications/:id', protect, authorize('admin'), getTeacherApplicationById);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/:id', protect, authorize('admin'), getTeacher);
router.patch('/:id/approve', protect, authorize('admin'), approveTeacher);
router.patch('/:id/reject', protect, authorize('admin'), rejectTeacher);

module.exports = router;
