const { Resend } = require('resend');

// Provide a fallback key to prevent server crash on startup if the env variable is missing.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_to_prevent_startup_crash');

// ── BASE TEMPLATE ──────────────────────────────────────────────
const base = (title, bodyHtml) => `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
  body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4ff;}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);}
  .header{background:linear-gradient(135deg,#1B2A4A 0%,#2D6CDF 100%);padding:36px 40px;text-align:center;}
  .header img{height:40px;margin-bottom:12px;}
  .logo-text{font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;}
  .logo-accent{color:#F2B705;}
  .header-title{font-size:15px;color:rgba(255,255,255,0.7);margin-top:4px;}
  .body{padding:36px 40px;}
  .greeting{font-size:20px;font-weight:700;color:#1B2A4A;margin-bottom:8px;}
  .text{font-size:15px;color:#4a5568;line-height:1.7;margin-bottom:16px;}
  .highlight-box{background:#f0f4ff;border-left:4px solid #2D6CDF;border-radius:8px;padding:16px 20px;margin:20px 0;}
  .highlight-box p{margin:4px 0;font-size:14px;color:#2d3748;}
  .highlight-box strong{color:#1B2A4A;}
  .btn{display:inline-block;background:linear-gradient(135deg,#1B2A4A 0%,#2D6CDF 100%);color:#fff !important;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;margin:20px 0;}
  .btn-green{background:linear-gradient(135deg,#1FAA59 0%,#16874a 100%);}
  .btn-gold{background:linear-gradient(135deg,#F2B705 0%,#d4a004 100%);color:#1B2A4A !important;}
  .divider{border:none;border-top:1px solid #e8eaf0;margin:24px 0;}
  .footer{background:#f8f9fc;padding:24px 40px;text-align:center;}
  .footer p{font-size:12px;color:#a0aec0;margin:4px 0;line-height:1.6;}
  .social{margin:12px 0;}
  .badge{display:inline-block;background:#e8f0fd;color:#2D6CDF;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;margin:2px;}
  .status-badge{display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;}
  .status-new{background:#dbeafe;color:#1d4ed8;}
  .status-approved{background:#dcfce7;color:#166534;}
  .status-rejected{background:#fee2e2;color:#991b1b;}
  .status-demo{background:#fef3c7;color:#92400e;}
  .status-assigned{background:#dcfce7;color:#166534;}
  table.detail-table{width:100%;border-collapse:collapse;margin:16px 0;}
  table.detail-table td{padding:8px 12px;font-size:14px;border-bottom:1px solid #f0f0f0;}
  table.detail-table td:first-child{color:#718096;width:40%;}
  table.detail-table td:last-child{color:#1a202c;font-weight:600;}
</style></head><body>
<div class="wrap">
  <div class="header">
    <div class="logo-text">Study<span class="logo-accent">Stairs</span></div>
    <div class="header-title">India's Trusted Home Tuition Platform</div>
  </div>
  <div class="body">${bodyHtml}</div>
  <hr class="divider"/>
  <div class="footer">
    <p>📞 +91 70090-79344 &nbsp;|&nbsp; 📧 support@tuitionhub.co.in</p>
    <p>This is an automated message from 75 Way Project Task. Please do not reply.</p>
    <p style="margin-top:8px;">© ${new Date().getFullYear()} 75 Way Project Task · All rights reserved</p>
  </div>
</div>
</body></html>`;

// ── SEND HELPER ────────────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: '75 Way Project Task <noreply@tuitionhub.co.in>',
      to, subject, html,
    });
    console.log(`✉️  Mail sent to ${to} — ${subject}`);
    return true;
  } catch (err) {
    console.error(`❌ Mail error to ${to}:`, err.message);
    return false;
  }
};

