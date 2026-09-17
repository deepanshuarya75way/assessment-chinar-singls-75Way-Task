import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Button, TextField,
  MenuItem, Chip, Divider, useTheme, FormControl, InputLabel, Select
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';

import { SUBJECTS, CLASSES, CITIES, TUITION_MODES } from '../../data/mockData';
import { teachersAPI } from '../../services/api';

import { CuriousBoy, CuriousGirl, FriendlyTutor, ParentMom, ParentDad } from '../../components/home/CharacterFamily';
import RequestTutorModal from '../../components/student/RequestTutorModal';

// Map tutor names to a consistent human avatar
const getTutorAvatar = (name, isDark) => {
  const safeName = name || "Tutor";
  const sum = safeName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const type = sum % 3;
  const colors = [
    isDark ? '#0B1830' : '#DBEAFE', // Blue
    isDark ? '#102344' : '#D1FAE5', // Green
    isDark ? '#142B52' : '#F3E8FF', // Purple
    isDark ? '#07111F' : '#FEF3C7', // Yellow
  ];
  const color = colors[sum % colors.length];

  return (
    <Box sx={{ 
      width: 100, height: 100, borderRadius: '50%', bgcolor: color, 
      border: `3px solid ${isDark ? 'rgba(96,165,250,0.3)' : '#FDE68A'}`, 
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', 
      overflow: 'hidden', flexShrink: 0, 
      boxShadow: isDark ? '0 0 15px rgba(96,165,250,0.15)' : '0 8px 20px rgba(0,0,0,0.1)' 
    }}>
      {type === 0 && <FriendlyTutor width={95} height={115} sx={{ mb: -1 }} />}
      {type === 1 && <ParentMom width={95} height={115} sx={{ mb: -1 }} />}
      {type === 2 && <ParentDad width={95} height={115} sx={{ mb: -1 }} />}
    </Box>
  );
};

