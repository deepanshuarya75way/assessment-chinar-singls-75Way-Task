import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const FORMULAS = [
  { formula: 'E = mc²', label: 'Physics · Relativity', color: '#F2B705', bg: 'rgba(242, 183, 5, 0.15)' },
  { formula: 'a² + b² = c²', label: 'Math · Pythagoras', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
  { formula: 'F = ma', label: 'Newton\'s Law', color: '#1FAA59', bg: 'rgba(31, 170, 89, 0.15)' },
  { formula: 'H₂O & CO₂', label: 'Chemistry Fundamentals', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
  { formula: 'A = πr²', label: 'Geometry · Circle', color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.15)' },
  { formula: '2 + 2 = 4', label: 'Fun Math Adventure', color: '#FF7A00', bg: 'rgba(255, 122, 0, 0.15)' },
  { formula: 'V = u + at', label: 'Kinematics Motion', color: '#2D6CDF', bg: 'rgba(45, 108, 223, 0.15)' },
  { formula: '∫ x dx = ½x²', label: 'Calculus Magic', color: '#00D2B8', bg: 'rgba(0, 210, 184, 0.15)' },
];

export default function FormulaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % FORMULAS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const active = FORMULAS[currentIndex];
  const next = FORMULAS[(currentIndex + 1) % FORMULAS.length];

  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1.5,
      py: 1,
      px: 2,
      borderRadius: '30px',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.2,
        transition: 'all 0.5s ease',
      }}>
        {/* Animated Formula Pill */}
        <Paper elevation={0} sx={{
          px: 1.8,
          py: 0.6,
          borderRadius: '20px',
          bgcolor: active.bg,
          border: `1.5px solid ${active.color}60`,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          boxShadow: `0 4px 14px ${active.color}30`,
          transition: 'all 0.4s ease-in-out',
        }}>
          <Typography variant="body2" sx={{
            fontFamily: 'monospace',
            fontWeight: 800,
            color: active.color,
            fontSize: { xs: '0.95rem', sm: '1.1rem' },
            letterSpacing: '0.5px',
          }}>
            {active.formula}
          </Typography>
          <Typography variant="caption" sx={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: 700,
            fontSize: '0.72rem',
            bgcolor: 'rgba(0,0,0,0.2)',
            px: 1,
            py: 0.2,
            borderRadius: '10px',
          }}>
            {active.label}
          </Typography>
        </Paper>

        {/* Sneak peek at next formula */}
        <Box sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.5, filter: 'blur(0.5px)' }}>
          <Typography variant="caption" sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#ffffff',
            fontSize: '0.85rem',
          }}>
            next: {next.formula}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