// ══════════════════════════════════════════════════════════════
// 1. WELCOME EMAIL — after registration
// ══════════════════════════════════════════════════════════════
exports.sendWelcomeEmail = (to, name, role) => {
  const roleMsg = role === 'teacher'
    ? 'Your teacher application has been received. Our team will review it within 24-48 hours.'
    : 'You can now submit tuition requests and get matched with verified tutors.';
  const html = base('Welcome to 75 Way Project Task', `
    <p class="greeting">Welcome, ${name}! 🎉</p>
    <p class="text">Thank you for joining <strong>75 Way Project Task</strong> — India's most trusted home tuition platform.</p>
    <div class="highlight-box"><p>${roleMsg}</p></div>
    <p class="text">We're excited to have you on board. Here's what you can do next:</p>
    ${role === 'teacher' ? `
      <p class="text">✅ Complete your profile<br/>✅ Wait for admin approval<br/>✅ Start accepting tuition requests</p>
      <a href="${process.env.CLIENT_URL}/teacher/dashboard" class="btn">Go to Teacher Portal</a>
    ` : `
      <p class="text">✅ Submit a tuition request<br/>✅ Get matched with a verified tutor<br/>✅ Attend a free demo class</p>
      <a href="${process.env.CLIENT_URL}/find-tutor" class="btn">Find a Tutor Now</a>
    `}
    <p class="text" style="margin-top:20px;font-size:13px;color:#718096;">If you have any questions, contact us at support@tuitionhub.co.in</p>
  `);
  return sendMail({ to, subject: `Welcome to 75 Way Project Task, ${name}! 🎓`, html });
};

// ══════════════════════════════════════════════════════════════
// 1b. OTP EMAIL — for email verification
// ══════════════════════════════════════════════════════════════
exports.sendOtpEmail = (to, name, otp) => {
  const html = base('Verify Your Email', `
    <p class="greeting">Hi ${name},</p>
    <p class="text">Please verify your email address to complete your registration with 75 Way Project Task.</p>
    <div class="highlight-box" style="text-align: center;">
      <p style="font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #1B2A4A;">${otp}</p>
    </div>
    <p class="text">This OTP is valid for <strong>15 minutes</strong>. Do not share it with anyone.</p>
  `);
  return sendMail({ to, subject: `Verify Your Email - 75 Way Project Task OTP: ${otp}`, html });
};

// ══════════════════════════════════════════════════════════════
// 2. TUITION REQUEST CONFIRMATION — to parent
// ══════════════════════════════════════════════════════════════
exports.sendRequestConfirmation = (to, data) => {
  const html = base('Request Received', `
    <p class="greeting">Hi ${data.parentName},</p>
    <p class="text">Great news! We've received your tuition request. Our team will get in touch with you within <strong>24 hours</strong> with a perfect tutor match.</p>
    <div class="highlight-box">
      <p><strong>📋 Your Request Summary</strong></p>
      <table class="detail-table">
        <tr><td>Request ID</td><td>#${data.requestId}</td></tr>
        <tr><td>Class</td><td>${data.class}</td></tr>
        <tr><td>Subject</td><td>${data.subject}</td></tr>
        <tr><td>City</td><td>${data.city}${data.locality ? ', ' + data.locality : ''}</td></tr>
        <tr><td>Mode</td><td>${data.mode}</td></tr>
        <tr><td>Status</td><td><span class="status-badge status-new">New — Under Review</span></td></tr>
      </table>
    </div>
    <p class="text">🔒 <strong>Your privacy is our priority.</strong> We never share your contact details without your consent.</p>
    <a href="${process.env.CLIENT_URL}" class="btn">Visit 75 Way Project Task</a>
    <p class="text" style="font-size:13px;color:#718096;margin-top:16px;">Need urgent help? Call us at <strong>+91 70090-79344</strong></p>
  `);
  return sendMail({ to, subject: `✅ Tuition Request Received — 75 Way Project Task (#${data.requestId})`, html });
};

