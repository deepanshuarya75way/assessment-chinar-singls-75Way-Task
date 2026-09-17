import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Button, TextField,
  MenuItem, Chip, Divider, InputAdornment, useTheme, CircularProgress,
  FormControl, InputLabel, Select
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
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { SUBJECTS, CLASSES, CITIES, TUITION_MODES } from '../../data/mockData';
import { teachersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Import our beautiful anime human characters!
import { CuriousBoy, CuriousGirl, FriendlyTutor, ParentMom, ParentDad, AchievementStar } from '../../components/home/CharacterFamily';

// Floating Educational Formulas & Doodles
const Doodles = ({ isDark }) => (
  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0, opacity: isDark ? 0.2 : 0.4 }}>
    <Typography sx={{ position: 'absolute', top: '15%', left: '8%', fontFamily: '"Comic Sans MS", cursive', fontSize: '1.5rem', color: isDark ? '#60A5FA' : '#2563EB', transform: 'rotate(-15deg)' }}>E = mc²</Typography>
    <Typography sx={{ position: 'absolute', top: '25%', right: '12%', fontFamily: '"Comic Sans MS", cursive', fontSize: '1.2rem', color: isDark ? '#FBBF00' : '#F59E0B', transform: 'rotate(10deg)' }}>a² + b² = c²</Typography>
    <Typography sx={{ position: 'absolute', top: '65%', left: '15%', fontFamily: '"Comic Sans MS", cursive', fontSize: '1.4rem', color: isDark ? '#A78BFA' : '#8B5CF6', transform: 'rotate(-5deg)' }}>H₂O</Typography>
    <Typography sx={{ position: 'absolute', top: '45%', right: '8%', fontFamily: '"Comic Sans MS", cursive', fontSize: '1.3rem', color: isDark ? '#34D399' : '#10B981', transform: 'rotate(20deg)' }}>πr²</Typography>
    <Typography sx={{ position: 'absolute', top: '80%', right: '20%', fontFamily: '"Comic Sans MS", cursive', fontSize: '1.6rem', color: isDark ? '#F472B6' : '#EC4899', transform: 'rotate(-10deg)' }}>2 + 2 = 4</Typography>
  </Box>
);

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

