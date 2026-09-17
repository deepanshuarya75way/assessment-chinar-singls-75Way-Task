const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  mobile: { type: String, trim: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, select: false },
  otpExpires: { type: Date, select: false },
  otpAttempts: { type: Number, default: 0, select: false },
  otpLastResent: { type: Date, select: false },
  avatar: { type: String },
  lastLogin: { type: Date },
  refreshToken: { type: String, select: false },
  mustChangePassword: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.otpAttempts;
  delete obj.otpLastResent;
  delete obj.refreshToken;
  // mustChangePassword is intentionally NOT stripped — the client needs it to
  // prompt the user to replace a temporary password. It contains no secret.
  return obj;
};

module.exports = mongoose.model('User', userSchema);
