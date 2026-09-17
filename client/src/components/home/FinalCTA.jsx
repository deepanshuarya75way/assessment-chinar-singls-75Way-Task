import { useState } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import TutorBuddy from './TutorBuddy';
import { CuriousBoy, CuriousGirl } from './CharacterFamily';

export default function FinalCTA() {
  const navigate = useNavigate();
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  return (
    <Box sx={{
      py: { xs: 8, md: 14 },
      bgcolor: '#080E1A',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorative Radial Blobs */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        left: -100,
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(242,183,5,0.2) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80 }}
          elevation={0} 
          sx={{
            p: { xs: 4, sm: 6, md: 0 },
            borderRadius: '40px',
            background: 'linear-gradient(135deg, #111C35 0%, #1E3A6E 50%, #2D6CDF 100%)',
            border: '3px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            position: 'relative',
            overflow: 'visible', // allow characters to break out of the box
            display: 'flex',
            alignItems: 'center',
            minHeight: 450,
          }}
        >
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            width: '100%',
            alignItems: 'center',
            height: '100%'
          }}>
            {/* LEFT: Text & Actions */}
            <Box sx={{ pl: { md: 8 }, py: { md: 8 }, zIndex: 3 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <TutorBuddy size={50} animate="bounce" signText="Let's Go! 🎒" />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Fredoka", "Nunito", sans-serif',
                  fontWeight: 900,
                  color: '#ffffff',
                  fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                  lineHeight: 1.15,
                  mb: 2.5,
                }}
              >
                Ready for a<br/>
                <span style={{ color: '#F2B705' }}>Learning Adventure?</span> 🚀
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  mb: 5,
                  maxWidth: 500,
                  fontFamily: '"Nunito", sans-serif',
                  lineHeight: 1.5
                }}
              >
                Let's learn something amazing today! Find a friendly tutor who makes learning fun, engaging, and rewarding.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/find-tutor')}
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                  sx={{
                    py: 2,
                    px: 4.5,
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    borderRadius: '32px',
                    bgcolor: '#F2B705',
                    color: '#1B2A4A',
                    boxShadow: '0 10px 30px rgba(242,183,5,0.4)',
                    textTransform: 'none',
                    fontFamily: '"Fredoka", sans-serif',
                    '&:hover': {
                      bgcolor: '#ffca28',
                      boxShadow: '0 15px 40px rgba(242,183,5,0.6)',
                      transform: 'translateY(-5px)',
                      '& .arrow': { transform: 'translateX(8px)' }
                    },
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  Find My Tutor <ArrowForwardIcon className="arrow" sx={{ ml: 1, transition: 'transform 0.3s' }} />
                </Button>
              </Box>
            </Box>

            {/* RIGHT: Large Illustration Scene */}
            <Box sx={{ 
              position: 'relative', 
              height: '100%', 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'flex-end', 
              justifyContent: 'center',
              mr: 4
            }}>
              
              {/* Animated Giant Rocket in background */}
              <motion.div
                animate={{ 
                  y: isHoveringCTA ? -40 : [0, -10, 0],
                  scale: isHoveringCTA ? 1.05 : 1
                }}
                transition={{ 
                  y: { duration: isHoveringCTA ? 0.5 : 4, repeat: isHoveringCTA ? 0 : Infinity, ease: 'easeInOut' },
                  scale: { duration: 0.5 }
                }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  right: '25%',
                  fontSize: '8rem',
                  opacity: 0.9,
                  filter: 'drop-shadow(0 0 30px rgba(242, 183, 5, 0.5))',
                  zIndex: 1,
                }}
              >
                🚀
                {/* Rocket trail when hovering */}
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: isHoveringCTA ? 1 : 0, height: isHoveringCTA ? 80 : 0 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    width: 6,
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(to bottom, #F2B705, transparent)',
                    borderRadius: 3
                  }}
                />
              </motion.div>

              {/* Floating Background Educational Props */}
              <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} style={{ position: 'absolute', top: '15%', left: '15%', fontSize: '3rem', zIndex: 1 }}>⭐</motion.div>
              <motion.div animate={{ y: [0, -10, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} style={{ position: 'absolute', top: '40%', right: '10%', fontSize: '4rem', zIndex: 1 }}>💡</motion.div>
              <motion.div animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 6 }} style={{ position: 'absolute', top: '25%', right: '40%', fontSize: '2.5rem', zIndex: 1 }}>📚</motion.div>

              {/* Large Characters (Occupying ~50% visual area, overlapping box) */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', zIndex: 2, position: 'relative', bottom: -10 }}>
                {/* Girl */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  style={{ marginRight: '-20px' }}
                >
                  <CuriousGirl width={240} height={280} />
                </motion.div>
                
                {/* Boy */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.4 }}
                  style={{ zIndex: 3 }}
                >
                  <CuriousBoy width={260} height={300} />
                </motion.div>
              </Box>

            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