export default function FindTutorPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ search: '', subject: '', city: '', mode: '' });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Box sx={{ bgcolor: isDark ? '#06111F' : '#F6F8FC', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* 🌟 PAGE HERO: Learning Adventure */}
      <Box sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 12 }, position: 'relative' }}>
        <Doodles isDark={isDark} />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ color: '#FBBF00 !important' }} />}
                  label="✨ Let's Find Your Learning Buddy!"
                  sx={{ bgcolor: isDark ? 'rgba(251, 191, 0, 0.15)' : '#FFF7D6', color: isDark ? '#FBBF00' : '#D97706', fontWeight: 800, fontFamily: '"Fredoka", sans-serif', mb: 3, px: 1, py: 2.5, borderRadius: '20px', fontSize: '1rem', border: `2px solid ${isDark ? 'rgba(251,191,0,0.3)' : '#FDE68A'}` }}
                />
                <Typography variant="h1" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 900, color: 'text.primary', fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }, lineHeight: 1.1, mb: 3 }}>
                  🔎 Find Your Perfect <span style={{ color: '#2563EB' }}>Tutor</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '1.1rem', md: '1.25rem' }, fontFamily: '"Nunito", sans-serif', fontWeight: 600, maxWidth: 540, lineHeight: 1.6 }}>
                  Meet friendly, verified tutors who can make learning easier, happier and more fun. Let the educational adventure begin!
                </Typography>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: 'spring' }} style={{ position: 'relative' }}>
                {/* Hero Characters: Friendly Tutor welcoming a Curious Girl */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                  <FriendlyTutor width={180} height={220} />
                  <CuriousGirl width={160} height={200} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, mt: -6 }}>
        {/* 🔎 TUTOR FINDER PANEL */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card elevation={0} sx={{ borderRadius: '32px', bgcolor: isDark ? '#0B1F44' : '#FFFFFF', border: `3px solid ${isDark ? '#102A50' : '#E2E8F0'}`, boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(37,99,235,0.08)', overflow: 'visible', mb: 6 }}>
            <Box sx={{ bgcolor: isDark ? '#102A50' : '#FFFDF5', py: 2.5, px: 4, borderTopLeftRadius: '28px', borderTopRightRadius: '28px', borderBottom: `2px dashed ${isDark ? '#1E3A8A' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span style={{ fontSize: '1.5rem' }}>🧭</span> Who Are We Finding Today?
              </Typography>
              <Button onClick={fetchTeachers} sx={{ color: '#FBBF00', fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: 'rgba(251,191,0,0.1)' } }}>
                ✨ Magic Match
              </Button>
            </Box>

            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '4fr 2fr 2fr 2fr 2fr' }, 
                gap: 2, 
                alignItems: 'center' 
              }}>
                <Box sx={{ gridColumn: { sm: 'span 2', md: 'span 1' } }}>
                  <TextField fullWidth size="medium" placeholder="🔍 Search tutors, subjects or skills..."
                    value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '16px', 
                        bgcolor: isDark ? '#07111F' : '#F6F8FC', 
                        fontWeight: 700, fontFamily: '"Nunito", sans-serif', minHeight: '56px',
                        '& fieldset': { borderColor: isDark ? 'rgba(148,163,184,0.2)' : 'rgba(0,0,0,0.1)' }
                      } 
                    }}
                  />
                </Box>
                {[
                  { label: '📚 Subject', key: 'subject', options: SUBJECTS },
                  { label: '📍 City', key: 'city', options: CITIES },
                  { label: '🏠 Mode', key: 'mode', options: TUITION_MODES },
                ].map(({ label, key, options }) => (
                  <Box key={key}>
                    <FormControl fullWidth size="medium">
                      <InputLabel 
                        id={`${key}-label`}
                        sx={{ px: 0.5, fontFamily: '"Nunito", sans-serif', fontWeight: 800, color: 'text.secondary', mt: -0.2 }}
                      >
                        {label}
                      </InputLabel>
                      <Select
                        labelId={`${key}-label`}
                        value={filters[key]}
                        label={label}
                        onChange={(e) => setFilters(p => ({ ...p, [key]: e.target.value }))}
                        sx={{ 
                          borderRadius: '16px', 
                          bgcolor: isDark ? '#07111F' : '#F6F8FC', 
                          fontWeight: 700, 
                          fontFamily: '"Nunito", sans-serif', 
                          minHeight: '56px',
                          textAlign: 'left',
                          '& fieldset': { borderColor: isDark ? 'rgba(148,163,184,0.2)' : 'rgba(0,0,0,0.1)' }
                        }}
                      >
                        <MenuItem value=""><em>All</em></MenuItem>
                        {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                ))}
                <Box sx={{ gridColumn: { sm: 'span 2', md: 'span 1' } }}>
                  <Button variant="outlined" fullWidth size="large" onClick={clearFilters} startIcon={<RestartAltIcon />}
                    sx={{ borderRadius: '16px', fontWeight: 800, fontFamily: '"Fredoka", sans-serif', borderWidth: 2, minHeight: '56px', '&:hover': { borderWidth: 2 } }}>
                    Clear
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* 🛡️ TRUST STRIP */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 2, md: 5 }, mb: 8 }}>
          {[
            { icon: '🛡️', text: 'Verified Tutors' },
            { icon: '⭐', text: 'Trusted by Families' },
            { icon: '🎓', text: 'Experienced Teachers' },
            { icon: '🚀', text: 'Quick Matching' }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', px: 2, py: 1, borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}>
                <Typography sx={{ fontSize: '1.2rem' }}>{item.icon}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: '"Nunito", sans-serif', color: 'text.secondary' }}>{item.text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* 🎓 YOUR LEARNING BUDDIES (RESULTS HEADER) */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            🎓 Your Learning Buddies
          </Typography>
          {!loading && teachers.length > 0 && (
            <Chip label={`✨ ${teachers.length} tutors ready to help`} sx={{ bgcolor: isDark ? 'rgba(37,99,235,0.2)' : '#DBEAFE', color: isDark ? '#60A5FA' : '#2563EB', fontWeight: 800, fontFamily: '"Nunito", sans-serif', borderRadius: '12px', fontSize: '1rem', py: 2.5 }} />
          )}
        </Box>

        {/* 👩‍🏫 TUTOR CARDS GRID */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                <AutoAwesomeIcon sx={{ fontSize: 60, color: '#FBBF00' }} />
              </motion.div>
              <Typography variant="h5" sx={{ mt: 3, fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary' }}>
                Finding your learning buddies...
              </Typography>
            </motion.div>
          ) : teachers.length > 0 ? (
            <Box key="results" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 4, pb: 12 }}>
              {teachers.map((tutor, idx) => (
                <Box key={tutor._id} sx={{ height: '100%' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                    style={{ height: '100%' }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '32px',
                        bgcolor: isDark ? '#102344' : '#FFFFFF',
                        border: `2px solid ${isDark ? 'rgba(96,165,250,0.18)' : '#E2E8F0'}`,
                        position: 'relative',
                        overflow: 'visible',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.015)',
                          borderColor: '#3B82F6',
                          boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.6)' : '0 25px 50px rgba(59,130,246,0.15)',
                          '& .MuiButton-root': { bgcolor: '#FBBF00', color: '#0B1F44', '& .MuiSvgIcon-root': { transform: 'translateX(4px) translateY(-4px)' } },
                          '& .avatar-box': { transform: 'scale(1.05)' }
                        }
                      }}
                    >
                      {/* Top Accent Strip */}
                      <Box sx={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: '40%', height: 6, bgcolor: '#3B82F6', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} />

                      <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        {/* Profile Header */}
                        <Box sx={{ display: 'flex', gap: 2.5, mb: 3 }}>
                          <Box className="avatar-box" sx={{ transition: 'transform 0.3s ease' }}>
                            {getTutorAvatar(tutor.name, isDark)}
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, lineHeight: 1.1, color: 'text.primary' }}>
                                {tutor.name}
                              </Typography>
                              {tutor.applicationStatus === 'approved' && (
                                <VerifiedIcon sx={{ color: '#3B82F6', fontSize: 20, ml: 0.5 }} />
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>
                                {tutor.cities?.[0] || 'Remote'}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(251,191,0,0.15)', px: 1, py: 0.5, borderRadius: '8px' }}>
                                <StarIcon sx={{ color: '#FBBF00', fontSize: 16 }} />
                                <Typography variant="caption" sx={{ fontWeight: 900, color: isDark ? '#FDE68A' : '#D97706' }}>{tutor.rating || '4.9'}</Typography>
                              </Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                                🎓 {tutor.experience || '3+ Years'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Subject Box */}
                        <Box sx={{ bgcolor: isDark ? '#0B1830' : '#F6F8FC', p: 2.5, borderRadius: '20px', mb: 3, border: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : '#E2E8F0'}` }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Expertise
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {(tutor.subjects || []).slice(0, 4).map(s => (
                              <Chip key={s} label={`📚 ${s}`} size="small" sx={{ fontSize: '0.8rem', fontWeight: 700, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF', fontFamily: '"Nunito", sans-serif' }} />
                            ))}
                            {(tutor.subjects || []).length > 4 && <Chip label={`+${tutor.subjects.length - 4}`} size="small" sx={{ fontSize: '0.8rem', fontWeight: 700, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF' }} />}
                          </Box>

                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontFamily: '"Nunito", sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon sx={{ fontSize: 18, color: '#3B82F6' }} /> Classes: {(tutor.classes || []).join(', ')}
                          </Typography>
                        </Box>

                        {/* Teaching Style / Mode Badges */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4, flexGrow: 1 }}>
                          <Chip label="🎯 Patient Teacher" size="small" sx={{ bgcolor: 'transparent', border: `1px dashed ${isDark ? '#334155' : '#CBD5E1'}`, fontWeight: 700, color: 'text.secondary' }} />
                          <Chip label={`🏠 ${tutor.teachingMode || 'Online & Home'}`} size="small" sx={{ bgcolor: 'transparent', border: `1px dashed ${isDark ? '#334155' : '#CBD5E1'}`, fontWeight: 700, color: 'text.secondary' }} />
                        </Box>

                        <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }} />

                        {/* Footer & CTA */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: '"Fredoka", sans-serif' }}>
                            {tutor.expectedFee || '₹500/hr'}
                          </Typography>
                          <Button 
                            variant="contained" 
                            endIcon={<RocketLaunchIcon sx={{ transition: 'transform 0.3s ease' }} />}
                            onClick={() => navigate('/login')}
                            sx={{ 
                              borderRadius: '20px', 
                              px: 3, 
                              py: 1, 
                              fontWeight: 800, 
                              fontFamily: '"Fredoka", sans-serif', 
                              bgcolor: isDark ? '#FBBF00' : '#2563EB', 
                              color: isDark ? '#07111F' : '#FFFFFF',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: isDark ? '#F59E0B' : '#1D4ED8'
                              }
                            }}
                          >
                            Request Tutor
                          </Button>
                        </Box>

                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              ))}
              
              {/* Decorative Empty Space if less than 3 tutors */}
              {teachers.length < 3 && (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.8, p: 4, borderRadius: '32px', border: `2px dashed ${isDark ? 'rgba(96,165,250,0.18)' : '#93C5FD'}`, minHeight: 400 }}>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} style={{ position: 'relative' }}>
                    <Typography sx={{ fontSize: '4rem' }}>🚀</Typography>
                    <Typography sx={{ fontSize: '1.5rem', position: 'absolute', top: -10, right: -20 }}>⭐</Typography>
                  </motion.div>
                  <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', color: 'text.secondary', mt: 3, textAlign: 'center', fontWeight: 700 }}>
                    More amazing tutors <br /> joining your adventure soon!
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%' }}>
              <Box sx={{ textAlign: 'center', py: 12, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: isDark ? '#0B1F44' : '#FFFFFF', borderRadius: '32px', border: `3px dashed ${isDark ? '#1E3A8A' : '#93C5FD'}`, mb: 12 }}>
                <Box sx={{ position: 'relative', mb: 4 }}>
                  <CuriousBoy width={200} height={250} />
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute', top: 20, right: -40 }}>
                    <Typography sx={{ fontSize: '3rem' }}>🤔</Typography>
                  </motion.div>
                </Box>
                <Typography variant="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', mb: 2 }}>
                  Hmm... Let's Try Another Adventure!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600, maxWidth: 500, mb: 4, fontSize: '1.1rem' }}>
                  We couldn't find a tutor matching these exact filters. Try changing your search and let's find your perfect learning buddy!
                </Typography>
                <Button variant="contained" size="large" onClick={clearFilters} startIcon={<RestartAltIcon />} sx={{ borderRadius: '24px', px: 4, py: 1.5, bgcolor: '#FBBF00', color: '#0B1F44', fontWeight: 800, fontFamily: '"Fredoka", sans-serif', '&:hover': { bgcolor: '#F59E0B' } }}>
                  Reset All Filters
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

      </Container>
    </Box>
  );
}
