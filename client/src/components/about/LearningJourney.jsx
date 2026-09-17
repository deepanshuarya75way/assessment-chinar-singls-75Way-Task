import { useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Reveal } from '../../utils/motion.jsx';

const STEPS = [
  { icon: '🔎', num: '01', title: 'Discover', desc: 'Find curiosity', color: '#38BDF8' },
  { icon: '📚', num: '02', title: 'Learn', desc: 'Gain knowledge', color: '#F2B705' },
  { icon: '✏️', num: '03', title: 'Practice', desc: 'Build skills', color: '#1FAA59' },
  { icon: '🌱', num: '04', title: 'Grow', desc: 'See progress', color: '#9C27B0' },
  { icon: '✨', num: '05', title: 'Shine', desc: 'Build confidence', color: '#EC4899' },
];

// Smooth wave path: 5 alternating curves through x=100,300,500,700,900 in 1000x90 viewBox (centered at y=45)
const WAVE_D = 'M 100 45 C 175 20, 225 20, 300 45 C 375 70, 425 70, 500 45 C 575 20, 625 20, 700 45 C 775 70, 825 70, 900 45';

export default function LearningJourney() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 70%'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <AboutSection ariaLabel="Our learning philosophy" bg={isDark ? 'background.default' : '#F7F9FC'}>
      <AboutContainer>
        <SectionHeading
          accent="yellow"
          eyebrow="💡 Our Philosophy"
          title="Learning Should Feel Exciting"
          description="We're building a learning experience where children feel confident asking questions, exploring ideas and discovering what they love."
        />

        <Box ref={ref} sx={{ position: 'relative', pt: 2 }}>
          {/* ── Desktop horizontal curved timeline ── */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
            {/* SVG wave behind icons, vertically centered on icon circles */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 0, left: 0, right: 0, height: 90, zIndex: 0 }}>
              <svg width="100%" height="90" viewBox="0 0 1000 90" fill="none" aria-hidden="true" preserveAspectRatio="none">
                <path d={WAVE_D} stroke={isDark ? 'rgba(148,163,184,0.2)' : '#D1D5DB'} strokeWidth="3" strokeLinecap="round" />
                {!reduce && (
                  <motion.path
                    d={WAVE_D}
                    fill="none"
                    stroke="#F2B705"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pathLength }}
                  />
                )}
              </svg>
            </Box>

            {/* 5-step grid */}
            <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, position: 'relative', zIndex: 1 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.08}>
                <Box data-qa="journey-node" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', px: 1 }}>
                  <Box sx={{ position: 'relative', width: 84, height: 84, borderRadius: '50%', bgcolor: isDark ? '#142F5C' : '#FFFFFF', border: `3px solid ${s.color}`, boxShadow: `0 12px 30px ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.1rem', mb: 2.5, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.08)' } }}>
                    <Box sx={{ position: 'absolute', top: -6, right: -6, width: 32, height: 32, borderRadius: '50%', bgcolor: s.color, color: s.color === '#F2B705' ? '#1B2A4A' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, fontFamily: '"Fredoka", sans-serif', border: `3px solid ${isDark ? 'background.default' : '#F7F9FC'}`, boxShadow: '0 6px 14px rgba(0,0,0,0.18)' }}>
                      {s.num}
                    </Box>
                    <span role="img" aria-hidden="true">{s.icon}</span>
                  </Box>
                  <Typography component="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: '1.15rem', mb: 0.5 }}>{s.title}</Typography>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: 'text.secondary', fontSize: '0.95rem' }}>{s.desc}</Typography>
                </Box>
              </Reveal>
            ))}
            </Box>
          </Box>

          {/* ── Mobile vertical timeline ── */}
          <Box sx={{ position: 'relative', display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box aria-hidden="true" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 36, bottom: 36, width: 3, background: isDark ? 'linear-gradient(180deg, rgba(148,163,184,0.4), rgba(148,163,184,0.15))' : 'linear-gradient(180deg, #CBD5E1, #E2E8F0)', borderRadius: 2, zIndex: 0 }} />
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.08}>
                <Box data-qa="journey-node" sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 2.5, width: '100%', maxWidth: 360 }}>
                  <Box sx={{ position: 'relative', width: 68, height: 68, borderRadius: '50%', bgcolor: isDark ? '#142F5C' : '#FFFFFF', border: `3px solid ${s.color}`, boxShadow: `0 12px 28px ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.08)' } }}>
                    <Box sx={{ position: 'absolute', top: -4, right: -4, width: 28, height: 28, borderRadius: '50%', bgcolor: s.color, color: s.color === '#F2B705' ? '#1B2A4A' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, fontFamily: '"Fredoka", sans-serif', border: `3px solid ${isDark ? '#0B1830' : '#FFFFFF'}`, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      {s.num}
                    </Box>
                    <span role="img" aria-hidden="true">{s.icon}</span>
                  </Box>
                  <Typography component="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.15rem', sm: '1.25rem' }, mt: 2, mb: 0.5 }}>{s.num} · {s.title}</Typography>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.5 }}>{s.desc}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}