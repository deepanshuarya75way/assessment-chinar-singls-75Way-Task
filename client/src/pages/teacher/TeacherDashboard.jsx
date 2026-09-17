import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Avatar,
  Chip, Divider, CircularProgress, useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SchoolIcon from '@mui/icons-material/School';
import { Link } from 'react-router-dom';

import { requestsAPI, teachersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusChip from '../../components/common/StatusChip';
import { useTeacherApplication } from '../../context/TeacherApplicationContext';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { openTeacherApplication } = useTeacherApplication();
  
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, profRes] = await Promise.all([
          requestsAPI.getMyAssignments().catch(() => ({ data: [] })),
          teachersAPI.getMyProfile().catch(() => ({ data: null }))
        ]);
        setRequests(reqRes.data || []);
        setProfile(profRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, p: 1 }}>
        <Box sx={{ width: '100%', height: 180, bgcolor: 'action.hover', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
        <Box sx={{ width: '100%', display: 'flex', gap: 3 }}>
          {[1,2,3,4].map(i => <Box key={i} sx={{ flex: 1, height: 120, bgcolor: 'action.hover', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />)}
        </Box>
      </Box>
    );
  }

  const teacherName = profile?.name || user?.name || 'Teacher';

  if (!profile) {
    return (
      <Card sx={{ p: 6, textAlign: 'center', borderRadius: '24px', mt: 4, border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)' }}>
        <Typography sx={{ fontSize: '4rem', mb: 2 }}>📝</Typography>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 800, fontFamily: '"Fredoka", "Nunito", sans-serif' }}>Complete Your Application</Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          You haven't submitted your teacher application yet. Please complete the "Become a Teacher" form to start getting tuition requests.
        </Typography>
        <Button variant="contained" onClick={openTeacherApplication} sx={{ bgcolor: '#2563EB', color: '#fff', px: 4, py: 1.5, borderRadius: '20px', fontWeight: 700 }}>
          Submit Application
        </Button>
      </Card>
    );
  }

  if (profile.applicationStatus !== 'approved') {
    return (
      <Card sx={{ p: 6, textAlign: 'center', borderRadius: '24px', mt: 4, border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)' }}>
        <Typography sx={{ fontSize: '4rem', mb: 2 }}>⏳</Typography>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, fontFamily: '"Fredoka", "Nunito", sans-serif' }}>
          Welcome, {teacherName}!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: 'warning.main', fontFamily: '"Nunito", sans-serif' }}>
          Application Pending Review
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          Your teacher application is currently being reviewed by our team. Once approved, you'll be able to access your full dashboard and assignments!
        </Typography>
      </Card>
    );
  }

  const activeAssignments = requests.filter(r => ['assigned', 'demo_scheduled', 'demo_completed'].includes(r.status));
  const completedAssignments = requests.filter(r => r.status === 'closed');
  const pendingAssignments = requests.filter(r => r.status === 'pending');

  const STATS = [
    { label: 'Total Students', value: requests.length, icon: PeopleIcon, color: '#3B82F6' },
    { label: 'Active Assignments', value: activeAssignments.length, icon: AssignmentIcon, color: '#FBBF00' },
    { label: 'Completed', value: completedAssignments.length, icon: CheckCircleIcon, color: '#22C55E' },
    { label: 'Pending', value: pendingAssignments.length, icon: PendingActionsIcon, color: '#8B5CF6' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Welcome Hero */}
      <Card sx={{ 
        p: { xs: 3, md: 4 }, mb: 4, borderRadius: '24px', 
        bgcolor: isDark ? '#102344' : '#ffffff',
        boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(37,99,235,0.08)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'}`,
        position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1, pr: { md: 20 } }}>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', mb: 1 }}>
            Welcome back, <span style={{ color: isDark ? '#FBBF00' : '#2563EB' }}>{teacherName}</span> 👋
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
              Ready to make today's learning adventure amazing? 🚀
            </Typography>
            {profile?.qualification && (
              <Chip label={`🎓 ${profile.qualification}`} size="small" sx={{ fontWeight: 700, borderRadius: '8px', bgcolor: isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.08)', color: '#2563EB', fontSize: '0.75rem' }} />
            )}
            {profile?.teachingMode && (
              <Chip label={`📍 ${profile.teachingMode}`} size="small" sx={{ fontWeight: 700, borderRadius: '8px', bgcolor: isDark ? 'rgba(251,191,0,0.2)' : 'rgba(251,191,0,0.1)', color: '#FBBF00', fontSize: '0.75rem' }} />
            )}
          </Box>
        </Box>
        {/* Abstract shapes / decorations */}
        <Box sx={{ position: 'absolute', top: -30, right: -20, opacity: 0.1, transform: 'rotate(15deg)' }}>
          <SchoolIcon sx={{ fontSize: 180, color: isDark ? '#FBBF00' : '#2563EB' }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: 20, right: 120, fontSize: '3rem', opacity: isDark ? 0.8 : 1 }}>
          👨‍🏫
        </Box>
      </Card>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {STATS.map((stat, i) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.label}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <Card sx={{ 
                p: 3, borderRadius: '20px', height: '100%',
                bgcolor: isDark ? '#142B52' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(37,99,235,0.1)',
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: '"Fredoka", "Nunito", sans-serif', color: isDark ? '#fff' : '#172A4D', mb: 0.5 }}>
                  <CountUp to={stat.value} />
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {stat.label}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Columns */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 2, color: isDark ? '#fff' : '#172A4D' }}>
            My Students
          </Typography>
          {requests.length === 0 ? (
            <EmptyState message="No students have been assigned to you yet." />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {requests.slice(0, 4).map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                  <Card sx={{ 
                    p: 2.5, borderRadius: '20px', 
                    bgcolor: isDark ? '#102344' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: isDark ? '#142B52' : '#E5EDFF', color: isDark ? '#FBBF00' : '#2563EB', fontWeight: 800 }}>
                        {r.parentName?.[0] || 'S'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>
                          {r.parentName || 'Student'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          {r.class} · {r.subject} · {r.city}
                        </Typography>

                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              ))}
              {requests.length > 4 && (
                <Button component={Link} to="/teacher/students" variant="text" sx={{ fontWeight: 700 }}>
                  View All Students →
                </Button>
              )}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} lg={6}>
          <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 2, color: isDark ? '#fff' : '#172A4D' }}>
            Assignment Overview
          </Typography>
          {requests.length === 0 ? (
            <EmptyState message="Once the 75 Way Project Task team assigns students to you, they'll appear here." />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {requests.slice(0, 4).map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                  <Card sx={{ 
                    p: 2.5, borderRadius: '20px', 
                    bgcolor: isDark ? '#142B52' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{r.subject} · {r.class}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.parentName}</Typography>
                      </Box>
                      <StatusChip status={r.status} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button component={Link} to="/teacher/assignments" size="small" variant="outlined" sx={{ borderRadius: '12px', fontWeight: 700, fontSize: '0.75rem' }}>
                        View Assignment
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              ))}
              {requests.length > 4 && (
                <Button component={Link} to="/teacher/assignments" variant="text" sx={{ fontWeight: 700 }}>
                  View All Assignments →
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 2, color: isDark ? '#fff' : '#172A4D' }}>
          ⚡ Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: 'My Students', path: '/teacher/students', icon: PeopleIcon, color: '#3B82F6' },
            { label: 'My Assignments', path: '/teacher/assignments', icon: AssignmentIcon, color: '#FBBF00' },
            { label: 'My Profile', path: '/teacher/profile', icon: SchoolIcon, color: '#22C55E' },
          ].map((action) => (
            <Grid item xs={12} sm={4} key={action.label}>
              <Button component={Link} to={action.path} fullWidth variant="outlined" sx={{ 
                p: 2, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2,
                color: isDark ? '#fff' : '#172A4D', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: `${action.color}10`, borderColor: action.color }
              }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: `${action.color}20`, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <action.icon fontSize="small" />
                </Box>
                <Typography sx={{ fontWeight: 700, textTransform: 'none' }}>{action.label}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

// Simple CountUp animation component
function CountUp({ to, duration = 1 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // Easing function (easeOutQuart)
      const ease = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.floor(ease * to));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  return <span>{count}</span>;
}

const EmptyState = ({ message }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card sx={{ 
      p: 4, textAlign: 'center', borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      bgcolor: isDark ? 'rgba(16,35,68,0.5)' : 'rgba(255,255,255,0.5)',
      border: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      boxShadow: 'none'
    }}>
      <Typography sx={{ fontSize: '3rem', mb: 2, opacity: 0.8 }}>📚</Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: 250 }}>
        {message}
      </Typography>
    </Card>
  );
};
