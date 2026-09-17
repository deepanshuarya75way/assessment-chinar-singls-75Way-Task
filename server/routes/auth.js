const router = require('express').Router();
const { register, login, logout, getMe, forgotPassword, verifyOtp, resendOtp, updatePassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);

router.patch('/update-password', protect, updatePassword);
router.patch('/update-profile', protect, updateProfile);

module.exports = router;
