const router = require('express').Router();
const { getDashboardStats, getAllUsers, toggleUser, getApplicationDocument } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/toggle', protect, authorize('admin'), toggleUser);
router.get('/applications/:id/documents/:documentType', protect, authorize('admin'), getApplicationDocument);

module.exports = router;
