import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import TutorBuddy from './TutorBuddy';

const STATS_DATA = [
  { id: 'students', label: 'Happy Learners', target: 8000, suffix: '+', emoji: '🏆', color: '#F2B705', bg: 'rgba(242, 183, 5, 0.16)' },
  { id: 'tutors', label: 'Friendly Tutors', target: 100, suffix: '+', emoji: '👩‍🏫', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.16)' },
  { id: 'subjects', label: 'Subjects Taught', target: 25, suffix: '+', emoji: '📚', color: '#1FAA59', bg: 'rgba(31, 170, 89, 0.16)' },
  { id: 'cities', label: 'Cities Covered', target: 50, suffix: '+', emoji: '🌍', color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.16)' },
  { id: 'satisfaction', label: 'Happy Parents', target: 98, suffix: '%', emoji: '⭐', color: '#FF7A00', bg: 'rgba(255, 122, 0, 0.16)' },
];

function AnimatedCounter({ target, suffix, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    let startTime = null;
    const duration = 1800;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, isVisible]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const isVisible = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <Box
      ref={sectionRef}
      sx={{
        width: '100%',
        bgcolor: '#081021',
        position: 'relative',
        py: { xs: 6, md: 7 },
        borderTop: '2px solid rgba(242, 183, 5, 0.25)',
        borderBottom: '2px solid rgba(45, 108, 223, 0.25)',
        boxShadow: 'inset 0 10px 30px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Background Radial Light Glow */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(45, 108, 223, 0.18) 0%, transparent 80%)',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Title with TutorBuddy Mascot Waving */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}
        >
          <TutorBuddy size={48} animate="bounce" />
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              fontWeight: 800,
              color: '#ffffff',
              fontSize: { xs: '1.4rem', sm: '1.8rem' },
              textAlign: 'center',
            }}
          >
            Trusted by Thousands of Students & Parents Across India 🇮🇳
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
          gap: { xs: 2, sm: 2.5, md: 3 },
          alignItems: 'center',
        }}>
          {STATS_DATA.map(({ id, label, target, suffix, emoji, color, bg }, idx) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * idx, type: 'spring', stiffness: 120 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: { xs: 2.2, sm: 2.8 },
                  borderRadius: '24px',
                  bgcolor: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(12px)',
                  border: '2px solid rgba(255, 255, 255, 0.12)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                    transform: 'translateY(-6px) scale(1.03)',
                    borderColor: color,
                    boxShadow: `0 14px 35px ${color}35`,
                    '& .stat-emoji-box': {
                      transform: 'scale(1.2) rotate(8deg)',
                    }
                  }
                }}
              >
                <Box className="stat-emoji-box" sx={{
                  width: { xs: 50, sm: 58 },
                  height: { xs: 50, sm: 58 },
                  borderRadius: '20px',
                  bgcolor: bg,
                  border: `2px solid ${color}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: { xs: '1.6rem', sm: '1.9rem' },
                  flexShrink: 0,
                  transition: 'transform 0.3s ease',
                }}>
                  {emoji}
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Fredoka", "Nunito", sans-serif',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.1,
                      fontSize: { xs: '1.45rem', sm: '1.75rem', md: '2rem' },
                    }}
                  >
                    <AnimatedCounter target={target} suffix={suffix} isVisible={isVisible} />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontWeight: 700,
                      fontSize: { xs: '0.8rem', sm: '0.88rem' },
                      display: 'block',
                      mt: 0.3,
                      fontFamily: '"Nunito", sans-serif',
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
