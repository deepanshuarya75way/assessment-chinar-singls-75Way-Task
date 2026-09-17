import { Box, Chip, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../utils/motion';

/**
 * Shared layout + typography primitives for the About page.
 * Provides a consistent 1200px container (maxWidth="lg"), consistent
 * section padding, and a reusable section heading with eyebrow chip.
 */

const SECTION_PY = { xs: 7, sm: 8, md: 10 };

export function AboutSection({ id, bg, children, py = SECTION_PY, ariaLabel, sx = {} }) {
  return (
    <Box component="section" id={id} aria-label={ariaLabel} sx={{ position: 'relative', overflow: 'hidden', bgcolor: bg, py, ...sx }}>
      {children}
    </Box>
  );
}

export function AboutContainer({ children, sx = {} }) {
  return (
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, ...sx }}>
      {children}
    </Container>
  );
}

export function SectionHeading({ eyebrow, accent = 'blue', inverse = false, title, description, align = 'center', sx = {}, titleSx = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const left = align === 'left';
  const reduce = usePrefersReducedMotion();

  const chipSx =
    accent === 'yellow'
      ? { bgcolor: isDark ? 'rgba(251,191,0,0.12)' : '#FFF4C2', color: isDark ? '#FBBF00' : '#B45309', border: `1px solid ${isDark ? 'rgba(251,191,0,0.35)' : '#FDE68A'}` }
      : { bgcolor: isDark ? 'rgba(59,130,246,0.15)' : '#EAF2FF', color: isDark ? '#60A5FA' : '#2563EB', border: `1px solid ${isDark ? 'rgba(59,130,246,0.3)' : '#BFDBFE'}` };

  return (
    <Box
      component={motion.div}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      sx={{ textAlign: left ? 'left' : 'center', mb: { xs: 5, md: 6.5 }, mx: left ? 0 : 'auto', maxWidth: 820, ...sx }}>
      {eyebrow && (
        <Chip
          label={eyebrow}
          size="small"
          sx={{ mb: 2, px: 1.5, py: 2.2, fontWeight: 800, fontFamily: '"Fredoka", sans-serif', fontSize: '0.85rem', letterSpacing: 0.3, ...chipSx }}
        />
      )}
      <Typography
        variant="h2"
        sx={{
          fontFamily: '"Fredoka", sans-serif',
          fontWeight: 800,
          fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3rem' },
          lineHeight: 1.15,
          color: inverse ? '#FFFFFF' : 'text.primary',
          letterSpacing: '-0.01em',
          mb: description ? 2.5 : 0,
          ...titleSx,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          sx={{
            color: inverse ? 'rgba(255,255,255,0.78)' : 'text.secondary',
            fontWeight: 600,
            fontSize: { xs: '1rem', md: '1.12rem' },
            lineHeight: 1.75,
            maxWidth: { xs: '100%', md: 640 },
            mx: left ? 0 : 'auto',
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}