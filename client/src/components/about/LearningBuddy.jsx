import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { CuriousBoy, FriendlyTutor, ParentMom, ParentDad } from '../home/CharacterFamily';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Float, Reveal } from '../../utils/motion.jsx';

const CHECKS = [
  { emoji: '✨', text: 'More confidence' },
  { emoji: '📚', text: 'Better understanding' },
  { emoji: '😊', text: 'A happier learning experience' },
];

export default function LearningBuddy() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AboutSection ariaLabel="More than a tutor, a learning buddy" bg={isDark ? 'background.default' : '#FFFFFF'}>
      <AboutContainer>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
          {/* ── LEFT: content ── */}
          <Box>
            <Reveal>
              <SectionHeading align="left" accent="blue" eyebrow="💙 Our Promise" title="More Than a Tutor. A Learning Buddy." sx={{ mb: 3 }} />
            </Reveal>

            <Reveal delay={0.1}>
              <Typography sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.08rem' }, lineHeight: 1.85, fontWeight: 600, fontFamily: '"Nunito", sans-serif', maxWidth: 540, mb: 3.5 }}>
                The right tutor can turn &ldquo;I don&rsquo;t understand this&rdquo; into &ldquo;I finally got it!&rdquo; We focus on bringing families and educators together in a meaningful way.
              </Typography>
            </Reveal>

            <Reveal delay={0.2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {CHECKS.map((ch) => (
                  <Box key={ch.text} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flexShrink: 0, width: 48, height: 48, borderRadius: '50%', bgcolor: isDark ? 'rgba(59,130,246,0.18)' : '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem' }} aria-hidden="true">
                      {ch.emoji}
                    </Box>
                    <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary', fontSize: '1.1rem' }}>{ch.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Reveal>
          </Box>

          {/* ── RIGHT: emotional scene ── */}
          <Reveal delay={0.1}>
            <Box data-qa="buddy-illus" sx={{ position: 'relative', height: { xs: 300, sm: 380, md: 450 }, borderRadius: '40px', bgcolor: isDark ? '#0B1830' : '#EFF6FF', border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.12)' : '#DBEAFE'}`, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              {/* Soft blobs */}
              <Box sx={{ position: 'absolute', top: -40, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)' }} />
              <Box sx={{ position: 'absolute', bottom: -40, left: -30, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,108,223,0.2) 0%, transparent 70%)' }} />

              {/* Floating props */}
              <Float distance={10} duration={5.5} style={{ position: 'absolute', top: '12%', left: '8%', fontSize: '1.8rem', zIndex: 3 }}>📚</Float>
              <Float distance={8} duration={6.2} delay={0.5} style={{ position: 'absolute', top: '20%', right: '10%', fontSize: '1.7rem', zIndex: 3 }}>❤️</Float>
              <Float distance={12} duration={7} delay={1} style={{ position: 'absolute', top: '55%', left: '4%', fontSize: '1.5rem', zIndex: 3 }}>⭐</Float>

              {/* Quote sticker */}
              <Box sx={{ position: 'absolute', top: 22, left: 22, zIndex: 4, transform: 'rotate(-3deg)' }}>
                <Box sx={{ px: 2, py: 1.1, borderRadius: '18px', bgcolor: isDark ? '#142F5C' : '#FFFFFF', border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#E2E8F0'}`, boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}>
                  <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: isDark ? '#FBBF00' : '#2563EB', fontSize: '0.9rem' }}>&ldquo;I finally got it!&rdquo;</Typography>
                </Box>
              </Box>

              {/* Characters */}
              <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end' }}>
                <FriendlyTutor width={isSmall ? 118 : 138} height={isSmall ? 148 : 170} />
                <Float distance={7} duration={5}>
                  <CuriousBoy width={isSmall ? 165 : 195} height={isSmall ? 200 : 230} sx={{ zIndex: 3, marginLeft: '-12px', marginRight: '-12px', marginBottom: '-8px' }} />
                </Float>
              </Box>

              {/* Floating parent bubbles */}
              <Box sx={{ position: 'absolute', top: { xs: 16, sm: 24 }, right: { xs: 18, sm: 28 }, zIndex: 5 }}>
                <Float distance={9} duration={6} delay={0.3}><ParentMom size={isSmall ? 54 : 64} /></Float>
              </Box>
              <Box sx={{ position: 'absolute', bottom: { xs: 16, sm: 24 }, left: { xs: 12, sm: 20 }, zIndex: 5 }}>
                <Float distance={8} duration={6.6} delay={0.7}><ParentDad size={isSmall ? 50 : 58} /></Float>
              </Box>
            </Box>
          </Reveal>
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}