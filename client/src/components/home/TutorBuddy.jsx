import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// --- Shared Anime Eye Component (Highly Detailed) ---
const DetailedAnimeEye = ({ cx, cy, lookX = 0, lookY = 0, eyeColor = '#3B82F6' }) => (
  <g transform={`translate(${cx + lookX}, ${cy + lookY})`}>
    {/* Eyelashes / Upper Lid */}
    <path d="M-6 -4 C-2 -7 2 -7 6 -3 L7 -4 C3 -8 -3 -8 -7 -4 Z" fill="#1A1C29" />
    <path d="M-6 -4 C-8 -2 -8 0 -8 0 L-7 -1 C-7 -1 -7 -3 -5 -3 Z" fill="#1A1C29" />
    <path d="M6 -3 C7 -1 7 0 7 0 L6 -1 C6 -1 6 -2 5 -2 Z" fill="#1A1C29" />
    
    {/* Sclera (White) */}
    <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="#FFFFFF" />
    
    {/* Iris (Colored with Gradient) */}
    <defs>
      <linearGradient id={`tb-iris-${cx}-${cy}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A1C29" />
        <stop offset="50%" stopColor={eyeColor} />
        <stop offset="100%" stopColor="#93C5FD" />
      </linearGradient>
    </defs>
    <ellipse cx="0" cy="0.5" rx="3.5" ry="4.5" fill={`url(#tb-iris-${cx}-${cy})`} />
    
    {/* Pupil */}
    <ellipse cx="0" cy="0" rx="1.5" ry="2.5" fill="#0F172A" />
    
    {/* Catchlights (Highlights) */}
    <circle cx="-1.5" cy="-1.5" r="1.2" fill="#FFFFFF" />
    <circle cx="1.2" cy="2.2" r="0.6" fill="#FFFFFF" opacity="0.8" />
  </g>
);

export default function TutorBuddy({
  size = 70,
  signText = null,
  animate = 'wave', // 'wave' | 'float' | 'bounce'
  sx = {}
}) {
  
  const buddyVariants = {
    wave: { rotate: [0, 5, -2, 4, 0], transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' } },
    float: { y: [0, -6, 0], transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' } },
    bounce: { y: [0, -8, 0], scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }
  };

  return (
    <Box sx={{
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      userSelect: 'none',
      ...sx,
    }}>
      {/* Floating Speech Bubble */}
      {signText && (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{ marginBottom: '10px' }}
        >
          <Box sx={{
            px: 1.6,
            py: 0.6,
            borderRadius: '16px',
            bgcolor: '#F2B705',
            color: '#1B2A4A',
            boxShadow: '0 8px 20px rgba(242, 183, 5, 0.4)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              borderWidth: '6px 6px 0 6px',
              borderStyle: 'solid',
              borderColor: '#F2B705 transparent transparent transparent',
            }
          }}>
            <Typography variant="caption" sx={{
              fontFamily: '"Fredoka", cursive, sans-serif',
              fontWeight: 800,
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              display: 'block',
            }}>
              {signText}
            </Typography>
          </Box>
        </motion.div>
      )}

      {/* Modern Anime Human Half-Body Illustration */}
      <motion.div
        variants={buddyVariants}
        animate={animate}
        style={{ width: size, height: size * 1.2, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' }}
      >
        <svg width="100%" height="100%" viewBox="0 0 120 144" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tb-skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF1E8" />
              <stop offset="100%" stopColor="#FFDBC4" />
            </linearGradient>
            <linearGradient id="tb-skin-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFDBC4" />
              <stop offset="100%" stopColor="#FDBA9B" />
            </linearGradient>
            <linearGradient id="tb-shirt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="tb-hair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Back Hair */}
          <path d="M30 35 C20 70 25 100 35 110 C40 80 45 60 50 50 Z" fill="url(#tb-hair)" />
          <path d="M90 35 C100 70 95 100 85 110 C80 80 75 60 70 50 Z" fill="url(#tb-hair)" />

          {/* Body/Shirt */}
          <path d="M25 144 C25 90 40 75 60 75 C80 75 95 90 95 144 Z" fill="url(#tb-shirt)" />
          <path d="M50 75 L60 100 L70 75 Z" fill="#E2E8F0" />
          
          {/* Neck */}
          <path d="M54 65 L66 65 L66 80 L54 80 Z" fill="url(#tb-skin-shade)" />
          <path d="M54 65 L66 65 L66 72 C66 76 54 76 54 72 Z" fill="url(#tb-skin)" />

          {/* Face */}
          <path d="M40 45 C40 20 80 20 80 45 C80 65 72 75 60 75 C48 75 40 65 40 45 Z" fill="url(#tb-skin)" />

          {/* Eyes */}
          <DetailedAnimeEye cx="50" cy="50" eyeColor="#059669" />
          <DetailedAnimeEye cx="70" cy="50" eyeColor="#059669" />

          {/* Eyebrows */}
          <path d="M45 42 Q50 40 55 43" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M75 42 Q70 40 65 43" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Nose */}
          <path d="M59 58 Q60 61 61 58" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />

          {/* Smile */}
          <path d="M55 64 Q60 68 65 64 Z" fill="#9F1239" />
          <path d="M57 66 Q60 68 63 66 Z" fill="#FDA4AF" />

          {/* Hair Front Bangs */}
          <path d="M38 40 Q45 25 60 25 Q75 25 82 40 Q75 32 60 32 Q45 32 38 40 Z" fill="url(#tb-hair)" />
          <path d="M40 25 Q60 12 80 25 Q70 20 60 20 Q50 20 40 25 Z" fill="url(#tb-hair)" />
          <path d="M50 20 Q60 35 70 20 Q65 25 60 25 Q55 25 50 20 Z" fill="url(#tb-hair)" />

          {/* Waving Hand */}
          {animate === 'wave' && (
            <motion.g
              animate={{ rotate: [0, 20, -10, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ transformOrigin: '80px 100px' }}
            >
              <path d="M90 90 L105 60" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" />
              <circle cx="105" cy="55" r="8" fill="url(#tb-skin)" />
              <path d="M102 55 C100 50 108 50 108 55" stroke="#E5A681" strokeWidth="1" fill="none" />
            </motion.g>
          )}
        </svg>
      </motion.div>
    </Box>
  );
}
