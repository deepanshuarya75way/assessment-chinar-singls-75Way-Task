const DemoClass = require('../models/DemoClass');
const StudentRequest = require('../models/StudentRequest');
const emailService = require('../services/emailService');

// @POST /api/demos — admin
exports.scheduleDemo = async (req, res, next) => {
  try {
    const { requestId, teacherId, scheduledDate, scheduledTime, meetLink, address } = req.body;

    const request = await StudentRequest.findById(requestId).populate('assignedTeacher');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const teacher = request.assignedTeacher;
    if (!teacher) return res.status(400).json({ success: false, message: 'No teacher assigned yet.' });

    const demo = await DemoClass.create({
      request: requestId, teacher: teacher._id,
      teacherName: teacher.name, teacherEmail: teacher.email,
      parentName: request.parentName, parentEmail: request.email, parentMobile: request.mobile,
      subject: request.subject, class: request.class, mode: request.mode, city: request.city,
      scheduledDate: new Date(scheduledDate), scheduledTime,
      status: 'demo_scheduled', meetLink, address, scheduledBy: req.user._id,
    });

    // Update request status
    request.status = 'demo_scheduled';
    request.demoDate = new Date(scheduledDate);
    request.demoTime = scheduledTime;
    await request.save();

    const dateStr = new Date(scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Email parent
    if (request.email) {
      emailService.sendDemoScheduledToParent(request.email, {
        parentName: request.parentName, teacherName: teacher.name,
        subject: request.subject, class: request.class,
        date: dateStr, time: scheduledTime, mode: request.mode,
        meetLink, address,
      }).catch(() => {});
    }

    // Email teacher
    if (teacher.email) {
      emailService.sendDemoScheduledToTeacher(teacher.email, {
        teacherName: teacher.name, parentName: request.parentName,
        subject: request.subject, class: request.class,
        date: dateStr, time: scheduledTime, mode: request.mode, city: request.city,
      }).catch(() => {});
    }

    res.status(201).json({ success: true, message: 'Demo scheduled and both parties notified.', data: demo });
  } catch (err) { next(err); }
};

// @GET /api/demos — admin
exports.getAllDemos = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [demos, total] = await Promise.all([
      DemoClass.find(query).populate('request', 'parentName mobile').sort({ scheduledDate: -1 }).skip(skip).limit(Number(limit)),
      DemoClass.countDocuments(query),
    ]);
    res.json({ success: true, data: demos, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @GET /api/demos/my — teacher or student's own demos
exports.getMyDemos = async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      const studentRequests = await StudentRequest.find({
        $or: [{ createdBy: req.user._id }, { email: req.user.email }]
      });
      const requestIds = studentRequests.map(r => r._id);
      
      const demos = await DemoClass.find({
        $or: [
          { request: { $in: requestIds } },
          { parentEmail: req.user.email }
        ]
      })
      .populate('teacher', 'name photo expectedFee')
      .populate('request', 'parentName subject class mode city')
      .sort({ scheduledDate: 1 });
      
      return res.json({ success: true, data: demos });
    }

    const profile = await require('../models/TeacherProfile').findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });
    const demos = await DemoClass.find({ teacher: profile._id }).populate('request', 'parentName mobile city').sort({ scheduledDate: 1 });
    res.json({ success: true, data: demos });
  } catch (err) { next(err); }
};

// @PATCH /api/demos/:id/complete — admin or teacher
exports.completeDemo = async (req, res, next) => {
  try {
    const demo = await DemoClass.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );
    if (!demo) return res.status(404).json({ success: false, message: 'Demo not found.' });

    // Update request status
    await StudentRequest.findByIdAndUpdate(demo.request, { status: 'completed' });

    // Request feedback from parent
    if (demo.parentEmail) {
      emailService.sendDemoCompletedFeedback(demo.parentEmail, {
        parentName: demo.parentName, teacherName: demo.teacherName, demoId: demo._id,
      }).catch(() => {});
    }

    res.json({ success: true, message: 'Demo marked as completed.', data: demo });
  } catch (err) { next(err); }
};

// @PATCH /api/demos/:id/cancel
exports.cancelDemo = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const demo = await DemoClass.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelledAt: new Date(), cancelledBy: req.user.name, cancellationReason: reason },
      { new: true }
    );
    if (!demo) return res.status(404).json({ success: false, message: 'Demo not found.' });
    res.json({ success: true, data: demo });
  } catch (err) { next(err); }
};
