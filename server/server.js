require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const emailService = require('./services/emailService');

const path = require('path');
const fs = require('fs');

const app = express();

// ── Security Middleware ───────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true, legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// ── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Protected static files route for uploads (admin & teacher) ──
const serveUploadFile = async (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, 'uploads', safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  // Enforce teacher document ownership validation
  if (req.user && req.user.role === 'teacher') {
    const TeacherProfile = require('./models/TeacherProfile');
    const profile = await TeacherProfile.findOne({ user: req.user._id });
    
    const isIdProof = profile && profile.idProof && profile.idProof.includes(safeFilename);
    const isCert = profile && profile.certificate && profile.certificate.includes(safeFilename);
    
    if (!isIdProof && !isCert) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this document' });
    }
  }

  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
  res.sendFile(filePath, err => {
    if (err && !res.headersSent) {
      res.status(500).json({ success: false, message: 'Error loading file' });
    }
  });
};

app.get('/uploads/:filename', require('./middleware/auth').protect, require('./middleware/auth').authorize('admin', 'teacher'), serveUploadFile);
app.get('/api/uploads/:filename', require('./middleware/auth').protect, require('./middleware/auth').authorize('admin', 'teacher'), serveUploadFile);

// ── Logging (dev) ────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/demos', require('./routes/demos'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({
  success: true,
  status: 'ok',
  db: mongoose.connection.readyState === 1,
  email: emailService.isConnected(),
  message: '75 Way Project Task API is running',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
}));

// ── Frontend Static Serving (Production) ───────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` }));

// ── Error handler ────────────────────────────────────────────
app.use(errorHandler);

// ── Database + Server Start ───────────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');

    await emailService.verifyConnection();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 75 Way Project Task API running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV}`);
      console.log(`   Client URL: ${process.env.CLIENT_URL}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

startServer();

module.exports = app;