export default function StudentFindTutorPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [filters, setFilters] = useState({ search: '', subject: '', city: '', mode: '' });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, [filters]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await teachersAPI.getAll(filters);
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => setFilters({ search: '', subject: '', city: '', mode: '' });

  const handleRequestTutor = (tutor) => {
    setSelectedTutor(tutor);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTutor(null);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* 🌟 PAGE HERO */}
      <Box sx={{ bgcolor: isDark ? 'rgba(251, 191, 0, 0.05)' : '#FFF7D6', p: 4, borderRadius: '24px', mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${isDark ? 'rgba(251,191,0,0.2)' : '#FDE68A'}`, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
          <Typography variant="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', mb: 2 }}>
            Find Your <span style={{ color: '#2563EB' }}>Learning Buddy!</span>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600, fontSize: '1.1rem' }}>
            Meet friendly, verified tutors who can make learning easier, happier and more fun. Let the educational adventure begin!
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative', zIndex: 2 }}>
          <FriendlyTutor width={140} height={180} />
          <CuriousGirl width={120} height={160} />
        </Box>
      </Box>

      {/* 🔎 TUTOR FINDER PANEL */}
      <Card elevation={0} sx={{ borderRadius: '24px', bgcolor: isDark ? '#0B1F44' : '#FFFFFF', border: `2px solid ${isDark ? '#102A50' : '#E2E8F0'}`, mb: 6 }}>
        <Box sx={{ bgcolor: isDark ? '#102A50' : '#FFFDF5', py: 2, px: 3, borderTopLeftRadius: '22px', borderTopRightRadius: '22px', borderBottom: `1px dashed ${isDark ? '#1E3A8A' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>🧭</span> Search Filters
          </Typography>
          <Button onClick={fetchTeachers} sx={{ color: '#FBBF00', fontWeight: 700, textTransform: 'none' }}>
            ✨ Refresh
          </Button>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '3fr 2fr 2fr 2fr 2fr' }, gap: 2, alignItems: 'center' }}>
            <Box sx={{ gridColumn: { sm: 'span 2', md: 'span 1' } }}>
              <TextField fullWidth size="medium" placeholder="🔍 Search tutors..."
                value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: isDark ? '#07111F' : '#F6F8FC', fontFamily: '"Nunito", sans-serif' } }}
              />
            </Box>
            {[
              { label: '📚 Subject', key: 'subject', options: SUBJECTS },
              { label: '📍 City', key: 'city', options: CITIES },
              { label: '🏠 Mode', key: 'mode', options: TUITION_MODES },
            ].map(({ label, key, options }) => (
              <Box key={key}>
                <FormControl fullWidth size="medium">
                  <InputLabel id={`${key}-label`} sx={{ px: 0.5, fontFamily: '"Nunito", sans-serif', fontWeight: 700, mt: -0.2 }}>{label}</InputLabel>
                  <Select
                    labelId={`${key}-label`} value={filters[key]} label={label}
                    onChange={(e) => setFilters(p => ({ ...p, [key]: e.target.value }))}
                    sx={{ borderRadius: '12px', bgcolor: isDark ? '#07111F' : '#F6F8FC', fontFamily: '"Nunito", sans-serif' }}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
            ))}
            <Box sx={{ gridColumn: { sm: 'span 2', md: 'span 1' } }}>
              <Button variant="outlined" fullWidth size="large" onClick={clearFilters} startIcon={<RestartAltIcon />}
                sx={{ borderRadius: '12px', fontWeight: 700, fontFamily: '"Fredoka", sans-serif', borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                Clear
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 👩‍🏫 TUTOR CARDS GRID */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
              <AutoAwesomeIcon sx={{ fontSize: 50, color: '#FBBF00' }} />
            </motion.div>
            <Typography variant="h6" sx={{ mt: 2, fontFamily: '"Fredoka", sans-serif', fontWeight: 700 }}>Finding buddies...</Typography>
          </motion.div>
        ) : teachers.length > 0 ? (
          <Box key="results" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
            {teachers.map((tutor, idx) => (
              <motion.div
                key={tutor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card elevation={0} sx={{
                  height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px',
                  bgcolor: isDark ? '#102344' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(96,165,250,0.2)' : '#E2E8F0'}`,
                  transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)' }
                }}>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box className="avatar-box">{getTutorAvatar(tutor.name, isDark)}</Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700 }}>{tutor.name}</Typography>
                          {tutor.applicationStatus === 'approved' && <VerifiedIcon sx={{ color: '#3B82F6', fontSize: 20 }} />}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 16 }} /> {tutor.cities?.[0] || 'Remote'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip size="small" icon={<StarIcon sx={{ color: '#FBBF00 !important' }} />} label={tutor.rating || '4.9'} sx={{ bgcolor: 'rgba(251,191,0,0.1)', color: isDark ? '#FDE68A' : '#D97706', fontWeight: 800 }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>🎓 {tutor.experience || '3+ Years'}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ bgcolor: isDark ? '#0B1830' : '#F6F8FC', p: 2, borderRadius: '16px', mb: 2 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {(tutor.subjects || []).slice(0, 3).map(s => <Chip key={s} label={s} size="small" sx={{ fontWeight: 600, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#fff' }} />)}
                        {(tutor.subjects || []).length > 3 && <Chip label={`+${tutor.subjects.length - 3}`} size="small" />}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 16, color: '#3B82F6' }} /> Classes: {(tutor.classes || []).join(', ')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      <Chip label={`🏠 ${tutor.teachingMode || 'Online & Home'}`} size="small" sx={{ bgcolor: 'transparent', border: `1px dashed ${isDark ? '#334155' : '#CBD5E1'}`, fontWeight: 600 }} />
                    </Box>
                    
                    <Box sx={{ mt: 'auto' }}>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: '"Fredoka", sans-serif' }}>
                          {tutor.expectedFee || '₹500/hr'}
                        </Typography>
                        <Button 
                          variant="contained" 
                          endIcon={<RocketLaunchIcon />}
                          onClick={() => handleRequestTutor(tutor)}
                          sx={{ borderRadius: '12px', px: 3, fontWeight: 700, fontFamily: '"Fredoka", sans-serif', bgcolor: '#FBBF00', color: '#1B2A4A', '&:hover': { bgcolor: '#F59E0B' } }}
                        >
                          Request Tutor
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, px: 2, bgcolor: isDark ? '#0B1F44' : '#FFFFFF', borderRadius: '24px', border: `2px dashed ${isDark ? '#1E3A8A' : '#93C5FD'}` }}>
            <CuriousBoy width={150} height={180} />
            <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, mt: 2, mb: 1 }}>Hmm... Let's Try Again!</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>No tutors match your exact filters. Try changing your search!</Typography>
            <Button variant="contained" onClick={clearFilters} startIcon={<RestartAltIcon />} sx={{ borderRadius: '12px', px: 3, bgcolor: '#FBBF00', color: '#1B2A4A', fontWeight: 700 }}>Reset Filters</Button>
          </Box>
        )}
      </AnimatePresence>

      <RequestTutorModal 
        open={modalOpen} 
        onClose={handleModalClose} 
        tutor={selectedTutor} 
      />
    </Box>
  );
}
