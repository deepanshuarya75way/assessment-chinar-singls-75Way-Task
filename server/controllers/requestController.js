const StudentRequest = require('../models/StudentRequest');
const TeacherProfile = require('../models/TeacherProfile');
const User = require('../models/User');
const emailService = require('../services/emailService');

exports.createRequest = async (req, res, next) => {
  try {
    const data = { ...req.body };
    let userId = null;
    
    if (req.user?._id) {
      userId = req.user._id;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {}
    }

    if (userId) {
      data.createdBy = userId;
      const user = await User.findById(userId);
      if (user) {
        if (!data.parentName) data.parentName = user.name;
        if (!data.email) data.email = user.email;
        if (!data.mobile && user.mobile) data.mobile = user.mobile;
      }
    } else if (req.body.email) {
      const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
      if (user) data.createdBy = user._id;
    }

    if (!data.parentName || !data.mobile || !data.class || !data.subject || !data.city || !data.mode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Parent Name, Mobile, Class, Subject, City, Mode).'
      });
    }

    data.parentName = String(data.parentName).trim();
    data.mobile = String(data.mobile).trim();
    if (!/^\+?\d{10,13}$/.test(data.mobile.replace(/[\s\-]/g, ''))) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number.' });
    }

    const request = await StudentRequest.create(data);

    if (request.email) {
      emailService.sendRequestConfirmation(request.email, {
        requestId: request._id.toString().slice(-6).toUpperCase(),
        parentName: request.parentName,
        class: request.class, subject: request.subject,
        city: request.city, locality: request.locality,
        mode: request.mode,
      }).catch(() => {});
    }

    const admins = await User.find({ role: 'admin', isActive: true }).select('email');
    admins.forEach(admin => {
      emailService.sendNewRequestAlertToAdmin(admin.email, {
        requestId: request._id.toString().slice(-6).toUpperCase(),
        parentName: request.parentName, mobile: request.mobile,
        class: request.class, subject: request.subject,
        city: request.city, locality: request.locality, mode: request.mode,
      }).catch(() => {});
    });

    res.status(201).json({ success: true, message: 'Request submitted successfully!', data: request });
  } catch (err) { next(err); }
};

