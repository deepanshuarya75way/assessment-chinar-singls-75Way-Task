const path = require('path');
const fs = require('fs');
const StudentRequest = require('../models/StudentRequest');
const TeacherProfile = require('../models/TeacherProfile');
const TeacherApplication = require('../models/TeacherApplication');
const DemoClass = require('../models/DemoClass');
const User = require('../models/User');

// @GET /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const [
      newRequests, newRequestsLast,
      newApplications, newApplicationsLast,
      assignedTeachers, pendingFollowups,
      demoClasses, totalUsers,
      recentRequests, recentApplications,
    ] = await Promise.all([
      StudentRequest.countDocuments({ status: 'new' }),
      StudentRequest.countDocuments({ status: 'new', createdAt: { $gte: lastWeek, $lt: weekAgo } }),
      TeacherProfile.countDocuments({ applicationStatus: 'pending' }),
      TeacherProfile.countDocuments({ applicationStatus: 'pending', createdAt: { $gte: lastWeek, $lt: weekAgo } }),
      StudentRequest.countDocuments({ status: 'assigned' }),
      StudentRequest.countDocuments({ status: 'contacted' }),
      DemoClass.countDocuments({ status: 'demo_scheduled' }),
      User.countDocuments({ isActive: true }),
      StudentRequest.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).populate('assignedTeacher', 'name'),
      TeacherProfile.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const trend = (curr, prev) => prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100);

    res.json({
      success: true,
      data: {
        kpis: {
          newRequests, newApplications, assignedTeachers, pendingFollowups, demoClasses, totalUsers,
          trends: {
            newRequests: trend(newRequests, newRequestsLast),
            newApplications: trend(newApplications, newApplicationsLast),
          },
        },
        recentRequests,
        recentApplications,
      }
    });
  } catch (err) { next(err); }
};

// @GET /api/admin/users — admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({ success: true, data: users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @PATCH /api/admin/users/:id/toggle — admin
exports.toggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}.` });
  } catch (err) { next(err); }
};

// @GET /api/admin/applications/:id/documents/:documentType — admin only
exports.getApplicationDocument = async (req, res, next) => {
  try {
    const { id, documentType } = req.params;
    const allowedTypes = ['idProof', 'highestDegree', 'certificate'];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ success: false, message: 'Invalid document type requested.' });
    }

    let application = await TeacherApplication.findById(id);
    let docUrl = null;
    let fileName = null;
    let mimeType = null;

    if (application) {
      const doc = documentType === 'idProof' 
        ? application.documents?.idProof 
        : (application.documents?.highestDegree || application.documents?.certificate);
      docUrl = doc?.url;
      fileName = doc?.fileName;
      mimeType = doc?.mimeType;
    } else {
      const profile = await TeacherProfile.findById(id);
      if (profile) {
        docUrl = documentType === 'idProof' ? profile.idProof : profile.certificate;
      }
    }

    if (!docUrl) {
      return res.status(404).json({ success: false, message: 'Document not found for this application.' });
    }

    // Normalize legacy/odd stored values (full URLs, Windows separators)
    const normalized = String(docUrl).replace(/\\/g, '/');
    const safeFilename = path.basename(normalized);

    // Defense in depth: never serve file types outside the upload whitelist
    const ext = path.extname(safeFilename).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.pdf'].includes(ext)) {
      return res.status(404).json({ success: false, message: 'Document file type is not supported.' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server.' });
    }

    // Correct MIME type from stored metadata, falling back to the real extension
    const MIME_BY_EXT = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
    const contentType = mimeType || MIME_BY_EXT[ext];

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Disposition', `inline; filename="${fileName || safeFilename}"`);

    return res.sendFile(filePath);
  } catch (err) { next(err); }
};
