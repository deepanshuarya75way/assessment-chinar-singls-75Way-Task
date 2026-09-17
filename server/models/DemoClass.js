const mongoose = require('mongoose');

const demoClassSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRequest', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherProfile', required: true },
  teacherName: { type: String },
  teacherEmail: { type: String },
  studentName: { type: String },
  parentName: { type: String },
  parentEmail: { type: String },
  parentMobile: { type: String },

  subject: { type: String },
  class: { type: String },
  mode: { type: String },
  city: { type: String },

  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  duration: { type: Number, default: 60 }, // minutes

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'demo_scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },

  meetLink: { type: String }, // for online classes
  address: { type: String },  // for home tuition

  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    givenAt: { type: Date },
  },

  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancelledBy: { type: String },
  cancellationReason: { type: String },

  emailsSent: [{
    type: { type: String },
    to: String,
    sentAt: { type: Date, default: Date.now }
  }],

  scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

demoClassSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('DemoClass', demoClassSchema);
