import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import TutorBuddy from './TutorBuddy';
import { CuriousGirl, LittleScientist, LittleCoder, CuriousBoy } from './CharacterFamily';

const SUBJECTS = [
  {
    id: 'maths',
    name: 'Mathematics 🔢',
    grade: 'Classes 1 - 12',
    color: '#2D6CDF',
    character: CuriousBoy,
    miniScene: 'math',
    desc: 'Master equations, geometry & algebra.',
    tilt: 'sticker-tilt-left'
  },
  {
    id: 'science',
    name: 'Science Lab 🧪',
    grade: 'Classes 1 - 10',
    color: '#1FAA59',
    character: LittleScientist,
    miniScene: 'science',
    desc: 'Explore physics, chemistry & biology.',
    tilt: 'sticker-tilt-right'
  },
  {
    id: 'coding',
    name: 'Coding Zone 💻',
    grade: 'Classes 5 - 12',
    color: '#9C27B0',
    character: LittleCoder,
    miniScene: 'coding',
    desc: 'Build apps, games & websites.',
    tilt: 'sticker-tilt-left'
  },
  {
    id: 'english',
    name: 'English Grammar 📚',
    grade: 'Classes 1 - 12',
    color: '#F2B705',
    character: CuriousGirl,
    miniScene: 'reading',
    desc: 'Improve speaking, writing & reading.',
    tilt: 'sticker-tilt-right'
  },
];

// Mini-Scene interactive elements
const MiniSceneElements = ({ scene, isHovered }) => {
  if (scene === 'math') {
    return (
      <Box sx={{ position: 'absolute', top: 10, right: 10, pointerEvents: 'none' }}>
        <motion.div animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <Typography sx={{ color: '#2D6CDF', fontWeight: 900, fontFamily: '"Fredoka", cursive', fontSize: '1.2rem' }}>2+2=4 ✓</Typography>
        </motion.div>
      </Box>
    );
  }
  if (scene === 'science') {
    return (
      <Box sx={{ position: 'absolute', top: 10, right: 20, pointerEvents: 'none' }}>
        {isHovered && (
          <>
            <motion.div animate={{ opacity: [0, 1, 0], y: [0, -20] }} transition={{ repeat: Infinity, duration: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34D399' }} />
            </motion.div>
            <motion.div animate={{ opacity: [0, 1, 0], y: [0, -15] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#A7F3D0', ml: 1 }} />
            </motion.div>
          </>
        )}
      </Box>
    );
  }
  if (scene === 'coding') {
    return (
      <Box sx={{ position: 'absolute', top: 10, right: 10, pointerEvents: 'none' }}>
        <motion.div animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? -5 : 0 }} transition={{ duration: 0.3 }}>
          <Typography sx={{ color: '#9C27B0', fontWeight: 900, fontFamily: 'monospace', fontSize: '1.2rem' }}>&lt;/&gt;</Typography>
        </motion.div>
      </Box>
    );
  }
  if (scene === 'reading') {
    return (
      <Box sx={{ position: 'absolute', top: 15, right: 15, pointerEvents: 'none' }}>
        {isHovered && (
          <motion.div animate={{ opacity: 1, rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5 }}>
            <Typography sx={{ fontSize: '1.5rem' }}>⭐</Typography>
          </motion.div>
        )}
      </Box>
    );
  }
  return null;
};

export default function PopularClasses() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{
      py: { xs: 8, md: 12 },
      bgcolor: isDark ? '#0C172C' : '#F8FAFC',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <TutorBuddy size={48} animate="float" />
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
            What Do You Want to Explore? 🎒
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
            Dive into our miniature learning worlds! Find expert tutors for every subject and start your adventure today.
          </Typography>
        </Box>

        {/* 4 Cards Grid - Miniature Learning Worlds */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: { xs: 3, md: 3.5 },
          alignItems: 'stretch',
        }}>
          {SUBJECTS.map((subject, idx) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
              style={{ width: '100%', height: '100%' }}
            >
              <HoverableLearningWorldCard subject={subject} isDark={isDark} navigate={navigate} />
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// Separate component to handle per-card hover state cleanly
function HoverableLearningWorldCard({ subject, isDark, navigate }) {
  const [isHovered, setIsHovered] = useState(false);
  const { id, name, grade, color, character: CharComp, miniScene, desc, tilt } = subject;

  return (
    <Card
      className={tilt}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate('/find-tutor')}
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '32px',
        bgcolor: isDark ? '#162447' : '#ffffff',
        border: `3px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
        position: 'relative',
        overflow: 'visible',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        ...(isHovered && {
          transform: 'translateY(-15px) rotate(0deg) !important', // Straightens out the tilt and lifts
          borderColor: color,
          boxShadow: `0 25px 50px ${color}35`,
          zIndex: 10,
        })
      }}
    >
      <MiniSceneElements scene={miniScene} isHovered={isHovered} />

      <CardContent sx={{ p: { xs: 3, sm: 3.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Character Miniature Scene */}
        <Box sx={{ 
          height: 140, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-end', 
          mb: 3,
          position: 'relative'
        }}>
          {/* Subtle ground shadow for depth */}
          <Box sx={{ position: 'absolute', bottom: -5, width: 100, height: 10, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.05)', filter: 'blur(3px)' }} />
          
          <motion.div animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
            <CharComp width={110} height={130} />
          </motion.div>
        </Box>

        {/* Grade Badge */}
        <Box sx={{ display: 'flex', mb: 1.5 }}>
          <Chip
            label={grade}
            size="small"
            sx={{
              bgcolor: `${color}15`,
              color: color,
              fontWeight: 800,
              fontSize: '0.75rem',
              borderRadius: '16px',
              border: `1px solid ${color}40`,
              fontFamily: '"Fredoka", sans-serif',
            }}
          />
        </Box>

        {/* Subject Name */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Fredoka", "Nunito", sans-serif',
            fontWeight: 800,
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.35rem', sm: '1.5rem' },
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            mb: 3,
            flexGrow: 1,
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 600,
          }}
        >
          {desc}
        </Typography>

        {/* Action Link */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 2,
          borderTop: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
          mt: 'auto',
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isHovered ? color : 'text.secondary', transition: 'color 0.3s ease', fontFamily: '"Fredoka", sans-serif' }}>
            Explore World
          </Typography>
          <motion.div animate={{ x: isHovered ? 8 : 0, color: isHovered ? color : '#94A3B8' }} transition={{ duration: 0.3 }}>
            <ArrowForwardIcon sx={{ fontSize: 22 }} />
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  );
}
