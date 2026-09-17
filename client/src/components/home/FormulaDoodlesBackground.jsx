import { Box } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

const FORMULAS = [
  { text: 'E = mc²', top: '15%', left: '8%', depth: 1.5, size: '1.4rem', color: '#F2B705' },
  { text: 'a² + b² = c²', top: '28%', left: '85%', depth: -1.2, size: '1.3rem', color: '#38BDF8' },
  { text: 'F = ma', top: '75%', left: '6%', depth: 2, size: '1.25rem', color: '#1FAA59' },
  { text: 'H₂O & CO₂', top: '82%', left: '82%', depth: -1.8, size: '1.2rem', color: '#EC4899' },
  { text: 'A = πr²', top: '55%', left: '4%', depth: 1.2, size: '1.25rem', color: '#9C27B0' },
  { text: '2 + 2 = 4', top: '18%', left: '45%', depth: -2, size: '1.5rem', color: '#FF7A00' },
  { text: 'V = u + at', top: '65%', left: '90%', depth: 1.6, size: '1.2rem', color: '#00D2B8' },
  { text: '10 ÷ 2 = 5', top: '88%', left: '42%', depth: -1.5, size: '1.3rem', color: '#F2B705' },
  { text: '3 × 4 = 12', top: '10%', left: '78%', depth: 1.8, size: '1.25rem', color: '#38BDF8' },
  { text: 'x + y = 10', top: '45%', left: '94%', depth: -1.1, size: '1.2rem', color: '#1FAA59' },
  { text: '∫ x dx', top: '35%', left: '12%', depth: 2.5, size: '1.6rem', color: '#F43F5E' },
  { text: '√144 = 12', top: '92%', left: '70%', depth: -2.2, size: '1.4rem', color: '#8B5CF6' },
];

const SYMBOLS = [
  { text: '∑', top: '35%', left: '18%', depth: 3, size: '1.8rem', color: 'rgba(255,255,255,0.25)' },
  { text: 'π', top: '68%', left: '25%', depth: -2.5, size: '2rem', color: 'rgba(242,183,5,0.3)' },
  { text: '√', top: '22%', left: '62%', depth: 2.8, size: '1.9rem', color: 'rgba(56,189,248,0.3)' },
  { text: '÷', top: '58%', left: '52%', depth: -3, size: '2rem', color: 'rgba(31,170,89,0.3)' },
  { text: '∞', top: '80%', left: '25%', depth: 3.5, size: '2.5rem', color: 'rgba(236,72,153,0.3)' },
];

export default function FormulaDoodlesBackground() {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <Box sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Background Deep Gradient with Grid */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(45,108,223,0.15) 0%, rgba(8,14,26,1) 80%)',
      }} />
      <Box sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 2px, transparent 2px)',
        backgroundSize: '40px 40px',
        opacity: 0.5
      }} />

      {/* Floating Chalk Formulas with Parallax Depth */}
      {FORMULAS.map((item, i) => {
        // Parallax effect based on depth
        const xOffset = useTransform(smoothX, [-0.5, 0.5], [-25 * item.depth, 25 * item.depth]);
        const yOffset = useTransform(smoothY, [-0.5, 0.5], [-25 * item.depth, 25 * item.depth]);
        // Scroll parallax
        const scrollOffset = useTransform(scrollY, [0, 1000], [0, -100 * item.depth]);

        return (
          <Box
            component={motion.div}
            key={i}
            style={{ x: xOffset, y: yOffset, translateY: scrollOffset }}
            sx={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              color: item.color,
              fontSize: item.size,
              fontWeight: 800,
              opacity: { xs: 0.35, sm: 0.6 },
              textShadow: `0 0 15px ${item.color}50`,
              userSelect: 'none',
              fontFamily: '"Comic Neue", "Fredoka", cursive', // Handwritten look
              display: { xs: i % 3 === 0 ? 'block' : 'none', sm: 'block' },
            }}
          >
            {/* Very slow continuous floating for life */}
            <motion.div animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 6 + i, ease: 'easeInOut' }}>
              {item.text}
            </motion.div>
          </Box>
        );
      })}

      {/* Floating Math Symbols */}
      {SYMBOLS.map((item, i) => {
        const xOffset = useTransform(smoothX, [-0.5, 0.5], [-40 * item.depth, 40 * item.depth]);
        const yOffset = useTransform(smoothY, [-0.5, 0.5], [-40 * item.depth, 40 * item.depth]);
        const scrollOffset = useTransform(scrollY, [0, 1000], [0, -150 * item.depth]);

        return (
          <Box
            component={motion.div}
            key={`sym-${i}`}
            style={{ x: xOffset, y: yOffset, translateY: scrollOffset }}
            sx={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              color: item.color,
              fontSize: item.size,
              fontWeight: 900,
              userSelect: 'none',
              fontFamily: '"Comic Neue", "Fredoka", cursive',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <motion.div animate={{ rotate: [0, 15, 0], scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 8 + i, ease: 'easeInOut' }}>
              {item.text}
            </motion.div>
          </Box>
        );
      })}

      {/* Floating Sparkles & Stars */}
      <Box component={motion.div} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 3 }} sx={{ position: 'absolute', top: '22%', left: '28%', fontSize: '1.4rem', color: '#F2B705' }}>✨</Box>
      <Box component={motion.div} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} sx={{ position: 'absolute', top: '75%', left: '14%', fontSize: '1.6rem', color: '#38BDF8' }}>⭐</Box>
      <Box component={motion.div} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }} sx={{ position: 'absolute', top: '30%', left: '85%', fontSize: '1.5rem', color: '#EC4899' }}>✨</Box>
    </Box>
  );
}
