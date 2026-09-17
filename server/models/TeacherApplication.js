const mongoose = require('mongoose');

const teacherApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  qualification: { type: String, required: true },
  experience: { type: String },
  expectedFee: { type: Number },
  subjects: [{ type: String }],
  classes: [{ type: String }],
  cities: [{ type: String }],
  teachingMode: { type: String, enum: ['Home Tuition', 'Online', 'Both'], default: 'Both' },
  professionalBio: { type: String },

  documents: {
    idProof: {
      url: { type: String },
      fileName: { type: String },
      mimeType: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    },
    highestDegree: {
      url: { type: String },
      fileName: { type: String },
      mimeType: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String }
}, { timestamps: true });

teacherApplicationSchema.index({ status: 1 });
teacherApplicationSchema.index({ userId: 1 });

module.exports = mongoose.model('TeacherApplication', teacherApplicationSchema, 'teacherapplications');
