import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Reveal, usePrefersReducedMotion } from '../../utils/motion.jsx';

const VALUES = [
  { icon: <ShieldIcon sx={{ fontSize: 30 }} />, title: 'Safety', desc: 'A learning environment where children feel completely supported.', color: '#3B82F6' },
  { icon: <CheckCircleIcon sx={{ fontSize: 30 }} />, title: 'Trust', desc: 'Confidence in the people helping your children learn.', color: '#10B981' },
  { icon: <EmojiObjectsIcon sx={{ fontSize: 30 }} />, title: 'Attention', desc: 'Focusing on the unique needs and goals of every learner.', color: '#F59E0B' },
  { icon: <FavoriteIcon sx={{ fontSize: 30 }} />, title: 'Happiness', desc: 'Learning works best when curiosity and joy grow together.', color: '#EC4899' },
];

export default function CoreValues() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const reduce = usePrefersReducedMotion();

  return (
    <AboutSection ariaLabel="Our core values" bg={isDark ? 'background.default' : '#F7F9FC'}>
      <AboutContainer>
        <SectionHeading
          accent="yellow"
          eyebrow="💛 What Guides Us"
          title="Built Around What Matters 💛"
          description="Because great learning is about more than just getting the right answer."
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 3, md: 3.5 } }}>
          {VALUES.map((v, i) => (
            <Box key={v.title} sx={{ width: { xs: '100%', sm: 'calc((100% - 24px) / 2)', md: 'calc((100% - 108px) / 4)' } }}>
              <Reveal delay={i * 0.08} style={{ height: '100%' }}>
                <Box
                  data-qa="values-card"
                  component={motion.div}
                  whileHover={reduce ? undefined : { y: -5 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  sx={{
                    position: 'relative', height: '100%', p: { xs: 3.5, md: 4 }, borderRadius: '24px',
                    bgcolor: isDark ? 'background.paper' : '#FFFFFF',
                    border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.14)' : '#E2E8F0'}`,
                    borderTop: `5px solid ${v.color}`,
                    boxShadow: isDark ? '0 10px 28px rgba(0,0,0,0.25)' : '0 8px 24px rgba(15,23,42,0.05)',
                    '&:hover': { boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.35)' : '0 16px 40px rgba(15,23,42,0.1)' },
                  }}
                >
                  <Box sx={{ width: 58, height: 58, borderRadius: '16px', bgcolor: `${v.color}15`, color: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                    {v.icon}
                  </Box>
                  <Typography component="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: '1.22rem', mb: 1.2 }}>{v.title}</Typography>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: 'text.secondary', fontSize: '0.98rem', lineHeight: 1.65 }}>{v.desc}</Typography>
                </Box>
              </Reveal>
            </Box>
          ))}
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}