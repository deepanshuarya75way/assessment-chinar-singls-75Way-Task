// Shared mock data for 75 Way Project Task UI
export const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Economics', 'Accountancy', 'Sanskrit'];

export const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 12 (Science)', 'Class 12 (Commerce)', 'NEET', 'JEE', 'UPSC', 'SSC'];

export const TUITION_MODES = ['Home Tuition', 'Online', 'Group Classes'];

export const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Chandigarh'];

export const STATUS_COLORS = {
  new: 'info',
  contacted: 'secondary',
  interested: 'success',
  not_interested: 'default',
  assigned: 'success',
  demo_scheduled: 'warning',
  completed: 'success',
  pending: 'warning',
  rejected: 'error',
  approved: 'success',
  active: 'success',
};

export const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  not_interested: 'Not Interested',
  assigned: 'Assigned',
  demo_scheduled: 'Demo Scheduled',
  completed: 'Completed',
  pending: 'Pending',
  rejected: 'Rejected',
  approved: 'Approved',
  active: 'Active',
};

export const mockStudentRequests = [
  { id: 1, parentName: 'Ramesh Gupta', mobile: '9876543210', city: 'Delhi', locality: 'Lajpat Nagar', class: 'Class 10', subject: 'Mathematics', mode: 'Home Tuition', status: 'new', date: '2024-01-15', assignedTeacher: null, budget: '₹2000/mo' },
  { id: 2, parentName: 'Priya Sharma', mobile: '9812345678', city: 'Delhi', locality: 'Dwarka', class: 'Class 12 (Science)', subject: 'Physics', mode: 'Online', status: 'assigned', date: '2024-01-14', assignedTeacher: 'Dr. Ankit Verma', budget: '₹3000/mo' },
  { id: 3, parentName: 'Suresh Kumar', mobile: '9898989898', city: 'Mumbai', locality: 'Andheri', class: 'Class 9', subject: 'English', mode: 'Home Tuition', status: 'demo_scheduled', date: '2024-01-13', assignedTeacher: 'Ms. Priya Kapoor', budget: '₹2500/mo' },
  { id: 4, parentName: 'Neha Patel', mobile: '9797979797', city: 'Jaipur', locality: 'Malviya Nagar', class: 'NEET', subject: 'Biology', mode: 'Home Tuition', status: 'contacted', date: '2024-01-12', assignedTeacher: null, budget: '₹5000/mo' },
  { id: 5, parentName: 'Vikram Singh', mobile: '9696969696', city: 'Delhi', locality: 'Rohini', class: 'Class 7', subject: 'Mathematics', mode: 'Home Tuition', status: 'completed', date: '2024-01-10', assignedTeacher: 'Mr. Sanjay Rao', budget: '₹1500/mo' },
  { id: 6, parentName: 'Anjali Mehta', mobile: '9595959595', city: 'Bangalore', locality: 'Koramangala', class: 'Class 11 (Commerce)', subject: 'Accountancy', mode: 'Online', status: 'new', date: '2024-01-11', assignedTeacher: null, budget: '₹2200/mo' },
];

export const mockTeacherApplications = [
  { id: 1, name: 'Dr. Ankit Verma', mobile: '9111111111', email: 'ankit@email.com', qualification: 'B.Tech (IIT Delhi)', subjects: ['Mathematics', 'Physics'], classes: ['Class 9', 'Class 10', 'Class 11 (Science)', 'JEE'], mode: 'Both', city: 'Delhi', status: 'approved', date: '2024-01-10', experience: '5 years', photo: null },
  { id: 2, name: 'Ms. Priya Kapoor', mobile: '9222222222', email: 'priya@email.com', qualification: 'M.A. (English)', subjects: ['English', 'Hindi'], classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], mode: 'Home Tuition', city: 'Mumbai', status: 'approved', date: '2024-01-08', experience: '3 years', photo: null },
  { id: 3, name: 'Mr. Rajesh Mishra', mobile: '9333333333', email: 'rajesh@email.com', qualification: 'MBBS + M.Sc Biology', subjects: ['Biology', 'Chemistry'], classes: ['Class 11 (Science)', 'Class 12 (Science)', 'NEET'], mode: 'Online', city: 'Delhi', status: 'pending', date: '2024-01-14', experience: '7 years', photo: null },
  { id: 4, name: 'Ms. Kavita Rao', mobile: '9444444444', email: 'kavita@email.com', qualification: 'B.Com + CA', subjects: ['Accountancy', 'Economics'], classes: ['Class 11 (Commerce)', 'Class 12 (Commerce)'], mode: 'Both', city: 'Bangalore', status: 'pending', date: '2024-01-15', experience: '4 years', photo: null },
  { id: 5, name: 'Mr. Sanjay Rao', mobile: '9555555555', email: 'sanjay@email.com', qualification: 'M.Sc Mathematics', subjects: ['Mathematics'], classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], mode: 'Home Tuition', city: 'Delhi', status: 'rejected', date: '2024-01-05', experience: '2 years', photo: null },
];

export const mockDemoClasses = [
  { id: 1, student: 'Suresh Kumar', teacher: 'Ms. Priya Kapoor', subject: 'English', class: 'Class 9', date: '2024-01-20', time: '4:00 PM', mode: 'Home Tuition', status: 'demo_scheduled', city: 'Mumbai' },
  { id: 2, student: 'Neha Patel', teacher: 'Mr. Rajesh Mishra', subject: 'Biology', class: 'NEET', date: '2024-01-21', time: '6:00 PM', mode: 'Online', status: 'pending', city: 'Jaipur' },
  { id: 3, student: 'Anjali Mehta', teacher: 'Ms. Kavita Rao', subject: 'Accountancy', class: 'Class 11 (Commerce)', date: '2024-01-18', time: '5:00 PM', mode: 'Online', status: 'completed', city: 'Bangalore' },
];

export const mockKPIs = {
  newRequests: 0,
  newApplications: 0,
  assignedTeachers: 0,
  pendingFollowups: 0,
  demoClasses: 0,
  whatsappSent: 0,
};

export const mockWhatsappLogs = [];

export const TESTIMONIALS = [];

export const HOW_IT_WORKS = [
  { step: 1, title: 'Submit Request', desc: 'Tell us what subject, class level, and city. Takes less than 2 minutes.', icon: 'Search' },
  { step: 2, title: 'Get Matched', desc: 'Our team reviews your request and matches you with verified, experienced tutors.', icon: 'People' },
  { step: 3, title: 'Schedule Demo', desc: 'Meet your tutor for a free demo class with no commitment required.', icon: 'CalendarMonth' },
  { step: 4, title: 'Start Learning', desc: 'Happy with the tutor? Begin regular sessions and track your progress.', icon: 'CheckCircle' },
];
