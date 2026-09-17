const mongoose = require('mongoose');

const studentRequestSchema = new mongoose.Schema({
  // Parent/Student Info
  parentName: { type: String, required: true, trim: true },
  studentName: { type: String, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  whatsapp: { type: String, trim: true },

  // Tuition Details
  class: { type: String, required: true },
  subject: { type: String, required: true },
  board: { type: String, default: 'CBSE' },
  mode: { type: String, enum: ['Home Tuition', 'Online', 'Group Classes'], required: true },
  budget: { type: String },

  // Location
  city: { type: String, required: true },
  locality: { type: String },
  address: { type: String },
  pincode: { type: String },

  // Status & Assignment
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'not_interested', 'assigned', 'demo_scheduled', 'completed', 'rejected'],
    default: 'new'
  },
  assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherProfile' },
  assignedTeacherName: { type: String },

  // Tracking
  notes: { type: String },
  followUpDate: { type: Date },
  demoDate: { type: Date },
  demoTime: { type: String },

  // Admin tracking
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statusHistory: [{
    status: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    note: String,
  }],

  // Email tracking
  emailsSent: [{
    type: { type: String },
    sentAt: { type: Date, default: Date.now },
    to: String,
  }],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Index for efficient queries
studentRequestSchema.index({ status: 1, city: 1, createdAt: -1 });
studentRequestSchema.index({ mobile: 1 });

module.exports = mongoose.model('StudentRequest', studentRequestSchema);
