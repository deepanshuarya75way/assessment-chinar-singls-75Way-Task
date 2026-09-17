const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Personal Info
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  whatsapp: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  photo: { type: String },

  // Qualifications
  qualification: { type: String, required: true },
  institution: { type: String },
  experience: { type: String },
  bio: { type: String },

  // Teaching Details
  subjects: [{ type: String }],
  classes: [{ type: String }],
  boards: [{ type: String }],
  teachingMode: { type: String, enum: ['Home Tuition', 'Online', 'Both'], default: 'Both' },

  // Location
  cities: [{ type: String }],
  localities: [{ type: String }],

  // Application Status
  applicationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  rejectionReason: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Profile stats
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  monthlyEarnings: { type: Number, default: 0 },

  // Preferences
  expectedFee: { type: String },
  isAvailable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },

  // Documents
  idProof: { type: String },
  certificate: { type: String },

  // Consent
  consent: { type: Boolean, default: false },
}, { timestamps: true });

teacherProfileSchema.index({ applicationStatus: 1, cities: 1 });
teacherProfileSchema.index({ subjects: 1 });
teacherProfileSchema.index({ classes: 1 });

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema, 'teacherprofile');
