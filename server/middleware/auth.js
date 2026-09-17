const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect: verify JWT, attach user ─────────────────────────
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Your 75 Way Project Task account has been deactivated. Please contact support if you believe this was a mistake.' });
    if (!user.isVerified) return res.status(403).json({ success: false, code: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email to access this resource.' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.', expired: true });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// ── Authorize: role-based access ─────────────────────────────
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Requires role: ${roles.join(' or ')}.`
    });
  }
  next();
};

// ── Generate tokens ───────────────────────────────────────────
exports.generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

// ── Cookie options ────────────────────────────────────────────
exports.cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
