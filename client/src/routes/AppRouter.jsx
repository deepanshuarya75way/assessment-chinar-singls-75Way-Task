import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import TeacherLayout from '../layouts/TeacherLayout';

import HomePage from '../pages/public/HomePage';
import FindTutorPage from '../pages/public/FindTutorPage';
import AboutPage from '../pages/public/AboutPage';
import LoginPage from '../pages/auth/LoginPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentRequestsPage from '../pages/admin/StudentRequestsPage';
import TeacherApplicationsPage from '../pages/admin/TeacherApplicationsPage';
import TeachersPage from '../pages/admin/TeachersPage';
import AllUsersPage from '../pages/admin/AllUsersPage';
import SettingsPage from '../pages/admin/SettingsPage';

import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import MyStudentsPage from '../pages/teacher/MyStudentsPage';
import MyAssignmentsPage from '../pages/teacher/MyAssignmentsPage';
import TeacherProfilePage from '../pages/teacher/TeacherProfilePage';
import TeacherSettingsPage from '../pages/teacher/TeacherSettingsPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentFindTutorPage from '../pages/student/StudentFindTutorPage';
import StudentAssignmentsPage from '../pages/student/StudentAssignmentsPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import StudentSettingsPage from '../pages/student/StudentSettingsPage';
import StudentLayout from '../layouts/StudentLayout';

import NotFoundPage from '../pages/NotFoundPage';

import TeacherApplicationModal from '../components/common/TeacherApplicationModal';

// Protected route wrapper
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <TeacherApplicationModal />
      <Routes>
        {/* ── PUBLIC ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-tutor" element={<FindTutorPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* ── AUTH ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/teacher/login" element={<LoginPage />} />
        </Route>

        {/* ── ADMIN (protected) ── */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="requests" element={<StudentRequestsPage />} />
          <Route path="applications" element={<TeacherApplicationsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="users" element={<AllUsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ── TEACHER (protected) ── */}
        <Route path="/teacher" element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<MyStudentsPage />} />
          <Route path="assignments" element={<MyAssignmentsPage />} />
          <Route path="profile" element={<TeacherProfilePage />} />
          <Route path="settings" element={<TeacherSettingsPage />} />
        </Route>

        {/* ── STUDENT (protected) ── */}
        <Route path="/student" element={
          <ProtectedRoute roles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="find-tutor" element={<StudentFindTutorPage />} />
          <Route path="assignments" element={<StudentAssignmentsPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="settings" element={<StudentSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
