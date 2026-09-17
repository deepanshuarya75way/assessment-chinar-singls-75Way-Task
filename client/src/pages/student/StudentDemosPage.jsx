import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Grid, Chip, CircularProgress, 
  Alert, Avatar, Divider, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';

import { demosAPI } from '../../services/api';
import { useColorMode } from '../../context/ThemeContext';
import { CuriousBoy } from '../../components/home/CharacterFamily';

export default function StudentDemosPage() {
  const { mode } = useColorMode();
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const res = await demosAPI.getMyDemos();
      setDemos(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch demo classes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDemo = (demo) => {
    setSelectedDemo(demo);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#FBBF00', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.secondary', fontFamily: '"Fredoka", sans-serif' }}>
          Loading your scheduled classes...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* 🌟 HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '16px', bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CalendarMonthIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary' }}>
            My Demo Classes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Upcoming and past introductory sessions with your tutors
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

      <AnimatePresence mode="wait">
        {demos.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Box sx={{ textAlign: 'center', py: 8, px: 2, bgcolor: mode === 'dark' ? '#0B1F44' : '#FFFFFF', borderRadius: '32px', border: `2px dashed ${mode === 'dark' ? '#1E3A8A' : '#93C5FD'}` }}>
              <CuriousBoy width={140} height={180} />
              <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, mt: 3, mb: 1 }}>
                No demos scheduled yet!
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                When a tutor accepts your request, they will schedule a demo class here.
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <Box key="grid" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
            {demos.map((demo, idx) => {
              const isOnline = demo.request?.mode?.toLowerCase() === 'online';
              const dateStr = new Date(demo.scheduledDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
              
              return (
                <motion.div key={demo._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card elevation={0} sx={{
                    height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px',
                    bgcolor: mode === 'dark' ? '#102344' : '#FFFFFF', 
                    border: `2px solid ${mode === 'dark' ? 'rgba(96,165,250,0.1)' : '#E2E8F0'}`,
                    transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)', borderColor: '#FBBF00' }
                  }}>
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ bgcolor: mode === 'dark' ? 'rgba(251,191,0,0.1)' : '#FFFBEB', color: '#D97706', p: 1, borderRadius: '12px', textAlign: 'center', minWidth: 60 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', textTransform: 'uppercase', lineHeight: 1 }}>{new Date(demo.scheduledDate).toLocaleString('en-IN', { month: 'short' })}</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1, mt: 0.5 }}>{new Date(demo.scheduledDate).getDate()}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, lineHeight: 1.2 }}>
                              {demo.request?.subject || 'Demo Class'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <AccessTimeFilledIcon sx={{ fontSize: 16 }} /> {demo.scheduledTime}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          size="small" 
                          icon={demo.status === 'completed' ? <CheckCircleIcon /> : <CalendarMonthIcon />} 
                          label={demo.status === 'completed' ? 'Completed' : demo.status === 'cancelled' ? 'Cancelled' : 'Scheduled'} 
                          color={demo.status === 'completed' ? 'success' : demo.status === 'cancelled' ? 'error' : 'warning'} 
                          sx={{ fontWeight: 600 }} 
                        />
                      </Box>
                      
                      <Box sx={{ p: 2, borderRadius: '16px', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#F9FAFB', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={demo.teacher?.photo} sx={{ width: 48, height: 48, border: '2px solid #3B82F6' }}>
                            {demo.teacherName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Tutor</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{demo.teacherName}</Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Button 
                        fullWidth 
                        variant="outlined" 
                        color="inherit" 
                        onClick={() => handleOpenDemo(demo)}
                        sx={{ borderRadius: '12px', fontWeight: 700, borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Box>
        )}
      </AnimatePresence>

      {/* DEMO DETAILS MODAL */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', bgcolor: mode === 'dark' ? '#0D1D38' : '#ffffff' } }}
      >
        {selectedDemo && (
          <>
            <Box sx={{ position: 'relative', bgcolor: mode === 'dark' ? '#102B52' : '#EFF6FF', p: 3, textAlign: 'center' }}>
              <IconButton onClick={() => setModalOpen(false)} sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary' }}>
                <CloseIcon />
              </IconButton>
              
              <Box sx={{ width: 64, height: 64, mx: 'auto', borderRadius: '16px', bgcolor: '#FBBF00', color: '#1B2A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AutoAwesomeIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary' }}>
                Demo Class Details
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                {selectedDemo.request?.subject} (Class {selectedDemo.request?.class})
              </Typography>
            </Box>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Date & Time</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {new Date(selectedDemo.scheduledDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedDemo.scheduledTime}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Tutor</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedDemo.teacherName}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 1 }}>Location / Meeting Link</Typography>
                  <Box sx={{ p: 2, borderRadius: '12px', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F6F8FC', display: 'flex', alignItems: 'center', gap: 2 }}>
                    {selectedDemo.meetLink ? (
                      <>
                        <VideocamIcon sx={{ color: '#3B82F6' }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>Online Meeting</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>{selectedDemo.meetLink}</Typography>
                        </Box>
                        <Button variant="contained" size="small" href={selectedDemo.meetLink} target="_blank" sx={{ borderRadius: '8px', bgcolor: '#3B82F6', fontWeight: 700 }}>Join</Button>
                      </>
                    ) : (
                      <>
                        <LocationOnIcon sx={{ color: '#F59E0B' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedDemo.address || 'Address will be provided'}</Typography>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
