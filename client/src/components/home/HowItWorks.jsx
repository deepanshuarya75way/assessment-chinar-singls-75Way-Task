import { useState, useRef } from 'react';
import { Box, Container, Typography, Chip, Paper, useTheme } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TutorBuddy from './TutorBuddy';
import { CuriousBoy, FriendlyTutor, AchievementStar } from './CharacterFamily';

const STEPS = [
  {
    step: '01',
    title: 'Submit Request 📝',
    subtitle: 'Quick & Easy',
    desc: 'Tell us your grade, subjects, and preferences in under 2 minutes.',
    character: CuriousBoy,
    icon: EditNoteIcon,
    accent: '#38BDF8',
    hoverText: '✨ Express your learning goals!',
  },
  {
    step: '02',
    title: 'Meet Your Tutor 🤝',
    subtitle: 'Verified Matching',
    desc: 'Our algorithm pairs you with top-rated, background-checked tutors.',
    character: FriendlyTutor,
    icon: PersonSearchIcon,
    accent: '#F2B705',
    hoverText: '🎯 Perfect tutor match!',
  },
  {
    step: '03',
    title: 'Try a Demo Class 🎥',
    subtitle: 'Zero Risk',
    desc: 'Experience a free trial session to evaluate teaching style & chemistry.',
    character: null,
    icon: VideoCameraFrontIcon,
    accent: '#1FAA59',
    hoverText: '📅 Free demo session!',
  },
  {
    step: '04',
    title: 'Start Adventure! 🚀',
    subtitle: 'Soar to Ranks',
    desc: 'Begin 1-on-1 sessions, track progress, and watch grades soar!',
    character: AchievementStar,
    icon: RocketLaunchIcon,
    accent: '#EC4899',
    hoverText: '🌟 Soar to success!',
  },
];

