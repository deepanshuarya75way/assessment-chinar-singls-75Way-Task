const TeacherProfile = require('../models/TeacherProfile');
const TeacherApplication = require('../models/TeacherApplication');
const User = require('../models/User');
const emailService = require('../services/emailService');

exports.applyAsTeacher = async (req, res, next) => {
  try {
    const { name, mobile, email, password, ...rest } = req.body;
    let profileData = { ...rest };
    
    ['subjects', 'classes', 'cities', 'localities', 'boards'].forEach(field => {
      if (profileData[field] && typeof profileData[field] === 'string') {
        try {
          profileData[field] = JSON.parse(profileData[field]);
        } catch (e) {
          // If it fails to parse, just keep the original value or turn to array
          profileData[field] = [profileData[field]];
        }
      }
    });

    let idProofDoc = undefined;
    let certificateDoc = undefined;
    if (req.files) {
      if (req.files.idProof && req.files.idProof[0]) {
        const f = req.files.idProof[0];
        profileData.idProof = `/uploads/${f.filename}`;
        idProofDoc = {
          url: `/uploads/${f.filename}`,
          fileName: f.originalname || f.filename,
          mimeType: f.mimetype || (f.filename.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
          uploadedAt: new Date()
        };
      }
      if (req.files.certificate && req.files.certificate[0]) {
        const f = req.files.certificate[0];
        profileData.certificate = `/uploads/${f.filename}`;
        certificateDoc = {
          url: `/uploads/${f.filename}`,
          fileName: f.originalname || f.filename,
          mimeType: f.mimetype || (f.filename.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
          uploadedAt: new Date()
        };
      }
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: password || mobile + '@TC', mobile, role: 'teacher' });
    } else {
      if (!user.name || user.name !== name) {
        user.name = name;
        if (user.role !== 'admin') user.role = 'teacher';
        await user.save({ validateBeforeSave: false });
      }
    }

    const existingApp = await TeacherApplication.findOne({ userId: user._id, status: 'pending' });
    if (existingApp) return res.status(400).json({ success: false, message: 'You already have a pending application.' });

    const applicationRecord = await TeacherApplication.create({
      userId: user._id,
      fullName: name,
      email,
      mobile,
      qualification: profileData.qualification,
      experience: profileData.experience,
      expectedFee: profileData.expectedFee,
      subjects: profileData.subjects,
      classes: profileData.classes,
      cities: profileData.cities,
      teachingMode: profileData.teachingMode,
      professionalBio: profileData.bio,
      documents: {
        idProof: idProofDoc || (profileData.idProof ? { url: profileData.idProof, fileName: profileData.idProof.split('/').pop() } : undefined),
        highestDegree: certificateDoc || (profileData.certificate ? { url: profileData.certificate, fileName: profileData.certificate.split('/').pop() } : undefined)
      },
      status: 'pending'
    });

    let profile = await TeacherProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await TeacherProfile.create({
        ...profileData, user: user._id, name, mobile, email, consent: true, applicationStatus: 'pending'
      });
    } else {
      await TeacherProfile.findByIdAndUpdate(profile._id, { ...profileData, applicationStatus: 'pending' });
    }

    emailService.sendWelcomeEmail(email, name, 'teacher').catch(() => {});

    const admins = await User.find({ role: 'admin', isActive: true }).select('email');
    admins.forEach(admin => {
      emailService.sendNewRequestAlertToAdmin(admin.email, {
        requestId: applicationRecord._id.toString().slice(-6).toUpperCase(),
        parentName: `Teacher Application: ${name}`, mobile,
        class: profileData.classes?.join(', ') || '', subject: profileData.subjects?.join(', ') || '',
        city: profileData.cities?.[0] || '', mode: profileData.teachingMode || '',
      }).catch(() => {});
    });

    res.status(201).json({ success: true, message: 'Application submitted! We will review and contact you within 24-48 hours.', data: applicationRecord });
  } catch (err) { next(err); }
};

