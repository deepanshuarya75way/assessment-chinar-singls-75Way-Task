import { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Reveal } from '../../utils/motion';

const STEPS = [
  { num: '01', icon: '📝', title: 'Tell Us What You Need', desc: 'Share your subjects and learning goals.' },
  { num: '02', icon: '🔎', title: 'Find Your Tutor', desc: 'We match you with verified, friendly educators.' },
  { num: '03', icon: '🤝', title: 'Meet & Learn', desc: 'Experience a session to see if it clicks.' },
  { num: '04', icon: '🌟', title: 'Grow With Confidence', desc: 'Watch your grades and confidence soar!' },
];

const LINE_D = 'M 0 46 H 1000';

export default function LearningAdventure() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <AboutSection id="learning-adventure" ariaLabel="How the learning adventure works" bg="#0B1830">
      <AboutContainer>
        <SectionHeading
          inverse
          accent="yellow"
          eyebrow="🗺️ Your Learning Adventure"
          title="Your Learning Adventure Starts Here 🚀"
          description="Four simple steps between us and a child who can\u2019t wait for their next lesson."
        />

        <Box ref={ref} sx={{ position: 'relative', pt: 1 }}>
          {/* ── Desktop connecting line ── */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 0, left: '4%', right: '4%', height: 90, zIndex: 0 }}>
            <svg width="100%" height="90" viewBox="0 0 1000 90" fill="none" aria-hidden="true">
              <path d={LINE_D} stroke="rgba(255,255,255,0.14)" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 14" />
              {!reduce && <motion.path d={LINE_D}  strokeWidth="4" strokeLinecap="round" strokeDasharray="4 14" />}
            </svg>
          </Box>

          {/* ── Desktop steps ── */}
          <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, position: 'relative', zIndex: 1 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.1}>
                <Box data-qa="adventure-step" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', width: 92, height: 92, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(45,108,223,0.28) 0%, rgba(30,58,138,0.28) 100%)', border: '3px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.3rem', mb: 3, transition: 'transform 0.3s ease, border-color 0.3s ease', '&:hover': { transform: 'scale(1.07)', borderColor: '#F2B705' } }}>
                    <span role="img" aria-hidden="true">{s.icon}</span>
                    <Box sx={{ position: 'absolute', top: -6, right: -8, width: 42, height: 42, borderRadius: '50%', bgcolor: '#F2B705', color: '#1B2A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, fontFamily: '"Fredoka", sans-serif', boxShadow: '0 8px 18px rgba(242,183,5,0.4)' }}>
                      {s.num}
                    </Box>
                  </Box>
                  <Box sx={{ width: '100%', p: 2.6, borderRadius: '24px', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography component="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: '#FFFFFF', fontSize: '1.2rem', mb: 0.8 }}>{s.title}</Typography>
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.68)', fontSize: '0.95rem', lineHeight: 1.6 }}>{s.desc}</Typography>
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
          {/* ── Mobile vertical timeline ── */}
          <Box sx={{ position: 'relative', display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 3 }}>
            <Box aria-hidden="true" sx={{ position: 'absolute', left: 35, top: 8, bottom: 8, borderLeft: '3px dashed rgba(255,255,255,0.18)', zIndex: 0 }} />
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.08}>
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  <Box sx={{ position: 'relative', flexShrink: 0, width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(45,108,223,0.28) 0%, rgba(30,58,138,0.28) 100%)', border: '3px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                    <span role="img" aria-hidden="true">{s.icon}</span>
                    <Box sx={{ position: 'absolute', top: -7, right: -8, width: 36, height: 36, borderRadius: '50%', bgcolor: '#F2B705', color: '#1B2A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, fontFamily: '"Fredoka", sans-serif', boxShadow: '0 8px 18px rgba(242,183,5,0.4)' }}>
                      {s.num}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, p: 2.2, borderRadius: '22px', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography component="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: '#FFFFFF', fontSize: '1.1rem', mb: 0.5 }}>{s.title}</Typography>
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.68)', fontSize: '0.93rem', lineHeight: 1.6 }}>{s.desc}</Typography>
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}