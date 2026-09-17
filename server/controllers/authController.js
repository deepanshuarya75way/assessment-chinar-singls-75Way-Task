const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TeacherProfile = require('../models/TeacherProfile');
const emailService = require('../services/emailService');
const { generateTemporaryPassword, isValidPassword, PASSWORD_POLICY_MESSAGE } = require('../services/passwordUtils');
const { generateToken, generateRefreshToken, cookieOptions } = require('../middleware/auth');

// Helper to hash OTP
const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp).trim()).digest('hex');

// Helper to send token response
const sendToken = async (user, statusCode, res) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  let userName = user.name;
  if (!userName && user.role === 'teacher') {
    const profile = await TeacherProfile.findOne({ user: user._id });
    if (profile?.name) userName = profile.name;
  }
  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    refreshToken,
    user: { id: user._id, name: userName, email: user.email, role: user.role, mobile: user.mobile, mustChangePassword: !!user.mustChangePassword },
  });
};

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      if (!exists.isVerified) {
        return res.status(400).json({ success: false, code: 'EMAIL_NOT_VERIFIED', message: 'This email is already registered but hasn\'t been verified.' });
      }
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Generate 6-digit OTP and store hashed
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = hashOtp(otp);
    const otpExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await User.create({
      name,
      email,
      password,
      mobile,
      role: role || 'student',
      otp: hashedOtp,
      otpExpires,
      isVerified: false
    });

    // Send OTP email (non-blocking)
    emailService.sendOtpEmail(email, name, otp).catch(() => {});

    res.status(201).json({ success: true, message: 'Registration successful. Please check your email for the OTP.' });
  } catch (err) { next(err); }
};

// @POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required.' });

    // Explicitly select OTP fields since select: false
    const user = await User.findOne({ email }).select('+otp +otpExpires +otpAttempts');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified.' });

    if (user.otpAttempts >= 5) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, message: 'Too many incorrect attempts. Please request a new verification code.' });
    }

    if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Your verification code has expired.' });
    }

    const hashedCandidate = hashOtp(otp);
    // Support comparing hashed OTP or legacy unhashed OTP
    if (user.otp !== hashedCandidate && user.otp !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, message: 'That code doesn\'t look right. Please try again.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    emailService.sendWelcomeEmail(email, user.name, user.role).catch(() => {});

    res.json({ success: true, code: 'EMAIL_VERIFIED', message: 'Email verified successfully!' });
  } catch (err) { next(err); }
};

// @POST /api/auth/resend-otp
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    // Explicitly select otp fields since select: false
    const user = await User.findOne({ email }).select('+otp +otpExpires +otpAttempts +otpLastResent');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified.' });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Your 75 Way Project Task account has been deactivated.' });

    // Enforce 60s cooldown
    if (user.otpLastResent && Date.now() - user.otpLastResent.getTime() < 60000) {
      return res.status(429).json({ success: false, message: 'Please wait before requesting a new code.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = hashOtp(otp);
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    user.otpAttempts = 0;
    user.otpLastResent = new Date();
    await user.save({ validateBeforeSave: false });

    await emailService.sendOtpEmail(email, user.name, otp);

    res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) { 
    if (err.message && err.message.includes('email')) {
      return res.status(500).json({ success: false, message: 'Unable to send the verification email right now. Please try again.' });
    }
    next(err); 
  }
};

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' });

    if (!user.isActive) {
      return res.status(403).json({ success: false, code: 'ACCOUNT_DEACTIVATED', message: 'Your 75 Way Project Task account has been deactivated. Please contact support if you believe this was a mistake.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, code: 'EMAIL_NOT_VERIFIED', email: user.email, message: 'Please verify your email before continuing.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

// @POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1 }).json({ success: true, message: 'Logged out.' });
};

// @GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    if (user.role === 'teacher') {
      profile = await TeacherProfile.findOne({ user: user._id });
    }
    const userObj = user.toJSON();
    if (!userObj.name && profile?.name) {
      userObj.name = profile.name;
    }
    res.json({ success: true, user: userObj, profile });
  } catch (err) { next(err); }
};