export default function HowItWorks() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeHover, setActiveHover] = useState(null);
  
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  // Animate the path line drawing as user scrolls through section
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <Box id="learning-adventure" ref={sectionRef} sx={{
      py: { xs: 8, md: 14 },
      scrollMarginTop: { xs: 80, md: 0 },
      bgcolor: isDark ? '#0C172C' : '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Container maxWidth="xl">
        {/* Section Header with TutorBuddy */}
        <Box component={motion.div} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 12 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <TutorBuddy size={55} animate="bounce" signText="Follow the Path! 🗺️" />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
              color: 'text.primary',
            }}
          >
            Your Learning Adventure Starts Here 🗺️✨
          </Typography>
        </Box>

        {/* ── DESKTOP STORYBOOK HORIZONTAL LEARNING JOURNEY PATH ── */}
        <Box sx={{ position: 'relative' }}>
          
          {/* Animated SVG Path for Desktop */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: '40%',
              left: '10%',
              right: '10%',
              height: 200,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <svg width="100%" height="200" viewBox="0 0 1000 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M 50 100 C 200 -50, 250 250, 400 100 C 550 -50, 600 250, 750 100 C 900 -50, 950 100, 1000 100"
                stroke={isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="15 15"
              />
              {/* Animated overlay path */}
              <motion.path
                d="M 50 100 C 200 -50, 250 250, 400 100 C 550 -50, 600 250, 750 100 C 900 -50, 950 100, 1000 100"
                stroke={activeHover !== null ? STEPS[activeHover].accent : "#F2B705"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="15 15"
                style={{ pathLength, transition: 'stroke 0.4s ease' }}
              />
            </svg>
          </Box>


            {/* ── MOBILE COMPACT HORIZONTAL CARDS ── */}
            <Box sx={{
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
              gap: 2.5,
              mt: 4,
            }}>
              {STEPS.map(({ step, title, subtitle, desc, character: CharComp, icon: Icon, accent, hoverText }, idx) => {
                const isHovered = activeHover === idx;
                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 120 }}
                    style={{ width: '100%' }}
                  >
                    <Paper
                      elevation={0}
                      onMouseEnter={() => setActiveHover(idx)}
                      onMouseLeave={() => setActiveHover(null)}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,
                        bgcolor: isDark ? '#0F1D36' : '#FFFFFF',
                        border: `2px solid ${accent}30`,
                        boxShadow: isHovered ? `0 12px 32px ${accent}25` : (isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.06)'),
                        height: 'auto',
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'translateY(-2px)' : 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '"Fredoka", sans-serif',
                          fontWeight: 900,
                          fontSize: '1.8rem',
                          color: accent,
                          mb: 1.5,
                          lineHeight: 1,
                        }}
                      >
                        {step}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ flexShrink: 0, width: 80, height: 80 }}>
                          {CharComp ? (
                            <CharComp width={80} height={80} />
                          ) : (
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '20px',
                                bgcolor: `${accent}18`,
                                border: `2px solid ${accent}40`,
                                color: accent,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.4s ease',
                                transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'none',
                              }}
                            >
                              <Icon sx={{ fontSize: 38 }} />
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: '"Fredoka", "Nunito", sans-serif',
                              fontWeight: 800,
                              fontSize: '1.1rem',
                              color: 'text.primary',
                              mb: 0.75,
                              lineHeight: 1.2,
                            }}
                          >
                            {title}
                          </Typography>
                          <Chip
                            label={subtitle}
                            size="small"
                            sx={{
                              mb: 1,
                              bgcolor: `${accent}18`,
                              color: accent,
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              fontFamily: '"Fredoka", sans-serif',
                              height: 24,
                            }}
                          />
                          <Typography
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.88rem',
                              lineHeight: 1.5,
                              fontFamily: '"Nunito", sans-serif',
                              fontWeight: 600,
                            }}
                          >
                            {desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                );
              })}
            </Box>

            {/* ── DESKTOP CARDS (unchanged) ── */}
            <Box sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 3,
              alignItems: 'center',
            }}>
              {STEPS.map(({ step, title, subtitle, desc, character: CharComp, icon: Icon, accent, hoverText }, idx) => {
                const isHovered = activeHover === idx;
                const yOffsets = [0, 40, -40, 0];
                return (
                  <motion.div key={step} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: yOffsets[idx] }} viewport={{ once: true }} transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }} style={{ width: '100%' }}>
                    <Paper elevation={0} onMouseEnter={() => setActiveHover(idx)} onMouseLeave={() => setActiveHover(null)} sx={{ position: 'relative', zIndex: 1, width: '100%', p: 3.8, borderRadius: '32px', bgcolor: isDark ? (isHovered ? '#162447' : '#111C35') : (isHovered ? '#ffffff' : 'rgba(255,255,255,0.8)'), backdropFilter: 'blur(10px)', border: `2.5px solid ${isHovered ? accent : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0')}`, boxShadow: isHovered ? `0 25px 60px ${accent}40` : (isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.05)'), display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: isHovered ? accent : (isDark ? 'rgba(255,255,255,0.1)' : '#1B2A4A'), color: isHovered && accent === '#F2B705' ? '#1B2A4A' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', fontFamily: '"Fredoka", sans-serif', mb: 3, border: `3px solid ${isDark ? '#0C172C' : '#ffffff'}`, boxShadow: `0 8px 20px ${isHovered ? accent : 'rgba(0,0,0,0.15)'}`, transition: 'all 0.3s ease', transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}>
                        {step}
                      </Box>
                      <Box sx={{ mb: 2, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {CharComp ? (
                          <Box sx={{ transform: isHovered ? 'scale(1.2) translateY(-10px)' : 'scale(1)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                            <CharComp width={110} height={120} />
                          </Box>
                        ) : (
                          <Box sx={{ width: 80, height: 80, borderRadius: '24px', bgcolor: `${accent}18`, border: `2px solid ${accent}40`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s ease', transform: isHovered ? 'scale(1.2) translateY(-10px) rotate(-10deg)' : 'none' }}>
                            <Icon sx={{ fontSize: 42 }} />
                          </Box>
                        )}
                      </Box>
                      <Typography variant="h3" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, mb: 1, color: 'text.primary', fontSize: '1.45rem' }}>
                        {title}
                      </Typography>
                      <Chip label={subtitle} size="small" sx={{ mb: 2, bgcolor: `${accent}18`, color: accent, fontWeight: 800, fontSize: '0.75rem', fontFamily: '"Fredoka", sans-serif' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: '0.95rem', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
                        {desc}
                      </Typography>
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }} transition={{ duration: 0.2 }}>
                        <Box sx={{ mt: 2, pt: 1.5, borderTop: `1.5px dashed ${accent}`, color: accent, fontWeight: 800, fontSize: '0.85rem', fontFamily: '"Fredoka", sans-serif' }}>
                          {hoverText}
                        </Box>
                      </motion.div>
                    </Paper>
                  </motion.div>
                );
              })}
            </Box>

        </Box>
      </Container>

    </Box>
  );
}
