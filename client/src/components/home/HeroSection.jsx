import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { useTeacherApplication } from '../../context/TeacherApplicationContext';
import HeroVisual from './HeroVisual';
import FormulaDoodlesBackground from './FormulaDoodlesBackground';

export default function HeroSection() {
  const navigate = useNavigate();
  const { openTeacherApplication } = useTeacherApplication();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      bgcolor: '#080E1A',
      pt: { xs: 5, sm: 8, md: 10 },
      pb: { xs: 12, md: 15 },
      minHeight: { md: '90vh' },
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Interactive Hand-Drawn Math & Science Formulas Background */}
      <FormulaDoodlesBackground />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: { xs: 6, md: 4 },
            alignItems: 'center',
          }}
        >
          {/* Left Column: Storytelling Messaging & Action CTAs */}
          <Box>
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 3 }}>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ color: '#F2B705 !important', fontSize: '18px !important' }} />}
                  label="✨ Welcome to your learning universe! ✨"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(242,183,5,0.15)',
                    color: '#F2B705',
                    border: '1px solid rgba(242,183,5,0.4)',
                    py: { xs: 1, sm: 1.5, md: 2 },
                    px: { xs: 2, sm: 2.5, md: 3 },
                    fontWeight: 800,
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.15rem', lg: '1.3rem' },
                    fontFamily: '"Fredoka", sans-serif',
                    minHeight: { xs: 36, sm: 40, md: 50 },
                    width: { xs: 'auto', md: '90%', lg: '75%' },
                    maxWidth: { md: 580, lg: 680, xl: 750 },
                    mx: { xs: 'auto', md: 0 },
                    boxShadow: { md: '0 4px 20px rgba(242,183,5,0.15)', lg: '0 6px 30px rgba(242,183,5,0.2)' },
                    '& .MuiChip-label': { whiteSpace: 'nowrap' },
                  }}
                />
              </Box>
            </motion.div>

            {/* Playful 3D Headline */}
            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 'clamp(2.4rem, 11vw, 3.2rem)', sm: '3.8rem', md: '4.5rem', lg: '5.2rem' },
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  mb: 2.5,
                  letterSpacing: '-0.02em',
                  fontFamily: '"Fredoka", "Nunito", sans-serif',
                }}
              >
                Learn.<br />
                Explore.<br />
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    color: '#F2B705',
                    position: 'relative',
                    textShadow: '0 5px 30px rgba(242,183,5,0.5)',
                  }}
                >
                  Have FUN! 🚀
                  {/* Drawn underline */}
                  <svg style={{ position: 'absolute', bottom: -10, left: 0, width: '100%', height: 20 }} viewBox="0 0 200 20" preserveAspectRatio="none">
                    <motion.path 
                      d="M5,15 Q100,0 195,15" 
                      stroke="#38BDF8" 
                      strokeWidth="5" 
                      strokeLinecap="round" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                    />
                  </svg>
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 600,
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: { xs: 340, sm: 580 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                Step into an interactive adventure with verified expert tutors who make 1-on-1 online classes absolutely magical.
              </Typography>
            </motion.div>

            {/* Action Buttons with Rocket Launch Interaction */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/find-tutor')}
                  sx={{
                    py: 1.8,
                    px: 4.5,
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    borderRadius: '30px',
                    bgcolor: '#F2B705',
                    color: '#1B2A4A',
                    boxShadow: '0 8px 25px rgba(242,183,5,0.4)',
                    textTransform: 'none',
                    fontFamily: '"Fredoka", sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      bgcolor: '#ffca28',
                      boxShadow: '0 15px 35px rgba(242,183,5,0.6)',
                      transform: 'translateY(-5px)',
                      '& .rocket-icon': {
                        transform: 'translate(10px, -10px) scale(1.2)',
                      },
                      '& .trail': {
                        opacity: 1,
                        width: '20px'
                      }
                    },
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>Find Your Tutor</span>
                  <Box className="rocket-icon" sx={{ ml: 1, display: 'flex', alignItems: 'center', transition: 'all 0.4s ease' }}>
                    🚀
                    <Box className="trail" sx={{ position: 'absolute', right: '100%', top: '50%', height: '2px', bgcolor: '#fff', opacity: 0, width: 0, transition: 'all 0.3s ease' }} />
                  </Box>
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={openTeacherApplication}
                  sx={{
                    py: 1.8,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    borderRadius: '30px',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    textTransform: 'none',
                    fontFamily: '"Fredoka", sans-serif',
                    '&:hover': {
                      borderColor: '#38BDF8',
                      bgcolor: 'rgba(56, 189, 248, 0.15)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)',
                      '& .teacher-icon': { transform: 'scale(1.2) rotate(10deg)' }
                    },
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Box className="teacher-icon" sx={{ mr: 1, transition: 'transform 0.3s ease' }}>👩‍🏫</Box>
                  Become a Teacher
                </Button>
              </Box>
            </motion.div>
          </Box>

          {/* Right Column: Interactive Character Parallax Scene */}
          <motion.div variants={itemVariants}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <HeroVisual />
            </Box>
          </motion.div>
        </Box>
      </Container>

      {/* Unique Transition: Rocket Trail curve into next section */}
      <Box sx={{
        position: 'absolute',
        bottom: -1,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        zIndex: 2,
      }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60, fill: '#0A1128' }}>
          <path d="M0,0 C300,100 900,-50 1200,80 L1200,120 L0,120 Z"></path>
        </svg>
      </Box>
    </Box>
  );
}