// @POST /api/auth/forgot-password
// Generates a secure random temporary password, stores only its hash, and
// emails the plaintext password to the user. The plaintext password is never
// returned by the API, never logged, and never stored in the database.
// The response is intentionally identical for existing/unknown emails to
// prevent account enumeration.
const RESET_COOLDOWN_MS = 60 * 1000;         // per-email cooldown (matches OTP resend policy)
const GENERIC_RESET_MESSAGE = 'If an account exists for this email address, a password reset email has been sent.';
const recentResetRequests = new Map();       // email -> last request timestamp (abuse throttle)

exports.forgotPassword = async (req, res, next) => {
  try {
    // ── Input validation (never trust the frontend) ──
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    // ── Cooldown throttle (applies before the existence check so response
    //    behaviour does not reveal whether an account is registered) ──
    const now = Date.now();
    const lastRequest = recentResetRequests.get(email);
    if (lastRequest && now - lastRequest < RESET_COOLDOWN_MS) {
      return res.status(429).json({ success: false, message: 'Please wait a minute before requesting another password reset email.' });
    }
    recentResetRequests.set(email, now);
    if (recentResetRequests.size > 1000) {
      for (const [key, ts] of recentResetRequests) {
        if (now - ts > 10 * 60 * 1000) recentResetRequests.delete(key);
      }
    }

    // +password is required: the hash is select:false in the schema, and the
    // old hash is needed to roll back if the email fails.
    const user = await User.findOne({ email }).select('+password');

    // Unknown OR deactivated account: return the exact same generic response
    // (no email is sent — a deactivated account must not be able to regain
    // access through this flow, matching the login policy). A dummy bcrypt
    // hash equalises response time so registration status cannot be probed.
    if (!user || !user.isActive) {
      await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12);
      return res.json({ success: true, message: GENERIC_RESET_MESSAGE });
    }

    // ── Generate + store the temporary password (hashed by the pre-save hook) ──
    const tempPassword = generateTemporaryPassword();
    const previousPasswordHash = user.password; // hash only — used for rollback
    const previousMustChange = user.mustChangePassword;
    user.password = tempPassword;
    user.mustChangePassword = true;
    user.refreshToken = undefined; // revoke any outstanding refresh session
    await user.save();

    // ── Email the plaintext password through the existing email service ──
    const emailSent = await emailService.sendTemporaryPassword(user.email, user.name, tempPassword);

    if (!emailSent) {
      // Roll back so the user is never left with an unknown password.
      // Uses updateOne to bypass the pre-save hook (re-saving would
      // double-hash and corrupt the restored hash).
      await User.updateOne(
        { _id: user._id },
        { $set: { password: previousPasswordHash, mustChangePassword: !!previousMustChange } }
      );
      // Safe, non-technical message — SMTP details are never exposed.
      return res.status(502).json({ success: false, message: 'Unable to send the password reset email right now. Please try again later.' });
    }

    // Newest temporary password is now the only valid credential — any
    // previously issued temporary password was overwritten above.
    res.json({ success: true, message: GENERIC_RESET_MESSAGE });
  } catch (err) { next(err); }
};

// @PATCH /api/auth/update-password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
    }
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ success: false, message: PASSWORD_POLICY_MESSAGE });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      // 400 (not 401) — the token is valid; a wrong current password is a
      // validation failure and must not trigger the client's auto-logout.
      return res.status(400).json({ success: false, code: 'INVALID_CURRENT_PASSWORD', message: 'Invalid current password.' });
    }

    user.password = newPassword;              // hashed by the pre-save hook
    user.mustChangePassword = false;          // temporary password replaced
    user.refreshToken = undefined;            // revoke outstanding refresh session
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) { next(err); }
};

// @PATCH /api/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, mobile } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'Profile updated successfully.', user: { id: user._id, name: user.name, email: user.email, role: user.role, mobile: user.mobile } });
  } catch (err) { next(err); }
};