// ══════════════════════════════════════════════════════════════
// 3. NEW REQUEST ALERT — to admin
// ══════════════════════════════════════════════════════════════
exports.sendNewRequestAlertToAdmin = (to, data) => {
  const html = base('New Tuition Request', `
    <p class="greeting">New Request Alert 🔔</p>
    <p class="text">A new tuition request has been submitted on 75 Way Project Task.</p>
    <div class="highlight-box">
      <table class="detail-table">
        <tr><td>Request ID</td><td>#${data.requestId}</td></tr>
        <tr><td>Parent Name</td><td>${data.parentName}</td></tr>
        <tr><td>Mobile</td><td>${data.mobile}</td></tr>
        <tr><td>Class</td><td>${data.class}</td></tr>
        <tr><td>Subject</td><td>${data.subject}</td></tr>
        <tr><td>City</td><td>${data.city}${data.locality ? ', ' + data.locality : ''}</td></tr>
        <tr><td>Mode</td><td>${data.mode}</td></tr>
      </table>
    </div>
    <a href="${process.env.CLIENT_URL}/admin/requests" class="btn">Review in Admin Panel</a>
  `);
  return sendMail({ to, subject: `🆕 New Tuition Request #${data.requestId} — ${data.city}`, html });
};

// ══════════════════════════════════════════════════════════════
// 4. TEACHER ASSIGNED — to parent
// ══════════════════════════════════════════════════════════════
exports.sendTeacherAssignedToParent = (to, data) => {
  const html = base('Teacher Assigned', `
    <p class="greeting">Great news, ${data.parentName}! 🎉</p>
    <p class="text">We've found and assigned a verified tutor for your child. Please review their profile below:</p>
    <div class="highlight-box">
      <p><strong>👩‍🏫 Your Tutor</strong></p>
      <table class="detail-table">
        <tr><td>Name</td><td>${data.teacherName}</td></tr>
        <tr><td>Qualification</td><td>${data.qualification}</td></tr>
        <tr><td>Experience</td><td>${data.experience}</td></tr>
        <tr><td>Subjects</td><td>${data.subjects}</td></tr>
        <tr><td>Mode</td><td>${data.mode}</td></tr>
      </table>
    </div>
    <p class="text">Our team will contact you to schedule a <strong>FREE demo class</strong>. You only pay if you're completely satisfied!</p>
    <a href="${process.env.CLIENT_URL}" class="btn btn-green">Confirm & Schedule Demo</a>
    <p class="text" style="font-size:13px;color:#718096;margin-top:16px;">Questions? Call us: <strong>+91 70090-79344</strong></p>
  `);
  return sendMail({ to, subject: `🎓 Tutor Assigned for Your Request — 75 Way Project Task`, html });
};

// ══════════════════════════════════════════════════════════════
// 5. ASSIGNMENT NOTIFICATION — to teacher
// ══════════════════════════════════════════════════════════════
exports.sendAssignmentToTeacher = (to, data) => {
  const html = base('New Assignment', `
    <p class="greeting">Hi ${data.teacherName},</p>
    <p class="text">You have been assigned a new tuition request on 75 Way Project Task. Please review the details and confirm your availability.</p>
    <div class="highlight-box">
      <p><strong>📚 Tuition Details</strong></p>
      <table class="detail-table">
        <tr><td>Request ID</td><td>#${data.requestId}</td></tr>
        <tr><td>Class</td><td>${data.class}</td></tr>
        <tr><td>Subject</td><td>${data.subject}</td></tr>
        <tr><td>City</td><td>${data.city}${data.locality ? ', ' + data.locality : ''}</td></tr>
        <tr><td>Mode</td><td>${data.mode}</td></tr>
        <tr><td>Budget</td><td>${data.budget || 'Negotiable'}</td></tr>
      </table>
    </div>
    <p class="text">⚡ Please respond within <strong>24 hours</strong> to confirm interest. Missing the window may result in reassignment.</p>
    <a href="${process.env.CLIENT_URL}/teacher/requests" class="btn">View & Respond</a>
  `);
  return sendMail({ to, subject: `📚 New Tuition Assignment — ${data.subject} (${data.city})`, html });
};

