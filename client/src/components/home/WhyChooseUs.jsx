import { Box, Container, Typography, Card, CardContent, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import HelpIcon from '@mui/icons-material/Help';
import TutorBuddy from './TutorBuddy';

const FEATURES = [
  {
    id: 'verification',
    title: 'Safe & Verified 🛡️',
    desc: 'Every tutor undergoes strict identity and background screening.',
    accent: '#1FAA59',
    badge: '100% Safe',
    illustration: 'shield',
  },
  {
    id: 'demo',
    title: 'Zero-Risk Free Demo 🎁',
    desc: 'Meet your recommended tutor for a free trial session first.',
    accent: '#F2B705',
    badge: 'Try First',
    illustration: 'demo',
  },
  {
    id: 'matching',
    title: 'Perfect Matching 💛',
    desc: 'Matched based on subject, grade, and learning style.',
    accent: '#2D6CDF',
    badge: 'Tailored Match',
    illustration: 'match',
  },
  {
    id: 'support',
    title: 'Dedicated Support 🆘',
    desc: 'A personal academic manager tracks scores and schedules.',
    accent: '#9C27B0',
    badge: '24/7 Help',
    illustration: 'support',
  },
];

import { CuriousBoy, CuriousGirl, FriendlyTutor, AchievementStar } from './CharacterFamily';

// Miniature visual story SVGs for each benefit
const BenefitIllustration = ({ type, color }) => {
  return (
    <Box sx={{ width: 120, height: 140, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative' }}>
      {/* Decorative background circle */}
      <Box sx={{ position: 'absolute', bottom: 10, width: 80, height: 80, borderRadius: '50%', bgcolor: `${color}15`, zIndex: 0 }} />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {type === 'shield' && (
          <AchievementStar width={100} height={120} />
        )}
        {type === 'demo' && (
          <CuriousGirl width={100} height={120} />
        )}
        {type === 'match' && (
          <CuriousBoy width={100} height={120} />
        )}
        {type === 'support' && (
          <FriendlyTutor width={100} height={120} />
        )}
      </Box>
    </Box>
  );
};

export default function WhyChooseUs() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{
      py: { xs: 8, md: 12 },
      bgcolor: isDark ? '#0C172C' : '#ffffff',
      position: 'relative',
    }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <TutorBuddy size={50} animate="float" />
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
            Why Families Love 75 Way Project Task ⭐
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
            We combine rigorous tutor vetting with personalized academic management so your child receives a secure, top-quality learning adventure.
          </Typography>
        </Box>

        {/* Feature Cards Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 3, md: 4 },
          alignItems: 'stretch',
        }}>
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
              style={{ width: '100%', height: '100%' }}
            >
              <FeatureCard feature={feature} isDark={isDark} />
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function FeatureCard({ feature, isDark }) {
  const { title, desc, accent, badge, illustration } = feature;
  
  return (
    <motion.div whileHover={{ y: -10 }} transition={{ type: 'spring', stiffness: 300 }} style={{ height: '100%' }}>
      <Card
        elevation={0}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '32px',
          bgcolor: isDark ? '#162447' : '#F8FAFC',
          border: `3px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
          p: { xs: 3, sm: 4 },
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: accent,
            bgcolor: isDark ? '#1a2c56' : '#ffffff',
            boxShadow: `0 25px 50px ${accent}25`,
          },
        }}
      >
        <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <Chip
            label={badge}
            size="small"
            sx={{
              bgcolor: `${accent}15`,
              color: accent,
              fontWeight: 900,
              fontSize: '0.8rem',
              fontFamily: '"Fredoka", sans-serif',
              mb: 3,
            }}
          />

          <Box sx={{ mb: 2 }}>
            <BenefitIllustration type={illustration} color={accent} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              fontWeight: 800,
              mb: 1.5,
              color: 'text.primary',
              fontSize: { xs: '1.35rem', sm: '1.45rem' },
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.65,
              fontSize: '1rem',
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 600,
            }}
          >
            {desc}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
