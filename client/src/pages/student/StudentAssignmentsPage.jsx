import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Chip, CircularProgress, 
  Alert, Avatar, Divider, Tabs, Tab, Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

import { requestsAPI } from '../../services/api';
import { useColorMode } from '../../context/ThemeContext';
import { CuriousGirl } from '../../components/home/CharacterFamily';
import TutorDetailModal from '../../components/student/TutorDetailModal';

export default function StudentAssignmentsPage() {
  const { mode } = useColorMode();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await requestsAPI.getMyRequests();
      setRequests(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'new': { label: 'Finding Tutor', color: 'info', icon: <AccessTimeFilledIcon fontSize="small"/> },
      'assigned': { label: 'Assigned', color: 'success', icon: <CheckCircleIcon fontSize="small"/> },
      'demo_scheduled': { label: 'Demo Scheduled', color: 'warning', icon: <AccessTimeFilledIcon fontSize="small"/> },
      'demo_completed': { label: 'Demo Completed', color: 'primary', icon: <StarIcon fontSize="small"/> },
      'closed': { label: 'Closed', color: 'default', icon: <ErrorIcon fontSize="small"/> },
    };
    return configs[status] || configs['new'];
  };

  const filteredRequests = requests.filter(req => {
    if (tab === 0) return true; // All
    if (tab === 1) return req.status === 'assigned';
    if (tab === 2) return req.status === 'new' || req.status === 'demo_scheduled';
    if (tab === 3) return req.status === 'closed' || req.status === 'demo_completed';
    return true;
  });

  const handleOpenTutor = (tutor) => {
    if (tutor) {
      setSelectedTutor(tutor);
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#FBBF00', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.secondary', fontFamily: '"Fredoka", sans-serif' }}>
          Loading your missions...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* 🌟 HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '16px', bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary' }}>
            My Assignments
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Track all your tuition requests and learning buddies
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

      {/* 🎯 TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { fontWeight: 700, fontFamily: '"Nunito", sans-serif', textTransform: 'none', fontSize: '1rem', minWidth: 100 },
            '& .Mui-selected': { color: '#2563EB' },
            '& .MuiTabs-indicator': { bgcolor: '#2563EB', height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          <Tab label="All Missions" />
          <Tab label="Active" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      {/* 📚 ASSIGNMENT CARDS */}
      <AnimatePresence mode="wait">
        {filteredRequests.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Box sx={{ textAlign: 'center', py: 8, px: 2, bgcolor: mode === 'dark' ? '#0B1F44' : '#FFFFFF', borderRadius: '32px', border: `2px dashed ${mode === 'dark' ? '#1E3A8A' : '#93C5FD'}` }}>
              <CuriousGirl width={140} height={180} />
              <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, mt: 3, mb: 1 }}>
                No assignments found!
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                You don't have any missions in this category yet.
              </Typography>
              {tab === 0 && (
                <Button variant="contained" component={Link} to="/student/find-tutor" sx={{ borderRadius: '12px', px: 4, bgcolor: '#FBBF00', color: '#1B2A4A', fontWeight: 700, '&:hover': { bgcolor: '#F59E0B' } }}>
                  Find a Tutor 🚀
                </Button>
              )}
            </Box>
          </motion.div>
        ) : (
          <Box key="grid" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
            {filteredRequests.map((req, idx) => {
              const statusConf = getStatusConfig(req.status);
              return (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card elevation={0} sx={{
                    height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px',
                    bgcolor: mode === 'dark' ? '#102344' : '#FFFFFF', 
                    border: `2px solid ${mode === 'dark' ? 'rgba(96,165,250,0.1)' : '#E2E8F0'}`,
                    transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)', borderColor: '#3B82F6' }
                  }}>
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Request ID: {req._id.toString().slice(-6).toUpperCase()}
                          </Typography>
                          <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, mt: 0.5 }}>
                            {req.subject}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <SchoolIcon sx={{ fontSize: 16 }} /> Class {req.class} • {req.mode}
                          </Typography>
                        </Box>
                        <Chip size="small" icon={statusConf.icon} label={statusConf.label} color={statusConf.color} sx={{ fontWeight: 600 }} />
                      </Box>
                      
                      <Box sx={{ bgcolor: mode === 'dark' ? '#0B1830' : '#F6F8FC', p: 2, borderRadius: '16px', mb: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>City</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}><LocationOnIcon sx={{ fontSize: 14 }}/> {req.city}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Locality</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{req.locality}</Typography>
                          </Grid>
                          {req.budget && (
                            <Grid item xs={12}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Budget</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{req.budget}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>

                      {req.assignedTeacher ? (
                        <Box sx={{ p: 2, borderRadius: '16px', bgcolor: mode === 'dark' ? 'rgba(16, 185, 129, 0.05)' : '#F0FDF4', border: '1px solid', borderColor: mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5' }}>
                          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                            ✨ Assigned Buddy
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar src={req.assignedTeacher.user?.avatar} sx={{ width: 40, height: 40, border: '2px solid #10B981' }}>
                                {req.assignedTeacher.name?.[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{req.assignedTeacher.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{req.assignedTeacher.qualification}</Typography>
                              </Box>
                            </Box>
                            <Button size="small" variant="outlined" color="success" sx={{ borderRadius: '10px', fontWeight: 700 }} onClick={() => handleOpenTutor(req.assignedTeacher)}>
                              View
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ p: 2, borderRadius: '16px', bgcolor: mode === 'dark' ? 'rgba(251, 191, 0, 0.05)' : '#FFFBEB', border: '1px dashed', borderColor: mode === 'dark' ? 'rgba(251, 191, 0, 0.3)' : '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: mode === 'dark' ? '#FDE68A' : '#D97706', fontWeight: 600 }}>
                            Still searching for the perfect buddy...
                          </Typography>
                          <CircularProgress size={20} sx={{ color: '#FBBF00' }} />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        )}
      </AnimatePresence>

      <TutorDetailModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        tutor={selectedTutor} 
      />
    </Box>
  );
}
