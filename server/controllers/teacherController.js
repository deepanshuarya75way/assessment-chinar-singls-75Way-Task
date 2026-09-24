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


exports.fetchTeachers = async (req, res, next) => {
  try {
    const {
      goals,
      subjects,
      preferredDays,
      budget,
      mode,
      location,
      experience,
      page: pageParam,
      limit: limitParam,
    } = req.query;

    // =========================================================
    // 1. NORMALIZATION HELPERS
    // =========================================================

    const normalizeArray = (value) => {
      if (
        value === undefined ||
        value === null ||
        value === ''
      ) {
        return [];
      }

      if (Array.isArray(value)) {
        return value
          .flat(Infinity)
          .map((item) => String(item).trim())
          .filter(Boolean);
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();

        // Support JSON arrays:
        // ?subjects=["Math","Physics"]
        if (
          trimmed.startsWith('[') &&
          trimmed.endsWith(']')
        ) {
          try {
            const parsed = JSON.parse(trimmed);

            if (Array.isArray(parsed)) {
              return parsed
                .flat(Infinity)
                .map((item) => String(item).trim())
                .filter(Boolean);
            }
          } catch {
            // Fall through to comma-separated parsing.
          }
        }

        // Support:
        // ?subjects=Math,Physics
        return trimmed
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return [String(value).trim()].filter(Boolean);
    };

    const normalizeText = (value) =>
      String(value ?? '')
        .trim()
        .toLowerCase();

    const normalizeTextArray = (value) =>
      normalizeArray(value).map(normalizeText);

    const parseNumber = (value) => {
      if (
        value === undefined ||
        value === null ||
        value === ''
      ) {
        return null;
      }

      const match = String(value).match(
        /[\d,]+(?:\.\d+)?/
      );

      if (!match) return null;

      const number = Number(
        match[0].replace(/,/g, '')
      );

      return Number.isFinite(number) ? number : null;
    };

    const parseExperience = (value) => {
      const number = parseNumber(value);
      return number ?? 0;
    };

    const normalizeMode = (value) => {
      const text = normalizeText(value);

      if (!text) return [];

      const modes = new Set();

      if (
        text.includes('online') ||
        text.includes('both')
      ) {
        modes.add('online');
      }

      if (
        text.includes('offline') ||
        text.includes('home') ||
        text.includes('both')
      ) {
        modes.add('offline');
      }

      return [...modes];
    };

    // =========================================================
    // 2. NORMALIZE REQUEST ONCE
    // =========================================================

    const requestedSubjects = normalizeTextArray(subjects);
    const requestedGoals = normalizeTextArray(goals);
    const requestedDays = normalizeTextArray(preferredDays);

    const requestedMode = normalizeText(mode);
    const requestedLocation = normalizeText(location);

    const requestedBudget = parseNumber(budget);
    const requestedExperience = parseNumber(experience);

    const page = Math.max(
      1,
      Number(pageParam) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(limitParam) || 20
      )
    );

    // =========================================================
    // 3. DATABASE QUERY
    // =========================================================
    //
    // Public endpoint:
    // Only approved teachers are returned.
    //
    // Add/remove fields from the select according to your
    // TeacherProfile schema.
    // =========================================================

    const teachers = await TeacherProfile.find({
      applicationStatus: 'approved',
    })
      .select(
        '-idProof -certificate -mobile -email'
      )
      .lean();

    // =========================================================
    // 4. REQUESTED MODE HELPERS
    // =========================================================

    const wantsOffline =
      requestedMode.includes('offline') ||
      requestedMode.includes('home') ||
      requestedMode === 'both' ||
      requestedMode === 'online & home' ||
      requestedMode === 'online and home';

    const wantsOnline =
      requestedMode.includes('online') ||
      requestedMode === 'both' ||
      requestedMode === 'online & home' ||
      requestedMode === 'online and home';

    const wantsBoth =
      requestedMode === 'both' ||
      requestedMode === 'online & home' ||
      requestedMode === 'online and home';

    // =========================================================
    // 5. GENERIC MATCH HELPERS
    // =========================================================

    const createMatchSet = (values) =>
      new Set(
        normalizeTextArray(values)
      );

    const calculateMatches = (
      teacherValues,
      requestedValues
    ) => {
      if (
        requestedValues.length === 0 ||
        teacherValues.length === 0
      ) {
        return {
          matched: [],
          percentage: 0,
        };
      }

      const teacherSet =
        createMatchSet(teacherValues);

      const matched = [];

      for (const requested of requestedValues) {
        const requestText =
          normalizeText(requested);

        let found = false;

        for (const teacherValue of teacherSet) {
          if (
            teacherValue === requestText ||
            teacherValue.includes(requestText) ||
            requestText.includes(teacherValue)
          ) {
            found = true;
            break;
          }
        }

        if (found) {
          matched.push(requested);
        }
      }

      return {
        matched,
        percentage: Math.round(
          (matched.length /
            requestedValues.length) *
            100
        ),
      };
    };

    const calculatePoints = (
      percentage,
      maxPoints,
      hasRequest
    ) => {
      if (!hasRequest) return 0;

      return Math.round(
        (percentage / 100) * maxPoints
      );
    };

    // =========================================================
    // 6. TEACHER FIELD HELPERS
    // =========================================================

    const getTeacherGoals = (teacher) =>
      normalizeArray(
        teacher.goals ??
          teacher.teachingGoals ??
          teacher.goal ??
          teacher.profileGoals
      );

    const getTeacherDays = (teacher) =>
      normalizeArray(
        teacher.preferredDays ??
          teacher.availableDays ??
          teacher.availabilityDays ??
          teacher.days ??
          teacher.availability?.days
      );

    const getTeacherLocations = (teacher) => [
      ...normalizeTextArray(teacher.cities),
      ...normalizeTextArray(teacher.localities),
    ];

    // =========================================================
    // 7. RANK TEACHERS
    // =========================================================

    const rankedTeachers = teachers.map((teacher) => {
      // -------------------------------------------------------
      // SUBJECT
      // -------------------------------------------------------

      const teacherSubjects =
        normalizeTextArray(
          teacher.subjects
        );

      const subjectResult =
        calculateMatches(
          teacherSubjects,
          requestedSubjects
        );

      const subjectPoints =
        calculatePoints(
          subjectResult.percentage,
          30,
          requestedSubjects.length > 0
        );

      // -------------------------------------------------------
      // GOALS
      // -------------------------------------------------------

      const teacherGoals =
        normalizeTextArray(
          getTeacherGoals(teacher)
        );

      const goalResult =
        calculateMatches(
          teacherGoals,
          requestedGoals
        );

      const goalPoints =
        calculatePoints(
          goalResult.percentage,
          20,
          requestedGoals.length > 0
        );

      // -------------------------------------------------------
      // AVAILABILITY
      // -------------------------------------------------------

      const teacherDays =
        normalizeTextArray(
          getTeacherDays(teacher)
        );

      const availabilityResult =
        calculateMatches(
          teacherDays,
          requestedDays
        );

      const availabilityPoints =
        calculatePoints(
          availabilityResult.percentage,
          20,
          requestedDays.length > 0
        );

      // -------------------------------------------------------
      // BUDGET
      // -------------------------------------------------------

      const teacherFee =
        parseNumber(teacher.expectedFee);

      let budgetPoints = 0;
      let budgetMatch = false;

      if (
        requestedBudget !== null &&
        requestedBudget > 0 &&
        teacherFee !== null
      ) {
        if (teacherFee <= requestedBudget) {
          budgetPoints = 15;
          budgetMatch = true;
        } else {
          const percentageOver =
            (teacherFee - requestedBudget) /
            requestedBudget;

          if (percentageOver <= 0.10) {
            budgetPoints = 12;
          } else if (percentageOver <= 0.20) {
            budgetPoints = 9;
          } else if (percentageOver <= 0.30) {
            budgetPoints = 6;
          } else if (percentageOver <= 0.50) {
            budgetPoints = 3;
          }
        }
      }

      // -------------------------------------------------------
      // EXPERIENCE
      // -------------------------------------------------------

      const teacherExperience =
        parseExperience(
          teacher.experience
        );

      let experiencePoints = 0;

      if (
        requestedExperience !== null
      ) {
        if (
          teacherExperience >=
          requestedExperience
        ) {
          experiencePoints = 10;
        } else if (
          teacherExperience >=
          requestedExperience * 0.75
        ) {
          experiencePoints = 7;
        } else if (
          teacherExperience >=
          requestedExperience * 0.5
        ) {
          experiencePoints = 4;
        }
      } else {
        // Keep experience contributing to the default ranking.
        if (teacherExperience >= 5) {
          experiencePoints = 10;
        } else if (teacherExperience >= 3) {
          experiencePoints = 8;
        } else if (teacherExperience >= 2) {
          experiencePoints = 6;
        } else if (teacherExperience >= 1) {
          experiencePoints = 4;
        } else {
          experiencePoints = 2;
        }
      }

      // -------------------------------------------------------
      // RATING
      // -------------------------------------------------------

      const teacherRating = Math.max(
        0,
        Math.min(
          5,
          Number(teacher.rating) || 0
        )
      );

      const ratingPoints =
        Math.round(
          teacherRating
        );

      // -------------------------------------------------------
      // MODE
      // -------------------------------------------------------

      const teacherModes =
        normalizeMode(
          teacher.teachingMode
        );

      let modeMatch = true;

      if (requestedMode) {
        const hasOnline =
          teacherModes.includes('online');

        const hasOffline =
          teacherModes.includes('offline');

        if (wantsBoth) {
          modeMatch =
            hasOnline && hasOffline;
        } else if (wantsOnline && !wantsOffline) {
          modeMatch = hasOnline;
        } else if (wantsOffline && !wantsOnline) {
          modeMatch = hasOffline;
        } else {
          modeMatch =
            teacherModes.includes(
              requestedMode
            );
        }
      }

      // -------------------------------------------------------
      // LOCATION
      // -------------------------------------------------------

      const teacherLocations =
        getTeacherLocations(teacher);

      let locationMatch = true;

      if (
        wantsOffline &&
        requestedLocation
      ) {
        locationMatch =
          teacherLocations.some(
            (teacherLocation) =>
              teacherLocation ===
                requestedLocation ||
              teacherLocation.includes(
                requestedLocation
              ) ||
              requestedLocation.includes(
                teacherLocation
              )
          );
      }

      // -------------------------------------------------------
      // ELIGIBILITY
      // -------------------------------------------------------

      const eligible =
        modeMatch &&
        (
          !wantsOffline ||
          !requestedLocation ||
          locationMatch
        );

      // -------------------------------------------------------
      // TOTAL SCORE
      // -------------------------------------------------------

      const totalScore =
        subjectPoints +
        goalPoints +
        availabilityPoints +
        budgetPoints +
        experiencePoints +
        ratingPoints;

      // -------------------------------------------------------
      // REASONS
      // -------------------------------------------------------

      const reasons = [];

      if (requestedSubjects.length) {
        if (
          subjectResult.matched.length ===
          requestedSubjects.length
        ) {
          reasons.push(
            `Teaches all requested subjects (+${subjectPoints})`
          );
        } else if (
          subjectResult.matched.length
        ) {
          reasons.push(
            `Teaches ${subjectResult.matched.join(', ')} (+${subjectPoints})`
          );
        } else {
          reasons.push(
            `No direct subject match (+${subjectPoints})`
          );
        }
      }

      if (requestedGoals.length) {
        if (
          goalResult.matched.length ===
          requestedGoals.length
        ) {
          reasons.push(
            `Matches all your learning goals (+${goalPoints})`
          );
        } else if (
          goalResult.matched.length
        ) {
          reasons.push(
            `Matches ${goalResult.matched.length} of your learning goals (+${goalPoints})`
          );
        } else {
          reasons.push(
            `No specific goal match (+${goalPoints})`
          );
        }
      }

      if (requestedDays.length) {
        if (
          availabilityResult.matched.length ===
          requestedDays.length
        ) {
          reasons.push(
            `Available on all preferred days (+${availabilityPoints})`
          );
        } else if (
          availabilityResult.matched.length
        ) {
          reasons.push(
            `Available on ${availabilityResult.matched.join(', ')} (+${availabilityPoints})`
          );
        } else {
          reasons.push(
            `No preferred-day availability found (+${availabilityPoints})`
          );
        }
      }

      if (requestedBudget !== null) {
        if (budgetMatch) {
          reasons.push(
            `Within your ₹${requestedBudget} budget (+${budgetPoints})`
          );
        } else if (teacherFee !== null) {
          reasons.push(
            `Fee ₹${teacherFee}/hr compared with ₹${requestedBudget} budget (+${budgetPoints})`
          );
        }
      }

      if (requestedExperience !== null) {
        if (
          teacherExperience >=
          requestedExperience
        ) {
          reasons.push(
            `${teacherExperience}+ years experience meets your requirement (+${experiencePoints})`
          );
        } else {
          reasons.push(
            `${teacherExperience}+ years experience (+${experiencePoints})`
          );
        }
      } else {
        reasons.push(
          `${teacherExperience}+ years teaching experience (+${experiencePoints})`
        );
      }

      if (teacherRating > 0) {
        reasons.push(
          `Rated ${teacherRating}/5 (+${ratingPoints})`
        );
      }

      if (requestedMode) {
        reasons.push(
          modeMatch
            ? `Offers your preferred ${mode} mode`
            : `Teaching mode differs from your preference`
        );
      }

      if (
        wantsOffline &&
        requestedLocation
      ) {
        reasons.push(
          locationMatch
            ? `Available in your selected location`
            : `Location does not match`
        );
      }

      return {
        ...teacher,

        matchScore: totalScore,

        matchBreakdown: {
          subject: {
            points: subjectPoints,
            maxPoints: 30,
            percentage:
              subjectResult.percentage,
            matched:
              subjectResult.matched,
          },

          goal: {
            points: goalPoints,
            maxPoints: 20,
            percentage:
              goalResult.percentage,
            matched:
              goalResult.matched,
          },

          availability: {
            points: availabilityPoints,
            maxPoints: 20,
            percentage:
              availabilityResult.percentage,
            matched:
              availabilityResult.matched,
          },

          budget: {
            points: budgetPoints,
            maxPoints: 15,
            teacherFee,
            requestedBudget,
            withinBudget: budgetMatch,
          },

          experience: {
            points: experiencePoints,
            maxPoints: 10,
            teacherExperience,
            requestedExperience,
          },

          rating: {
            points: ratingPoints,
            maxPoints: 5,
            rating: teacherRating,
          },
        },

        matchEligibility: {
          mode: modeMatch,
          location: locationMatch,
          eligible,
        },

        matchReasons:
          reasons.slice(0, 6),
      };
    });

    // =========================================================
    // 8. FILTER ELIGIBLE TEACHERS
    // =========================================================

    const eligibleTeachers =
      rankedTeachers.filter(
        (teacher) =>
          teacher.matchEligibility.eligible
      );

    // =========================================================
    // 9. SORT
    // =========================================================

    eligibleTeachers.sort((a, b) => {
      // Overall score
      if (
        b.matchScore !== a.matchScore
      ) {
        return (
          b.matchScore -
          a.matchScore
        );
      }

      // Subject
      const subjectDifference =
        b.matchBreakdown.subject.points -
        a.matchBreakdown.subject.points;

      if (subjectDifference) {
        return subjectDifference;
      }

      // Goal
      const goalDifference =
        b.matchBreakdown.goal.points -
        a.matchBreakdown.goal.points;

      if (goalDifference) {
        return goalDifference;
      }

      // Rating
      const ratingDifference =
        b.matchBreakdown.rating.rating -
        a.matchBreakdown.rating.rating;

      if (ratingDifference) {
        return ratingDifference;
      }

      // Experience
      return (
        b.matchBreakdown.experience
          .teacherExperience -
        a.matchBreakdown.experience
          .teacherExperience
      );
    });

    // =========================================================
    // 10. PAGINATION
    // =========================================================

    const total =
      eligibleTeachers.length;

    const pages =
      Math.ceil(total / limit);

    const startIndex =
      (page - 1) * limit;

    const paginatedTeachers =
      eligibleTeachers.slice(
        startIndex,
        startIndex + limit
      );

    // =========================================================
    // 11. RESPONSE
    // =========================================================

    return res.status(200).json({
      success: true,

      data: paginatedTeachers,

      meta: {
        total,
        page,
        limit,
        pages,

        matchingWeights: {
          subject: 30,
          goal: 20,
          availability: 20,
          budget: 15,
          experience: 10,
          rating: 5,
        },

        criteria: {
          subjects: requestedSubjects,
          goals: requestedGoals,
          preferredDays: requestedDays,
          budget: requestedBudget,
          mode: requestedMode || null,

          location:
            wantsOffline &&
            requestedLocation
              ? requestedLocation
              : null,

          experience:
            requestedExperience,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};