import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PaletteIcon from '@mui/icons-material/Palette';
import { LittleScientist, LittleCoder } from '../home/CharacterFamily';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Reveal, usePrefersReducedMotion } from '../../utils/motion.jsx';

const ITEMS = [
  { icon: <CalculateIcon sx={{ fontSize: 34 }} />, title: 'The Number Explorer', desc: 'For children who love numbers and puzzles.', color: '#3B82F6', chip: '🔢 Maths', Char: null },
  { icon: null, title: 'The Curious Scientist', desc: 'For children who constantly ask "Why?"', color: '#10B981', chip: '🧪 Science', Char: LittleScientist },
  { icon: <MenuBookIcon sx={{ fontSize: 34 }} />, title: 'The Story Lover', desc: 'For children who learn through stories and imagination.', color: '#F59E0B', chip: '📖 Reading', Char: null },
  { icon: null, title: 'The Future Coder', desc: 'For children who love technology and building things.', color: '#8B5CF6', chip: '💻 Coding', Char: LittleCoder },
  { icon: <PaletteIcon sx={{ fontSize: 34 }} />, title: 'The Creative Thinker', desc: 'For children who love creating, drawing and experimenting.', color: '#EC4899', chip: '🎨 Creative', Char: null },
];

export default function LearningSuperpowers() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const reduce = usePrefersReducedMotion();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AboutSection ariaLabel="Learning superpowers" bg={isDark ? 'background.default' : '#F7F9FC'}>
      <AboutContainer>
        <SectionHeading
          accent="blue"
          eyebrow="✨ Every Learner Is Unique"
          title="Every Child Has Their Own Learning Superpower ✨"
          description="There is no single way to learn. We help each child play to their strengths — because every learning style deserves the right kind of teacher."
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 3, md: 3.5 } }}>
          {ITEMS.map((item, i) => (
            <Box key={item.title} sx={{ width: { xs: '100%', sm: 'calc((100% - 24px) / 2)', md: 'calc((100% - 72px) / 3)' } }}>
              <Reveal delay={i * 0.08} style={{ height: '100%' }}>
                <Box
                  data-qa="power-card"
                  component={motion.div}
                  whileHover={reduce ? undefined : { y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  sx={{
                    position: 'relative', height: '100%', overflow: 'hidden', p: { xs: 3.5, md: 4 },
                    borderRadius: '28px', bgcolor: isDark ? 'background.paper' : '#FFFFFF',
                    border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.14)' : '#E2E8F0'}`,
                    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.25)' : '0 8px 24px rgba(15,23,42,0.05)',
                  }}
                >
                  <Box sx={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${item.color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

                  <Box sx={{ position: 'relative', display: 'inline-flex', px: 1.5, py: 0.7, borderRadius: '16px', bgcolor: `${item.color}18`, color: item.color, fontFamily: '"Fredoka", sans-serif', fontWeight: 800, fontSize: '0.82rem', mb: 2.5 }}>
                    {item.chip}
                  </Box>

                  {item.Char ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: { xs: 132, md: 152 }, mb: 1.5 }}>
                      <item.Char width={isSmall ? 102 : 132} height={isSmall ? 126 : 166} />
                    </Box>
                  ) : (
                    <Box sx={{ width: 72, height: 72, borderRadius: '22px', bgcolor: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                      {item.icon}
                    </Box>
                  )}

                  <Typography component="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: '1.28rem', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: 'text.secondary', fontSize: '1rem', lineHeight: 1.65 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Reveal>
            </Box>
          ))}
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}