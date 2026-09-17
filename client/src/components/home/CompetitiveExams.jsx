import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Chip, useTheme, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FlagIcon from '@mui/icons-material/Flag';
import { useNavigate } from 'react-router-dom';
import TutorBuddy from './TutorBuddy';
import { LittleScientist, LittleCoder, CuriousBoy } from './CharacterFamily';

const MISSIONS = [
  {
    id: 'jee',
    name: 'JEE Mission 🚀',
    category: 'Engineering',
    quote: 'Reach the next level in Mathematics & Physics.',
    character: CuriousBoy,
    badge: 'Mission: IIT',
    color: '#2D6CDF',
    bgTint: 'rgba(45, 108, 223, 0.12)',
    progress: 85,
  },
  {
    id: 'neet',
    name: 'NEET Mission 🧪',
    category: 'Medical',
    quote: 'Your future doctor journey begins here.',
    character: LittleScientist,
    badge: 'Mission: Doctor',
    color: '#1FAA59',
    bgTint: 'rgba(31, 170, 89, 0.12)',
    progress: 70,
  },
  {
    id: 'upsc',
    name: 'UPSC Mission 🏛️',
    category: 'Civil Services',
    quote: 'Dream to lead. Start your preparation.',
    character: CuriousBoy, // Can be swapped for a different character later
    badge: 'Mission: Leader',
    color: '#F2B705',
    bgTint: 'rgba(242, 183, 5, 0.14)',
    progress: 60,
  },
  {
    id: 'cuet',
    name: 'CUET Mission 🎯',
    category: 'University',
    quote: 'Your next great university adventure.',
    character: LittleCoder,
    badge: 'Mission: Campus',
    color: '#9C27B0',
    bgTint: 'rgba(156, 39, 176, 0.12)',
    progress: 40,
  },
];

export default function CompetitiveExams() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{
      py: { xs: 8, md: 12 },
      bgcolor: isDark ? '#081021' : '#F0F4FF',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <TutorBuddy size={44} animate="wave" signText="Challenge Accepted!" />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
              color: 'text.primary',
            }}
          >
            Ready for a Challenge? 🏆
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 640,
              mx: 'auto',
              fontSize: { xs: '1.02rem', md: '1.15rem' },
              lineHeight: 1.6,
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 600,
            }}
          >
            Select your entrance exam mission and let our expert guides help you reach the finish line.
          </Typography>
        </Box>

        {/* Missions Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: { xs: 3, md: 3.5 },
          alignItems: 'stretch',
        }}>
          {MISSIONS.map((mission, idx) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
              style={{ width: '100%', height: '100%' }}
            >
              <MissionCard mission={mission} isDark={isDark} navigate={navigate} />
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function MissionCard({ mission, isDark, navigate }) {
  const [isHovered, setIsHovered] = useState(false);
  const { id, name, quote, character: CharComp, badge, color, bgTint, progress } = mission;

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate('/find-tutor')}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '28px',
        bgcolor: isDark ? '#162447' : '#ffffff',
        border: `3px solid ${isHovered ? color : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0')}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isHovered ? `0 20px 45px ${color}35` : 'none',
        transform: isHovered ? 'translateY(-10px)' : 'none',
      }}
    >
      <Box sx={{ height: 6, width: '100%', bgcolor: color }} />

      <CardContent sx={{ p: { xs: 3, sm: 3.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Mission Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip
            icon={<FlagIcon sx={{ fontSize: '16px !important', color: `${color} !important` }} />}
            label={badge}
            size="small"
            sx={{
              bgcolor: bgTint,
              color: color,
              fontWeight: 800,
              fontSize: '0.75rem',
              borderRadius: '12px',
              fontFamily: '"Fredoka", sans-serif',
            }}
          />
          <motion.div animate={{ rotate: isHovered ? [0, 20, -10, 0] : [0, 0] }} transition={{ duration: 0.5 }}>
            <AutoAwesomeIcon sx={{ color: '#F2B705' }} />
          </motion.div>
        </Box>

        {/* Character Illustration */}
        <Box sx={{ 
          height: 120, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-end', 
          mb: 3,
          position: 'relative'
        }}>
          <Box sx={{ position: 'absolute', bottom: -5, width: 80, height: 8, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.05)', filter: 'blur(3px)' }} />
          <motion.div animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
            {CharComp && <CharComp width={100} height={110} />}
          </motion.div>
        </Box>

        {/* Exam Name */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Fredoka", "Nunito", sans-serif',
            fontWeight: 800,
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.3rem', sm: '1.45rem' },
          }}
        >
          {name}
        </Typography>

        {/* Motivational Story Quote */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            mb: 3,
            flexGrow: 1,
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 700,
          }}
        >
          {quote}
        </Typography>

        {/* Visual "Mission Progress" */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', fontFamily: '"Fredoka", sans-serif' }}>Mission Path</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: color, fontFamily: '"Fredoka", sans-serif' }}>{isHovered ? 'Active!' : ''}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={isHovered ? 100 : progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4, 
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9',
              '& .MuiLinearProgress-bar': {
                bgcolor: color,
                transition: 'transform 0.8s ease-out'
              }
            }} 
          />
        </Box>

        {/* Footer Link */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 2,
          borderTop: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isHovered ? color : 'text.secondary', fontFamily: '"Fredoka", sans-serif', transition: 'color 0.3s' }}>
            Start Mission
          </Typography>
          <motion.div animate={{ x: isHovered ? 8 : 0, color: isHovered ? color : '#94A3B8' }} transition={{ duration: 0.3 }}>
            <ArrowForwardIcon sx={{ fontSize: 20 }} />
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  );
}