// ══════════════════════════════════════════════════════════════
// 6. DEMO CLASS SCHEDULED — to parent
// ══════════════════════════════════════════════════════════════
exports.sendDemoScheduledToParent = (to, data) => {
  const html = base('Demo Class Scheduled', `
    <p class="greeting">Hi ${data.parentName},</p>
    <p class="text">Your demo class has been confirmed! Here are the details:</p>
    <div class="highlight-box">
      <p><strong>📅 Demo Class Details</strong></p>
      <table class="detail-table">
        <tr><td>Teacher</td><td>${data.teacherName}</td></tr>
        <tr><td>Subject</td><td>${data.subject} — ${data.class}</td></tr>
        <tr><td>Date</td><td>${data.date}</td></tr>
        <tr><td>Time</td><td>${data.time}</td></tr>
        <tr><td>Mode</td><td>${data.mode}</td></tr>
        ${data.meetLink ? `<tr><td>Meeting Link</td><td><a href="${data.meetLink}">${data.meetLink}</a></td></tr>` : ''}
        ${data.address ? `<tr><td>Address</td><td>${data.address}</td></tr>` : ''}
      </table>
    </div>
    <p class="text">💡 <strong>Tips for the demo:</strong></p>
    <p class="text">• Keep your child ready 5 minutes early<br/>• Have their recent tests/notes ready<br/>• Feel free to ask the tutor any questions</p>
    <a href="${process.env.CLIENT_URL}" class="btn btn-gold">View Details</a>
  `);
  return sendMail({ to, subject: `📅 Demo Class Confirmed — ${data.date} at ${data.time}`, html });
};

// ══════════════════════════════════════════════════════════════
// 7. DEMO CLASS SCHEDULED — to teacher
// ══════════════════════════════════════════════════════════════
exports.sendDemoScheduledToTeacher = (to, data) => {
  const html = base('Demo Class Scheduled', `
    <p class="greeting">Hi ${data.teacherName},</p>
    <p class="text">A demo class has been scheduled for you. Please be punctual and prepared!</p>
    <div class="highlight-box">
      <p><strong>📅 Demo Details</strong></p>
      <table class="detail-table">
        <tr><td>Student/Parent</td><td>${data.parentName}</td></tr>
        <tr><td>Class</td><td>${data.class}</td></tr>
        <tr><td>Subject</td><td>${data.subject}</td></tr>
        <tr><td>Date</td><td>${data.date}</td></tr>
        <tr><td>Time</td><td>${data.time}</td></tr>
        <tr><td>Mode</td><td>${data.mode}</td></tr>
        <tr><td>City</td><td>${data.city}</td></tr>
      </table>
    </div>
    <p class="text">✅ After the demo, update the status in your portal.</p>
    <a href="${process.env.CLIENT_URL}/teacher/demos" class="btn">View in Portal</a>
  `);
  return sendMail({ to, subject: `📅 Demo Class Scheduled — ${data.subject} on ${data.date}`, html });
};

// ══════════════════════════════════════════════════════════════
// 8. APPLICATION APPROVED — to teacher
// ══════════════════════════════════════════════════════════════
exports.sendApplicationApproved = (to, name) => {
  const html = base('Application Approved', `
    <p class="greeting">Congratulations, ${name}! 🎉</p>
    <p class="text">Your teacher application has been <strong>approved</strong> by the 75 Way Project Task team. You are now a verified 75 Way Project Task teacher!</p>
    <div class="highlight-box">
      <p>🟢 <strong>Status:</strong> <span class="status-badge status-approved">Approved</span></p>
      <p style="margin-top:12px;">You can now:</p>
      <p>✅ View tuition requests in your area<br/>✅ Express interest / not interested<br/>✅ Manage your demo classes<br/>✅ Track your earnings</p>
    </div>
    <a href="${process.env.CLIENT_URL}/teacher/dashboard" class="btn btn-green">Go to Teacher Dashboard</a>
    <p class="text" style="font-size:13px;color:#718096;margin-top:16px;">Welcome to the 75 Way Project Task family! 🙌</p>
  `);
  return sendMail({ to, subject: `🎉 Congratulations! Your 75 Way Project Task Application is Approved`, html });
};

