import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Grid, Chip, CircularProgress, 
  Alert, Button, Avatar, useTheme, LinearProgress 
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import ScienceIcon from '@mui/icons-material/Science';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';

import { requestsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '../../context/ThemeContext';

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

export default function StudentDashboard() {
  const { user } = useAuth();
  const { mode } = useColorMode();
  const theme = useTheme();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const reqRes = await requestsAPI.getMyRequests();
      setRequests(reqRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const activeAssignments = requests.filter(r => r.status === 'assigned');

  const getStatusChip = (status) => {
    const config = {
      'new': { label: 'Finding Tutor', color: 'info', icon: <SearchIcon fontSize="small"/> },
      'assigned': { label: 'Learning Active', color: 'success', icon: <CheckCircleIcon fontSize="small"/> },
      'demo_scheduled': { label: 'Demo Scheduled', color: 'warning', icon: <AccessTimeFilledIcon fontSize="small"/> },
      'demo_completed': { label: 'Demo Completed', color: 'primary', icon: <StarIcon fontSize="small"/> },
      'closed': { label: 'Closed', color: 'default', icon: <CheckCircleIcon fontSize="small"/> },
    };
    const conf = config[status] || config['new'];
    return <Chip size="small" icon={conf.icon} label={conf.label} color={conf.color} sx={{ fontWeight: 600 }} />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#FBBF00', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.secondary', fontFamily: '"Fredoka", sans-serif' }}>
          Loading your learning adventure...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* ── HERO SECTION ── */}
      <MotionBox 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          position: 'relative', overflow: 'hidden',
          bgcolor: mode === 'dark' ? '#0D1D38' : '#2563EB',
          color: '#fff', borderRadius: '24px', p: { xs: 3, md: 5 }, mb: 4,
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'
        }}
      >
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'rotate(15deg)' }}>
          <ScienceIcon sx={{ fontSize: 200 }} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: -10, left: 20, opacity: 0.1, transform: 'rotate(-15deg)' }}>
          <AutoStoriesIcon sx={{ fontSize: 150 }} />
        </Box>

        <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 600, mb: 1 }}>
              Hey {user?.name?.split(' ')[0] || 'Buddy'}! 👋
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, mb: 3, fontFamily: '"Nunito", sans-serif' }}>
              Ready for your next learning adventure? 🚀
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/student/find-tutor')}
              sx={{ 
                bgcolor: '#FBBF00', color: '#1B2A4A', 
                fontWeight: 'bold', px: 4, py: 1.5, borderRadius: '50px',
                '&:hover': { bgcolor: '#F59E0B' }
              }}
            >
              Find a New Tutor
            </Button>
          </Grid>
        </Grid>
      </MotionBox>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

      {/* ── QUICK STATS ── */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Active Assignments', value: activeAssignments.length, icon: <AssignmentIcon />, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Total Requests', value: requests.length, icon: <EmojiEventsIcon />, color: '#8B5CF6', bg: '#EDE9FE' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <MotionCard 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              sx={{ 
                p: 3, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 2,
                boxShadow: mode === 'dark' ? 'none' : '0 4px 20px rgba(0,0,0,0.03)',
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff'
              }}
            >
              <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: mode === 'dark' ? `${stat.color}33` : stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', '& > svg': { fontSize: 32 } }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Fredoka", sans-serif', color: 'text.primary', lineHeight: 1.2 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Box>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* ── RECENT MISSIONS ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Fredoka", sans-serif' }}>
          📚 Recent Learning Missions
        </Typography>
        {requests.length > 0 && (
          <Button component={Link} to="/student/assignments" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600 }}>
            View All
          </Button>
        )}
      </Box>

      {requests.length === 0 ? (
        <Card sx={{ 
          p: 6, textAlign: 'center', borderRadius: '24px',
          bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fff',
          border: '2px dashed', borderColor: 'divider', boxShadow: 'none'
        }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.lighter', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', mb: 1 }}>No missions yet!</Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            You haven't requested any tutors yet. Let's start your first learning mission!
          </Typography>
          <Button variant="contained" component={Link} to="/student/find-tutor" size="large" sx={{ borderRadius: 10, px: 4, fontWeight: 'bold' }}>
            Find a Tutor 🚀
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {requests.slice(0, 4).map((req, i) => (
            <Grid item xs={12} md={6} key={req._id}>
              <MotionCard 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + (i * 0.1) }}
                sx={{ 
                  p: 0, borderRadius: '20px', overflow: 'hidden',
                  boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff'
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Fredoka", sans-serif', mb: 0.5 }}>
                      {req.subject}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: mode === 'dark' ? '#1E293B' : '#F1F5F9' }}>
                        Class {req.class}
                      </span>
                      • {req.mode}
                    </Typography>
                  </Box>
                  {getStatusChip(req.status)}
                </Box>
                
                {req.assignedTeacher ? (
                  <Box sx={{ p: 3, bgcolor: mode === 'dark' ? 'rgba(16, 185, 129, 0.05)' : '#F0FDF4' }}>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5, display: 'block' }}>
                      ✨ Your Learning Buddy
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={req.assignedTeacher.user?.avatar} sx={{ width: 50, height: 50, border: '2px solid #10B981' }}>
                        {req.assignedTeacher.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{req.assignedTeacher.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{req.assignedTeacher.qualification}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 3, bgcolor: mode === 'dark' ? 'rgba(37, 99, 235, 0.05)' : '#EFF6FF' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                      {req.status === 'new' ? "We're finding the perfect learning buddy for you..." : "Demo is being scheduled..."}
                    </Typography>
                    <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                )}
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
