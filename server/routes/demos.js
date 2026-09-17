const router = require('express').Router();
const { scheduleDemo, getAllDemos, getMyDemos, completeDemo, cancelDemo } = require('../controllers/demoController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), scheduleDemo);
router.get('/', protect, authorize('admin'), getAllDemos);
router.get('/my', protect, authorize('teacher', 'student'), getMyDemos);
router.patch('/:id/complete', protect, authorize('admin', 'teacher'), completeDemo);
router.patch('/:id/cancel', protect, authorize('admin'), cancelDemo);

module.exports = router;