exports.getAllRequests = async (req, res, next) => {
  try {
    const { status, city, subject, page = 1, limit = 20, search } = req.query;
    const query = { isActive: true };
    if (status) query.status = status;
    if (city) query.city = city;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (search) {
      query.$or = [
        { parentName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [requests, total] = await Promise.all([
      StudentRequest.find(query).populate('assignedTeacher', 'name mobile email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      StudentRequest.countDocuments(query),
    ]);
    res.json({ success: true, data: requests, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getRequest = async (req, res, next) => {
  try {
    const request = await StudentRequest.findById(req.params.id).populate('assignedTeacher');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (req.user.role === 'teacher') {
      const profile = await TeacherProfile.findOne({ user: req.user._id });
      if (!profile || request.assignedTeacher?._id.toString() !== profile._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this assignment.' });
      }
    } else if (req.user.role === 'student') {
      if (request.createdBy?.toString() !== req.user._id.toString() && request.email !== req.user.email) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this request.' });
      }
    }

    res.json({ success: true, data: request });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const request = await StudentRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    request.statusHistory.push({ status, changedBy: req.user._id, note, changedAt: new Date() });
    request.status = status;
    await request.save();

    res.json({ success: true, data: request });
  } catch (err) { next(err); }
};

exports.assignTeacher = async (req, res, next) => {
  try {
    const { teacherId, reassign } = req.body;
    if (!teacherId) return res.status(400).json({ success: false, message: 'Teacher ID is required.' });

    const [request, teacher] = await Promise.all([
      StudentRequest.findById(req.params.id),
      TeacherProfile.findById(teacherId).populate('user')
    ]);

    if (!request) return res.status(404).json({ success: false, message: 'Student request not found.' });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found.' });

    if (teacher.applicationStatus !== 'approved') {
      return res.status(400).json({ success: false, message: 'Cannot assign a teacher whose application is not approved.' });
    }

    if (!teacher.user) {
      return res.status(400).json({ success: false, message: 'Teacher user account is missing.' });
    }

    if (teacher.user.role !== 'teacher') {
      return res.status(400).json({ success: false, message: 'Selected user is not registered as a teacher.' });
    }

    if (!teacher.user.isActive) {
      return res.status(400).json({ success: false, message: 'Cannot assign an inactive or deactivated teacher.' });
    }

    if (!teacher.user.isVerified) {
      return res.status(400).json({ success: false, message: 'Cannot assign an unverified teacher.' });
    }

    if (request.assignedTeacher && !reassign) {
      return res.status(409).json({
        success: false,
        message: `This request is already assigned to ${request.assignedTeacherName || 'a teacher'}. Explicit reassignment required.`
      });
    }

    const filter = reassign ? { _id: req.params.id } : { _id: req.params.id, assignedTeacher: null };
    const updatedRequest = await StudentRequest.findOneAndUpdate(
      filter,
      {
        assignedTeacher: teacher._id,
        assignedTeacherName: teacher.name,
        status: 'assigned',
        $push: {
          statusHistory: {
            status: 'assigned',
            changedBy: req.user._id,
            note: `Assigned to ${teacher.name}`,
            changedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(409).json({
        success: false,
        message: 'This request was already assigned to a teacher by another admin.'
      });
    }

    if (updatedRequest.email) {
      emailService.sendTeacherAssignedToParent(updatedRequest.email, {
        parentName: updatedRequest.parentName,
        teacherName: teacher.name,
        qualification: teacher.qualification,
        experience: teacher.experience || 'N/A',
        subjects: teacher.subjects?.join(', ') || updatedRequest.subject,
        mode: teacher.teachingMode,
      }).catch(() => {});
    }

    emailService.sendAssignmentToTeacher(teacher.email, {
      teacherName: teacher.name,
      requestId: updatedRequest._id.toString().slice(-6).toUpperCase(),
      class: updatedRequest.class,
      subject: updatedRequest.subject,
      city: updatedRequest.city,
      locality: updatedRequest.locality,
      mode: updatedRequest.mode,
      budget: updatedRequest.budget,
    }).catch(() => {});

    res.json({ success: true, message: 'Teacher assigned successfully.', data: updatedRequest });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [total, byStatus] = await Promise.all([
      StudentRequest.countDocuments({ isActive: true }),
      StudentRequest.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);
    const stats = { total };
    byStatus.forEach(s => { stats[s._id] = s.count; });
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

exports.getMyAssignments = async (req, res, next) => {
  try {
    const profile = await TeacherProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Teacher profile not found.' });

    const requests = await StudentRequest.find({ assignedTeacher: profile._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) { next(err); }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await StudentRequest.find({
      $or: [
        { createdBy: req.user.id },
        { email: req.user.email }
      ]
    }).populate({
      path: 'assignedTeacher',
      select: 'name photo gender rating totalReviews expectedFee cities teachingMode subjects experience qualification user',
      populate: { path: 'user', select: 'name email avatar' }
    }).sort('-createdAt');
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) { next(err); }
};

exports.getPublicStats = async (req, res, next) => {
  try {
    const TeacherProfile = require('../models/TeacherProfile');
    const [happyFamilies, expertTutors, citiesCovered, sessionsCompleted] = await Promise.all([
      StudentRequest.countDocuments(),
      TeacherProfile.countDocuments({ applicationStatus: 'approved' }),
      StudentRequest.distinct('city').then(cities => cities.length),
      StudentRequest.countDocuments({ status: { $in: ['demo_scheduled', 'demo_completed', 'closed'] } })
    ]);
    
    res.json({
      success: true,
      data: {
        happyFamilies,
        expertTutors,
        citiesCovered,
        sessionsCompleted,
      }
    });
  } catch (err) { next(err); }
};