exports.getAllTeachers = async (req, res, next) => {
  try {
    const { status, city, subject, page = 1, limit = 20, search } = req.query;
    const query = {};

    let isAdmin = false;
    let token = null;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.role === 'admin' && user.isActive) {
          isAdmin = true;
        }
      } catch (e) {}
    }

    if (isAdmin) {
      if (status) query.applicationStatus = status;
    } else {
      query.applicationStatus = 'approved';
    }

    if (city) query.cities = city;
    if (subject) query.subjects = { $regex: subject, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [teachers, total] = await Promise.all([
      TeacherProfile.find(query)
        .select(isAdmin ? '' : '-idProof -certificate -mobile -email') // Hide sensitive details for public
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      TeacherProfile.countDocuments(query),
    ]);
    res.json({ success: true, data: teachers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getTeacher = async (req, res, next) => {
  try {
    const teacher = await TeacherProfile.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });
    res.json({ success: true, data: teacher });
  } catch (err) { next(err); }
};

exports.approveTeacher = async (req, res, next) => {
  try {
    let application = await TeacherApplication.findById(req.params.id);
    let teacher;
    
    if (application) {
      application.status = 'approved';
      application.reviewedAt = new Date();
      application.reviewedBy = req.user._id;
      await application.save();
      teacher = await TeacherProfile.findOne({ user: application.userId });
    } else {
      teacher = await TeacherProfile.findById(req.params.id);
    }

    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher Profile not found.' });

    teacher.applicationStatus = 'approved';
    teacher.approvedAt = new Date();
    teacher.reviewedBy = req.user._id;
    
    if (application) {
      if (application.documents.idProof?.url) teacher.idProof = application.documents.idProof.url;
      if (application.documents.highestDegree?.url) teacher.certificate = application.documents.highestDegree.url;
    }
    await teacher.save();

    await User.findOneAndUpdate({ _id: teacher.user }, { isVerified: true, isActive: true });

    emailService.sendApplicationApproved(teacher.email, teacher.name).catch(() => {});

    res.json({ success: true, message: 'Teacher approved successfully.', data: teacher });
  } catch (err) { next(err); }
};

exports.rejectTeacher = async (req, res, next) => {
  try {
    const { reason } = req.body;
    let application = await TeacherApplication.findById(req.params.id);
    let teacher;
    
    if (application) {
      application.status = 'rejected';
      application.rejectionReason = reason;
      application.reviewedAt = new Date();
      application.reviewedBy = req.user._id;
      await application.save();
      teacher = await TeacherProfile.findOne({ user: application.userId });
    } else {
      teacher = await TeacherProfile.findById(req.params.id);
    }

    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher Profile not found.' });

    teacher.applicationStatus = 'rejected';
    teacher.rejectedAt = new Date();
    teacher.rejectionReason = reason;
    teacher.reviewedBy = req.user._id;
    await teacher.save();

    emailService.sendApplicationRejected(teacher.email, teacher.name, reason).catch(() => {});

    res.json({ success: true, message: 'Application rejected.', data: teacher });
  } catch (err) { next(err); }
};

exports.getTeacherApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    try {
      const existingUserIds = await TeacherApplication.distinct('userId');
      const missingProfiles = await TeacherProfile.find({
        user: { $nin: existingUserIds, $ne: null }
      });

      if (missingProfiles.length > 0) {
        const newApps = missingProfiles.map(p => ({
          userId: p.user,
          fullName: p.name,
          email: p.email,
          mobile: p.mobile,
          qualification: p.qualification || 'Not specified',
          experience: p.experience || '',
          expectedFee: p.expectedFee ? Number(String(p.expectedFee).replace(/[^0-9]/g, '')) || 0 : 0,
          subjects: p.subjects || [],
          classes: p.classes || [],
          cities: p.cities || [],
          teachingMode: p.teachingMode || 'Both',
          professionalBio: p.bio || '',
          documents: {
            idProof: p.idProof ? {
              url: p.idProof,
              fileName: p.idProof.split('/').pop(),
              mimeType: p.idProof.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png',
              uploadedAt: p.createdAt || new Date(),
            } : undefined,
            highestDegree: p.certificate ? {
              url: p.certificate,
              fileName: p.certificate.split('/').pop(),
              mimeType: p.certificate.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png',
              uploadedAt: p.createdAt || new Date(),
            } : undefined,
          },
          status: p.applicationStatus === 'approved' ? 'approved' : p.applicationStatus === 'rejected' ? 'rejected' : 'pending',
          submittedAt: p.createdAt || new Date(),
        }));
        await TeacherApplication.insertMany(newApps);
      }
    } catch (syncErr) {
      console.warn('Teacher application sync warning:', syncErr.message);
    }

    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
      TeacherApplication.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      TeacherApplication.countDocuments(query)
    ]);
    res.json({ success: true, data: applications, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getTeacherApplicationById = async (req, res, next) => {
  try {
    let application = await TeacherApplication.findById(req.params.id);
    if (!application) {
      const profile = await TeacherProfile.findById(req.params.id);
      if (profile) {
        application = await TeacherApplication.findOne({ userId: profile.user });
      }
    }
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, data: application });
  } catch (err) { next(err); }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await TeacherProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const allowed = ['bio', 'subjects', 'classes', 'teachingMode', 'cities', 'expectedFee', 'isAvailable', 'experience'];
    const updates = {};
    allowed.forEach(k => {
      if (req.body[k] !== undefined) {
        if (['cities', 'subjects', 'classes'].includes(k)) {
          if (Array.isArray(req.body[k])) {
            updates[k] = req.body[k].map(item => String(item).trim()).filter(Boolean);
          } else if (typeof req.body[k] === 'string') {
            try {
              const parsed = JSON.parse(req.body[k]);
              updates[k] = Array.isArray(parsed) ? parsed : [req.body[k]];
            } catch (e) {
              updates[k] = req.body[k].split(',').map(s => s.trim()).filter(Boolean);
            }
          }
        } else {
          updates[k] = req.body[k];
        }
      }
    });
    const profile = await TeacherProfile.findOneAndUpdate({ user: req.user._id }, updates, { new: true, runValidators: true });
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [total, byStatus] = await Promise.all([
      TeacherProfile.countDocuments(),
      TeacherProfile.aggregate([{ $group: { _id: '$applicationStatus', count: { $sum: 1 } } }]),
    ]);
    const stats = { total };
    byStatus.forEach(s => { stats[s._id] = s.count; });
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};
