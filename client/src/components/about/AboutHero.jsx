import { Box, Chip, Container, Typography, Button, Avatar, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTeacherApplication } from '../../context/TeacherApplicationContext';
import { CuriousBoy, CuriousGirl, FriendlyTutor } from '../home/CharacterFamily';
import { Float, usePrefersReducedMotion } from '../../utils/motion.jsx';
import FloatingFormulas from './FloatingFormulas';

const TRUST_TAGS = ['✅ Background-verified tutors', '🎯 Personalized matching', '🏠 Home & online classes'];

export default function AboutHero() {
  const navigate = useNavigate();
  const { openTeacherApplication } = useTeacherApplication();
  const theme = useTheme();
  const reduce = usePrefersReducedMotion();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const c = isMobile ? { boy: 80, girl: 80, tutor: 120 } : { boy: 112, girl: 112, tutor: 150 };

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 110, damping: 17 } } };

  return (
    <Box component="section" aria-label="About 75 Way Project Task" sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#080E1A', pt: { xs: 5, sm: 7, md: 9 }, pb: { xs: 9, md: 11 } }}>
      {/* ── Background layers ── */}
      <FloatingFormulas tone="dark" />
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1.5px, transparent 1.5px)', backgroundSize: '36px 36px', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', top: -120, left: -120, width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,108,223,0.35) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: -80, right: -60, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,183,5,0.22) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' }, alignItems: 'center', gap: { xs: 6, md: 5 } }}>
          {/* ── LEFT: messaging ── */}
          <Box>
            <motion.div variants={containerVariants} initial={reduce ? false : 'hidden'} animate={reduce ? undefined : 'visible'}>
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: '20px', bgcolor: 'rgba(242,183,5,0.12)', border: '1.5px solid rgba(242,183,5,0.4)' }}>
                  <AutoAwesomeIcon sx={{ color: '#F2B705', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 800, fontFamily: '"Fredoka", sans-serif', color: '#F2B705', fontSize: '0.92rem' }}>About 75 Way Project Task ✨</Typography>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="h1" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 900, color: '#FFFFFF', fontSize: { xs: '2.4rem', sm: '3.1rem', md: '3.6rem', lg: '4rem' }, lineHeight: 1.08, mt: 3, mb: 2.5, letterSpacing: '-0.02em', '& span': { color: '#F2B705' } }}>
                  Making Learning Feel Like an <span>Adventure 🚀</span>
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: { xs: '1.02rem', md: '1.15rem' }, lineHeight: 1.7, maxWidth: 520, fontWeight: 600, fontFamily: '"Nunito", sans-serif', mb: 4 }}>
                  At 75 Way Project Task, we help children discover trusted tutors who make learning easier, happier and more exciting.
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/find-tutor')}
                    startIcon={<RocketLaunchIcon />}
                    sx={{ borderRadius: '30px', px: 4, py: 1.6, bgcolor: '#F2B705', color: '#1B2A4A', fontWeight: 900, fontSize: '1.05rem', fontFamily: '"Fredoka", sans-serif', boxShadow: '0 12px 30px rgba(242,183,5,0.35)', '&:hover': { bgcolor: '#ffca28', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}
                  >
                    Find a Tutor
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={openTeacherApplication}
                    startIcon={<SchoolIcon />}
                    sx={{ borderRadius: '30px', px: 4, py: 1.6, color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.35)', borderWidth: 2, fontWeight: 900, fontSize: '1.05rem', fontFamily: '"Fredoka", sans-serif', '&:hover': { borderColor: '#38BDF8', bgcolor: 'rgba(56,189,248,0.15)', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}
                  >
                    Become a Teacher
                  </Button>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 4 }}>
                  {TRUST_TAGS.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.14)', fontWeight: 700, fontSize: '0.8rem', fontFamily: '"Nunito", sans-serif', py: 2, borderRadius: '18px' }} />
                  ))}
                </Box>
              </motion.div>
            </motion.div>
          </Box>
          {/* ── RIGHT: character scene ── */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.15 }}
              style={{ width: '100%', maxWidth: 470, position: 'relative' }}
            >
              {/* Glass frame */}
              <Box data-qa="hero-scene" sx={{ borderRadius: '40px', p: { xs: 3, sm: 3.5, md: 4 }, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '2px solid rgba(255,255,255,0.14)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
                {/* Header row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 46, height: 46, bgcolor: '#1B2A4A', border: '2.5px solid #F2B705', fontWeight: 800, fontFamily: '"Fredoka", sans-serif', fontSize: '1rem', color: '#F2B705' }}>TC</Avatar>
                    <Box>
                      <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem', lineHeight: 1.2 }}>75 Way Project Task</Typography>
                      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>Where learning feels like play</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ px: 1.6, py: 0.9, borderRadius: '20px', bgcolor: 'rgba(242,183,5,0.14)', border: '1px solid rgba(242,183,5,0.4)' }}>
                    <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: '#F2B705', fontSize: '0.8rem' }}>🎒 Grades 1–12</Typography>
                  </Box>
                </Box>

                {/* Characters */}
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <Float distance={8} duration={4.5} style={{ position: 'absolute', top: '2%', left: '2%', zIndex: 3, fontSize: '1.8rem' }}>📚</Float>
                  <Float distance={10} duration={5.2} delay={0.4} style={{ position: 'absolute', top: '10%', right: '6%', zIndex: 3, fontSize: '1.7rem' }}>✏️</Float>
                  <Float distance={12} duration={6} delay={0.8} style={{ position: 'absolute', bottom: '38%', left: '-1%', zIndex: 3, fontSize: '1.6rem' }}>⭐</Float>
                  <Float distance={9} duration={4.8} delay={1.2} style={{ position: 'absolute', top: '36%', right: '0%', zIndex: 3, fontSize: '1.6rem' }}>✨</Float>

                  <CuriousGirl width={c.girl} height={c.girl + 28} />
                  <Float distance={6} duration={5}>
                    <FriendlyTutor width={c.tutor} height={c.tutor + 28} sx={{ zIndex: 2, marginLeft: '-12px', marginRight: '-12px' }} />
                  </Float>
                  <CuriousBoy width={c.boy} height={c.boy + 28} />
                </Box>
              </Box>

              {/* Floating sticker */}
              <Box sx={{ position: 'absolute', left: { xs: 10, sm: -14 }, bottom: -18, zIndex: 5 }}>
                <Float distance={9} duration={5.5} delay={0.5}>
                  <Box sx={{ px: 2, py: 1.2, borderRadius: '18px', bgcolor: '#F2B705', color: '#1B2A4A', boxShadow: '0 16px 30px rgba(0,0,0,0.35)', transform: 'rotate(-4deg)' }}>
                    <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>💙 A learning buddy for every child</Typography>
                  </Box>
                </Float>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}