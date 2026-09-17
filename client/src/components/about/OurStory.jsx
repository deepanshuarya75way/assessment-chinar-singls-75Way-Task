import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { CuriousGirl } from '../home/CharacterFamily';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Float, Reveal } from '../../utils/motion.jsx';

const PARAGRAPHS = [
  'Every child learns differently. Some love numbers, some love stories, some love experiments, and some simply need the right person to make a difficult subject feel easy.',
  '75 Way Project Task was created to help families find that perfect person — a mentor who makes learning click.',
];

const HIGHLIGHTS = [
  { emoji: '🎯', label: 'Personalized Learning' },
  { emoji: '🛡️', label: 'Trusted Tutors' },
  { emoji: '💛', label: 'Happier Learning' },
];

export default function OurStory() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AboutSection ariaLabel="Our Story" bg={isDark ? 'background.paper' : '#FFFFFF'}>
      <AboutContainer>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
          {/* ── LEFT: illustration ── */}
          <Reveal>
            <Box data-qa="story-illus" sx={{ position: 'relative', height: { xs: 300, sm: 360, md: 460 }, borderRadius: '40px', bgcolor: isDark ? '#0B1830' : '#EFF6FF', border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.12)' : '#DBEAFE'}`, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              {/* Soft blobs */}
              <Box sx={{ position: 'absolute', top: -40, left: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,183,5,0.3) 0%, transparent 70%)' }} />
              <Box sx={{ position: 'absolute', bottom: -30, right: -30, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)' }} />

              {/* Floating props */}
              <Float distance={10} duration={5.6} style={{ position: 'absolute', top: '12%', left: '10%', fontSize: '1.9rem', zIndex: 3 }}>📚</Float>
              <Float distance={8} duration={6.4} delay={0.6} style={{ position: 'absolute', top: '24%', right: '12%', fontSize: '1.7rem', zIndex: 3 }}>💡</Float>
              <Float distance={12} duration={7} delay={1.1} style={{ position: 'absolute', top: '55%', left: '6%', fontSize: '1.5rem', zIndex: 3 }}>⭐</Float>

              {/* Sticker */}
              <Box sx={{ position: 'absolute', top: 22, right: 22, zIndex: 4, transform: 'rotate(3deg)' }}>
                <Box sx={{ px: 1.8, py: 1, borderRadius: '16px', bgcolor: isDark ? '#142F5C' : '#FFFFFF', border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#E2E8F0'}`, boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}>
                  <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: isDark ? '#FBBF00' : '#B45309', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>💛 Made for curious minds</Typography>
                </Box>
              </Box>

              <CuriousGirl width={isSmall ? 190 : 250} height={isSmall ? 260 : 330} sx={{ position: 'relative', zIndex: 2, mb: { xs: 1, md: 2 } }} />
            </Box>
          </Reveal>

          {/* ── RIGHT: content ── */}
          <Box>
            <Reveal>
              <SectionHeading align="left" accent="blue" eyebrow="📚 Our Story" title="Every Child Has a Learning Story" sx={{ mb: 3 }} />
            </Reveal>

            <Reveal delay={0.1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {PARAGRAPHS.map((p, i) => (
                  <Typography key={i} sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.08rem' }, lineHeight: 1.85, fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}>
                    {p}
                  </Typography>
                ))}
              </Box>
            </Reveal>

            <Reveal delay={0.2}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mt: 4 }}>
                {HIGHLIGHTS.map((h) => (
                  <Box key={h.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, p: 2.2, borderRadius: '22px', bgcolor: isDark ? '#0B1830' : '#F7F9FC', border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.12)' : '#E2E8F0'}`, transition: 'transform 0.25s ease, box-shadow 0.25s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: isDark ? '0 14px 30px rgba(0,0,0,0.3)' : '0 14px 30px rgba(15,23,42,0.08)' } }}>
                    <Box sx={{ fontSize: '1.8rem', mb: 1 }} aria-hidden="true">{h.emoji}</Box>
                    <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: '0.98rem', textAlign: { xs: 'center', sm: 'left' } }}>{h.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Reveal>
          </Box>
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}