// ══════════════════════════════════════════════════════════════
// 9. APPLICATION REJECTED — to teacher
// ══════════════════════════════════════════════════════════════
exports.sendApplicationRejected = (to, name, reason) => {
  const html = base('Application Update', `
    <p class="greeting">Hi ${name},</p>
    <p class="text">Thank you for your interest in becoming a 75 Way Project Task teacher. After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
    ${reason ? `<div class="highlight-box"><p><strong>Reason:</strong> ${reason}</p></div>` : ''}
    <p class="text">You are welcome to reapply after addressing the feedback. We encourage you to:</p>
    <p class="text">• Ensure all qualification documents are accurate<br/>• Provide a detailed teaching experience history<br/>• Add a clear professional photo</p>
    <a href="${process.env.CLIENT_URL}/become-teacher" class="btn">Reapply Now</a>
    <p class="text" style="font-size:13px;color:#718096;margin-top:16px;">Questions? Email us at support@tuitionhub.co.in</p>
  `);
  return sendMail({ to, subject: `Application Status Update — 75 Way Project Task`, html });
};

// ══════════════════════════════════════════════════════════════
// 10. TEMPORARY PASSWORD — sent by forgot-password flow
// ══════════════════════════════════════════════════════════════
const escapeHtml = (str) =>
  String(str ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

exports.sendTemporaryPassword = (to, name, tempPassword) => {
  const html = base('Your Temporary Password', `
    <p class="greeting">Hi ${escapeHtml(name || 'there')},</p>
    <p class="text">We received a request to reset your 75 Way Project Task password. A temporary password has been generated for your account:</p>
    <div class="highlight-box" style="text-align:center;">
      <p style="margin:0;font-weight:700;color:#1B2A4A;">Temporary Password</p>
      <p style="margin:8px 0 0;font-family:'Consolas','Courier New',monospace;font-size:22px;font-weight:700;letter-spacing:1px;color:#1B2A4A;">${escapeHtml(tempPassword)}</p>
    </div>
    <p class="text">Use this password to log in to your 75 Way Project Task account. After logging in, you will be asked to create a new password.</p>
    <div class="highlight-box" style="border-left-color:#F2B705;">
      <p><strong>⚠️ For your security:</strong> please change this temporary password immediately after logging in. Anyone with access to this email could use it to enter your account.</p>
    </div>
    <p class="text" style="font-size:13px;color:#718096;margin-top:16px;">If you did not request a password reset, please contact 75 Way Project Task support right away — your account may have been targeted.</p>
    <p class="text" style="font-size:13px;color:#718096;">Questions? Email us at support@tuitionhub.co.in</p>
  `);
  return sendMail({ to, subject: `75 Way Project Task — Your Temporary Password`, html });
};

// ══════════════════════════════════════════════════════════════
// 11. DEMO COMPLETED — feedback request to parent
// ══════════════════════════════════════════════════════════════
exports.sendDemoCompletedFeedback = (to, data) => {
  const html = base('Demo Class Completed', `
    <p class="greeting">Hi ${data.parentName},</p>
    <p class="text">Your demo class with <strong>${data.teacherName}</strong> is now complete! We hope it was a great experience.</p>
    <p class="text">Please share your feedback — it helps us maintain the highest quality of tutors on our platform.</p>
    <a href="${process.env.CLIENT_URL}/feedback/${data.demoId}" class="btn btn-gold">Rate Your Demo</a>
    <p class="text" style="margin-top:20px;">Would you like to continue with ${data.teacherName}? Contact us:</p>
    <p class="text">📞 <strong>+91 70090-79344</strong> &nbsp;|&nbsp; 💬 WhatsApp us</p>
  `);
  return sendMail({ to, subject: `⭐ How was your demo class? — 75 Way Project Task`, html });
};

let isConnected = false;

exports.verifyConnection = async () => {
  if (process.env.RESEND_API_KEY) {
    isConnected = true;
    console.log('✉️  Mail server configured (Resend)');
  } else {
    isConnected = false;
    console.warn('⚠️  Resend API key missing in environment variables');
  }
};

exports.isConnected = () => isConnected;
