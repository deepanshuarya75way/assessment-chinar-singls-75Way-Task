import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogActions, 
  Button, TextField, Box, Typography, MenuItem, 
  CircularProgress, IconButton, Avatar, useTheme, useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { motion, AnimatePresence } from 'framer-motion';

import { SUBJECTS, CLASSES, CITIES, TUITION_MODES } from '../../data/mockData';
import { requestsAPI } from '../../services/api';
import { useColorMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const MotionBox = motion.create(Box);

export default function RequestTutorModal({ open, onClose, tutor }) {
  const { mode } = useColorMode();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    parentName: user?.name || '',
    mobile: user?.mobile || '',
    class: '',
    subject: '',
    city: '',
    locality: '',
    mode: '',
    budget: '',
    requirements: ''
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      setStep(1);
      setError('');
      setSuccessData(null);
      setTouched({});
      // Note: we don't reset formData fully so they don't have to re-type if they just close and open again,
      // but we ensure user info is there
      setFormData(prev => ({
        ...prev,
        parentName: prev.parentName || user?.name || '',
        mobile: prev.mobile || user?.mobile || ''
      }));
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.parentName.trim()) errors.parentName = 'Required';
    if (!formData.mobile.trim()) {
      errors.mobile = 'Required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Enter valid 10-digit number';
    }
    if (!formData.class) errors.class = 'Required';
    if (!formData.subject) errors.subject = 'Required';
    if (!formData.city) errors.city = 'Required';
    if (!formData.mode) errors.mode = 'Required';
    if (!formData.locality.trim()) errors.locality = 'Required';
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async () => {
    if (!isValid) {
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payload = {
        ...formData,
        tutorId: tutor?._id // Add tutor ID if we are requesting a specific tutor
      };

      const res = await requestsAPI.create(payload);
      setSuccessData(res.data);
      setStep(2); // Success step
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You already have an active request for this tutor.");
      } else {
        setError(err.message || 'Oops! We couldn\'t send your request right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: mode === 'dark' ? '#0D1D38' : '#ffffff',
      minHeight: '56px',
      '& fieldset': {
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)',
      },
      '&:hover fieldset': {
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.24)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3B82F6',
        borderWidth: '2px'
      },
      color: mode === 'dark' ? '#F8FAFC' : 'text.primary',
    },
    '& .MuiInputLabel-root': {
      color: mode === 'dark' ? '#A9B9D1' : 'text.secondary',
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
    }
  };

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth={false}
      PaperProps={{
        sx: {
          width: { xs: 'calc(100% - 24px)', md: 'min(100% - 32px, 1050px)' },
          m: { xs: 1.5, md: 2 },
          borderRadius: '24px',
          bgcolor: mode === 'dark' ? '#07111F' : '#F6F8FC',
          overflow: 'hidden',
          boxShadow: mode === 'dark' ? '0 24px 50px rgba(0,0,0,0.5)' : '0 24px 50px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* ── HEADER ── */}
      <Box sx={{ position: 'relative', bgcolor: mode === 'dark' ? '#102B52' : '#EFF6FF', p: { xs: 3, md: 4 }, borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}>
        <IconButton onClick={handleClose} disabled={loading} sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }}>
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {tutor ? (
            <>
              <Avatar src={tutor.user?.avatar} sx={{ width: 80, height: 80, border: '4px solid #3B82F6', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', bgcolor: '#1E3A8A', objectFit: 'cover' }}>
                {tutor.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔎 Request {tutor.name}
                </Typography>
                <Typography variant="body1" sx={{ color: mode === 'dark' ? '#A9B9D1' : 'text.secondary', fontWeight: 500, fontSize: '1.05rem' }}>
                  Tell us a little about your learning needs and we'll help you get started! 🚀
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ width: 80, height: 80, borderRadius: '24px', bgcolor: '#FBBF00', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(251, 191, 0, 0.3)' }}>
                <SchoolIcon sx={{ color: '#1B2A4A', fontSize: 40 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Request Your Learning Buddy 🚀
                </Typography>
                <Typography variant="body1" sx={{ color: mode === 'dark' ? '#A9B9D1' : 'text.secondary', fontWeight: 500, fontSize: '1.05rem' }}>
                  Tell us what you need, and we'll match you with the perfect tutor! ✨
                </Typography>
              </Box>
            </>
          )}
        </Box>
        
        {/* Decorative Elements */}
        <Box sx={{ position: 'absolute', right: 80, top: 20, opacity: 0.2, fontSize: '2rem', display: { xs: 'none', md: 'block' } }}>✨</Box>
        <Box sx={{ position: 'absolute', right: 40, bottom: 20, opacity: 0.1, fontSize: '3rem', display: { xs: 'none', md: 'block' } }}>📚</Box>
        <Box sx={{ position: 'absolute', right: 120, top: 40, opacity: 0.1, fontSize: '1.5rem', fontFamily: '"Fredoka", sans-serif', fontWeight: 700, display: { xs: 'none', md: 'block' } }}>E = mc²</Box>
      </Box>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <MotionBox key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <DialogContent sx={{ p: { xs: 2, md: 4 }, position: 'relative' }}>
              
              {error && (
                <MotionBox initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} sx={{ p: 2, mb: 4, bgcolor: mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2', color: 'error.main', borderRadius: '12px', border: `1px solid ${mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#FECACA'}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ErrorIcon />
                  <Typography variant="body1" fontWeight={600}>{error}</Typography>
                </MotionBox>
              )}

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                gap: 3 
              }}>
                
                {/* ── SECTION 1: DETAILS ── */}
                <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    Student Details 👋
                  </Typography>
                </Box>

                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                  <TextField 
                    fullWidth label="Parent / Student Name *" name="parentName" 
                    value={formData.parentName} onChange={handleChange} onBlur={handleBlur}
                    error={touched.parentName && Boolean(errors.parentName)}
                    helperText={touched.parentName && errors.parentName}
                    sx={inputSx} 
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                  <TextField 
                    fullWidth label="Mobile Number *" name="mobile" 
                    value={formData.mobile} onChange={handleChange} onBlur={handleBlur}
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                    sx={inputSx} 
                  />
                </Box>

                {/* ── SECTION 2: PREFERENCES ── */}
                <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    Learning Preferences 📚
                  </Typography>
                </Box>

                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                  <TextField 
                    fullWidth select label="Class *" name="class" 
                    value={formData.class} onChange={handleChange} onBlur={handleBlur}
                    error={touched.class && Boolean(errors.class)}
                    helperText={touched.class && errors.class}
                    sx={inputSx} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: mode === 'dark' ? '#102B52' : '#fff', color: mode === 'dark' ? '#fff' : 'inherit' } } } }}
                  >
                    {CLASSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Box>
                
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                  <TextField 
                    fullWidth select label="Subject *" name="subject" 
                    value={formData.subject} onChange={handleChange} onBlur={handleBlur}
                    error={touched.subject && Boolean(errors.subject)}
                    helperText={touched.subject && errors.subject}
                    sx={inputSx} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: mode === 'dark' ? '#102B52' : '#fff', color: mode === 'dark' ? '#fff' : 'inherit' } } } }}
                  >
                    {SUBJECTS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>
                </Box>
                
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                  <TextField 
                    fullWidth select label="City *" name="city" 
                    value={formData.city} onChange={handleChange} onBlur={handleBlur}
                    error={touched.city && Boolean(errors.city)}
                    helperText={touched.city && errors.city}
                    sx={inputSx} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: mode === 'dark' ? '#102B52' : '#fff', color: mode === 'dark' ? '#fff' : 'inherit' } } } }}
                  >
                    {CITIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Box>
                
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 1' } }}>
                  <TextField 
                    fullWidth select label="Teaching Mode *" name="mode" 
                    value={formData.mode} onChange={handleChange} onBlur={handleBlur}
                    error={touched.mode && Boolean(errors.mode)}
                    helperText={touched.mode && errors.mode}
                    sx={inputSx} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: mode === 'dark' ? '#102B52' : '#fff', color: mode === 'dark' ? '#fff' : 'inherit' } } } }}
                  >
                    {TUITION_MODES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                  </TextField>
                </Box>

                {/* ── SECTION 3: NEEDS ── */}
                <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    Learning Needs ✨
                  </Typography>
                </Box>

                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                  <TextField 
                    fullWidth label="Locality / Area *" name="locality" 
                    value={formData.locality} onChange={handleChange} onBlur={handleBlur}
                    error={touched.locality && Boolean(errors.locality)}
                    helperText={touched.locality && errors.locality}
                    sx={inputSx} 
                  />
                </Box>
                
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
                  <TextField 
                    fullWidth label="Budget (Optional)" name="budget" placeholder="e.g. 5000/month or 500/hr" 
                    value={formData.budget} onChange={handleChange} 
                    sx={inputSx} 
                  />
                </Box>
                
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField 
                    fullWidth multiline rows={4} label="Specific Requirements (Optional)" name="requirements" 
                    placeholder="Tell the tutor about your goals, current level, or any special areas you want to focus on..."
                    value={formData.requirements} onChange={handleChange} 
                    sx={{
                      ...inputSx,
                      '& .MuiOutlinedInput-root': {
                        ...inputSx['& .MuiOutlinedInput-root'],
                        minHeight: '110px'
                      }
                    }} 
                  />
                </Box>

              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: { xs: 3, md: 4 }, pt: { xs: 1, md: 2 }, borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, bgcolor: mode === 'dark' ? '#07111F' : '#ffffff' }}>
              <Button onClick={handleClose} disabled={loading} sx={{ color: 'text.secondary', fontWeight: 700, px: 3, py: 1.5, borderRadius: '12px' }}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                disabled={loading || !isValid}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                sx={{ 
                  bgcolor: '#3B82F6', color: '#fff', px: { xs: 3, md: 5 }, py: 1.5, borderRadius: '50px', fontWeight: 700,
                  fontSize: '1.05rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                  '&:hover': { bgcolor: '#2563EB', boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)' },
                  '&:disabled': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)', color: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.38)', boxShadow: 'none' }
                }}
              >
                {loading ? 'Submitting...' : 'Submit Tutor Request 🚀'}
              </Button>
            </DialogActions>
          </MotionBox>
        ) : (
          <MotionBox key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <DialogContent sx={{ p: { xs: 4, md: 8 }, textAlign: 'center' }}>
              <MotionBox initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
                <CheckCircleIcon sx={{ fontSize: 120, color: '#22C55E', mb: 3, filter: 'drop-shadow(0 10px 15px rgba(34, 197, 94, 0.3))' }} />
              </MotionBox>
              <Typography variant="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, mb: 2, color: 'text.primary' }}>
                Request Sent! 🎉
              </Typography>
              <Typography variant="body1" sx={{ color: mode === 'dark' ? '#A9B9D1' : 'text.secondary', mb: 5, maxWidth: 500, mx: 'auto', fontSize: '1.2rem', lineHeight: 1.6 }}>
                Your learning adventure is getting started. We'll help you connect with the right tutor and update you very soon!
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto', mb: 5, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.primary', fontWeight: 600 }}>
                  <CheckCircleIcon sx={{ color: '#22C55E' }} /> Request received
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.primary', fontWeight: 600 }}>
                  <CheckCircleIcon sx={{ color: '#22C55E' }} /> Details saved securely
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.primary', fontWeight: 600 }}>
                  <CheckCircleIcon sx={{ color: '#22C55E' }} /> Tutor matching started
                </Box>
              </Box>

              <Button 
                variant="contained" 
                onClick={handleClose}
                sx={{ 
                  bgcolor: '#FBBF00', color: '#1B2A4A', px: 6, py: 1.5, borderRadius: '50px', fontWeight: 800,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(251, 191, 0, 0.3)',
                  '&:hover': { bgcolor: '#F59E0B', boxShadow: '0 8px 25px rgba(251, 191, 0, 0.4)' }
                }}
              >
                View My Requests
              </Button>
            </DialogContent>
          </MotionBox>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
