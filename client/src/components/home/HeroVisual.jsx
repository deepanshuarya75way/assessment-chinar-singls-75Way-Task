import { Box, Paper, Typography, Avatar, Rating } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TutorBuddy from './TutorBuddy';
import { CuriousBoy, CuriousGirl, FriendlyTutor } from './CharacterFamily';

export default function HeroVisual() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Background Parallax
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);
  
  // Foreground Parallax (Opposite direction for depth)
  const fgX = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
  const fgY = useTransform(smoothY, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <Box 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: '100%', sm: 650 },
        mx: 'auto',
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1000px'
      }}
    >
      {/* Background Radial Glow Blobs */}
      <Box component={motion.div} style={{ x: bgX, y: bgY }} sx={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: 340,
        height: 340,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(242,183,5,0.4) 0%, rgba(242,183,5,0) 70%)',
        filter: 'blur(45px)',
        pointerEvents: 'none',
      }} />

      {/* Main Learning Playground Frame */}
      <Paper 
        component={motion.div}
        elevation={0} 
        style={{ rotateX: useTransform(smoothY, [-0.5, 0.5], [3, -3]), rotateY: useTransform(smoothX, [-0.5, 0.5], [-3, 3]) }}
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: '32px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top Header Tag inside Card */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, transform: 'translateZ(20px)' }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.8,
            borderRadius: '20px',
            bgcolor: 'rgba(242, 183, 5, 0.2)',
            border: '1.5px solid rgba(242, 183, 5, 0.5)',
            color: '#F2B705',
            fontWeight: 800,
            fontSize: '0.85rem',
            fontFamily: '"Fredoka", sans-serif',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 18, color: '#F2B705' }} />
            <span>Interactive Learning World 🌟</span>
          </Box>
        </Box>

        {/* 🎨 ILLUSTRATION SCENE: Overlapping Anime Characters */}
        <Box sx={{
          position: 'relative',
          width: '100%',
          py: 2,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          minHeight: { xs: 160, sm: 250 },
          transformStyle: 'preserve-3d'
        }}>
          {/* 1. Tutor Buddy Mascot Waving */}
          <Box component={motion.div} style={{ x: fgX, y: fgY }} sx={{ position: 'absolute', top: -45, left: 10, zIndex: 4, transform: 'translateZ(50px)' }}>
            <TutorBuddy size={65} signText="Hi there!" animate="wave" />
          </Box>

          {/* 2. Curious Girl Character */}
          <Box component={motion.div} style={{ x: useTransform(smoothX, [-0.5, 0.5], [10, -10]) }} sx={{ zIndex: 2, transform: 'translateZ(30px)' }}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
              <CuriousGirl width={{ xs: 85, sm: 130 }} height={{ xs: 100, sm: 150 }} />
            </motion.div>
          </Box>

          {/* 3. Friendly Tutor Character (Center, Largest) */}
          <Box component={motion.div} style={{ x: useTransform(smoothX, [-0.5, 0.5], [5, -5]) }} sx={{ zIndex: 1, transform: 'translateZ(10px)', mx: -2 }}>
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
              <FriendlyTutor width={{ xs: 110, sm: 170 }} height={{ xs: 125, sm: 190 }} />
            </motion.div>
          </Box>

          {/* 4. Curious Boy Character */}
          <Box component={motion.div} style={{ x: useTransform(smoothX, [-0.5, 0.5], [15, -15]) }} sx={{ zIndex: 3, transform: 'translateZ(40px)' }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}>
              <CuriousBoy width={{ xs: 85, sm: 130 }} height={{ xs: 100, sm: 150 }} />
            </motion.div>
          </Box>
        </Box>

        {/* Highlight Banner */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'rgba(12, 23, 44, 0.9)',
          borderRadius: '24px',
          p: { xs: 2, sm: 2.5 },
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          mt: 2,
          transform: 'translateZ(30px)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: { xs: 44, sm: 52 }, height: { xs: 44, sm: 52 }, bgcolor: '#2D6CDF', border: '2.5px solid #38BDF8', fontWeight: 800 }}>TC</Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '1rem', fontFamily: '"Fredoka", sans-serif' }}>
                  Verified Expert Tutors
                </Typography>
                <VerifiedIcon sx={{ color: '#38BDF8', fontSize: 18 }} />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}>
                1-on-1 Classes · Grades 1–12
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            <Rating value={5} readOnly size="small" sx={{ color: '#F2B705' }} />
          </Box>
        </Box>
      </Paper>
      
      {/* Easter Egg / Formula of the day */}
      <Box component={motion.div} style={{ x: fgX, y: fgY }} sx={{
        position: 'absolute',
        top: { xs: 'auto', sm: -20 },
        bottom: { xs: -25, sm: 'auto' },
        right: { xs: '50%', sm: -30 },
        transform: { xs: 'translateX(50%)', sm: 'none' },
        zIndex: 5,
        px: { xs: 2, sm: 2.5 },
        py: { xs: 1.2, sm: 1.5 },
        borderRadius: '20px',
        bgcolor: '#0F172A',
        border: '2px solid #F59E0B',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
        maxWidth: { xs: 180, sm: 'none' },
      }}>
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
          <Typography variant="caption" sx={{ color: '#FCD34D', fontWeight: 800, display: 'block', fontSize: '0.85rem', fontFamily: '"Fredoka", sans-serif' }}>
            ✨ Today's Brain Spark
          </Typography>
          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 900, fontFamily: '"Nunito", sans-serif', textAlign: 'center' }}>
            2 + 2 = 4
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );

}
