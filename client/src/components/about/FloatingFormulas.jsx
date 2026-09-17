import { Box, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Subtle educational formula decorations (aria-hidden).
 * `tone` — 'dark' force chalk-glow style, 'light' force soft muted style,
 * 'auto' derives from current theme mode.
 */

const ITEMS = [
  { text: 'E = mc²', top: '14%', left: '6%', size: '1.35rem', color: '#F2B705', dur: 7, delay: 0, xs: true },
  { text: 'a² + b² = c²', top: '30%', left: '86%', size: '1.15rem', color: '#38BDF8', dur: 8, delay: 0.6, xs: false },
  { text: '2 + 2 = 4', top: '68%', left: '9%', size: '1.3rem', color: '#1FAA59', dur: 6, delay: 1, xs: false },
  { text: 'πr²', top: '82%', left: '82%', size: '1.25rem', color: '#EC4899', dur: 8.5, delay: 0.3, xs: false },
  { text: '√x', top: '46%', left: '94%', size: '1.6rem', color: '#9C27B0', dur: 7.5, delay: 0.9, xs: false },
  { text: 'x + y = ?', top: '58%', left: '2%', size: '1.2rem', color: '#FF7A00', dur: 6.5, delay: 1.4, xs: false },
  { text: '∑', top: '24%', left: '28%', size: '1.5rem', color: '#F43F5E', dur: 9, delay: 0.2, xs: false },
  { text: '÷', top: '88%', left: '48%', size: '1.5rem', color: '#00D2B8', dur: 7.8, delay: 0.7, xs: false },
];

export default function FloatingFormulas({ tone = 'auto', sx = {} }) {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const isDark = tone === 'auto' ? theme.palette.mode === 'dark' : tone === 'dark';
  const opacity = isDark ? 0.5 : 0.3;

  return (
    <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0, ...sx }}>
      {ITEMS.map((it, i) => (
        <motion.div
          key={i}
          animate={reduce ? undefined : { y: [0, -16, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: it.dur, delay: it.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: it.top, left: it.left, display: 'inline-block' }}
        >
          <Box
            sx={{
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              fontWeight: 800,
              fontSize: it.size,
              color: it.color,
              opacity,
              textShadow: isDark ? `0 0 18px ${it.color}45` : 'none',
              whiteSpace: 'nowrap',
              display: { xs: it.xs ? 'block' : 'none', sm: 'block' },
            }}
          >
            {it.text}
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}