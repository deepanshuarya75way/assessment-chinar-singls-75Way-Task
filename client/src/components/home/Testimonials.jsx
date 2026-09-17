import { Box, Container, Typography, Card, CardContent, Rating, useTheme, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShieldIcon from '@mui/icons-material/Shield';
import TutorBuddy from './TutorBuddy';
import { ParentMom, ParentDad } from './CharacterFamily';

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Parent of Class 8 Student',
    city: 'Delhi',
    rating: 5,
    quote: "Finding the right maths tutor became so easy! My daughter actually looks forward to her tuition classes now. Her test scores jumped from 72% to 94% in just two months!",
    avatarBg: '#2D6CDF',
    childClass: 'Class 8 Maths',
    tilt: 'sticker-tilt-left',
    avatarType: 'mom'
  },
  {
    id: 2,
    name: 'Arun Sharma',
    role: 'Parent of JEE Aspirant',
    city: 'Mumbai',
    rating: 5,
    quote: "The JEE Physics tutor matched with us is phenomenal. Deeply knowledgeable, friendly, and super disciplined. Best tuition matching platform in India hands down!",
    avatarBg: '#1FAA59',
    childClass: 'Class 12 JEE Physics',
    tilt: 'sticker-tilt-right',
    avatarType: 'dad'
  },
  {
    id: 3,
    name: 'Meena Rao',
    role: 'Parent of Class 5 Student',
    city: 'Bangalore',
    rating: 5,
    quote: "Very trustworthy platform! Background-verified tutors, free demo class, and prompt support. My son's foundation in Science & Maths has become crystal clear.",
    avatarBg: '#9C27B0',
    childClass: 'Class 5 All Subjects',
    tilt: 'sticker-tilt-left',
    avatarType: 'mom'
  },
];

export default function Testimonials() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{
      py: { xs: 8, md: 12 },
      bgcolor: isDark ? '#081021' : '#FFFBEB',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <TutorBuddy size={50} animate="bounce" signText="Parents Love Us! 💛" />
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
            Look Who's Learning With Us! ⭐
          </Typography>

          {/* Ratings Summary Pill */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap', mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff', px: 2.5, py: 1.2, borderRadius: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
              <Rating value={5} readOnly precision={0.5} size="small" sx={{ color: '#F2B705' }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: '"Fredoka", sans-serif' }}>
                4.9 / 5 <span style={{ color: theme.palette.text.secondary, fontWeight: 600 }}>(2,400+ Parent Reviews)</span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(31,170,89,0.15)', px: 2.5, py: 1.2, borderRadius: '24px', border: '1.5px solid rgba(31,170,89,0.35)' }}>
              <ShieldIcon sx={{ fontSize: 20, color: '#1FAA59' }} />
              <Typography variant="caption" sx={{ color: '#1FAA59', fontWeight: 800, fontSize: '0.9rem', fontFamily: '"Fredoka", sans-serif' }}>
                100% Verified Parent Recommendations
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 3 Scrapbook Card Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 3, md: 4 },
          alignItems: 'stretch',
        }}>
          {TESTIMONIALS_DATA.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, type: 'spring', stiffness: 100 }}
              style={{ width: '100%', height: '100%' }}
            >
              <TestimonialCard item={item} isDark={isDark} />
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function TestimonialCard({ item, isDark }) {
  return (
    <motion.div whileHover={{ y: -10, rotate: 0 }} transition={{ type: 'spring', stiffness: 300 }} style={{ height: '100%' }}>
      <Card
        className={item.tilt}
        elevation={0}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '32px',
          bgcolor: isDark ? '#162447' : '#ffffff',
          border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#F2B705'}`,
          p: { xs: 3, sm: 4 },
          position: 'relative',
          boxShadow: isDark ? '0 15px 35px rgba(0,0,0,0.4)' : '0 15px 40px rgba(242,183,5,0.2)',
          overflow: 'visible'
        }}
      >
        {/* Playful tape graphic */}
        <Box sx={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: 80, height: 25, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderRadius: '2px', zIndex: 2 }} />

        <FormatQuoteIcon sx={{ color: '#FCD34D', fontSize: 60, opacity: 0.3, position: 'absolute', top: 20, right: 20 }} />

        <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Rating value={item.rating} readOnly precision={0.5} size="small" sx={{ color: '#F2B705' }} />
            <Chip
              label={item.childClass}
              size="small"
              sx={{
                bgcolor: 'rgba(45, 108, 223, 0.12)',
                color: '#2D6CDF',
                fontWeight: 800,
                fontSize: '0.75rem',
                fontFamily: '"Fredoka", sans-serif',
              }}
            />
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              fontSize: { xs: '1.05rem', sm: '1.1rem' },
              lineHeight: 1.7,
              fontStyle: 'italic',
              mb: 4,
              flexGrow: 1,
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 600,
            }}
          >
            "{item.quote}"
          </Typography>

          <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }} />

          {/* Parent Profile Footer with Illustrated Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.avatarType === 'mom' ? <ParentMom size={56} color={item.avatarBg} /> : <ParentDad size={56} color={item.avatarBg} />}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.2, fontSize: '1.05rem', fontFamily: '"Fredoka", sans-serif' }}>
                  {item.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.4, fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>
                  {item.role} · {item.city}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(31,170,89,0.15)', px: 1.5, py: 0.8, borderRadius: '16px' }}>
              <VerifiedIcon sx={{ fontSize: 16, color: '#1FAA59' }} />
              <Typography variant="caption" sx={{ color: '#1FAA59', fontWeight: 800, fontSize: '0.8rem', fontFamily: '"Fredoka", sans-serif', display: { xs: 'none', lg: 'block' } }}>
                Verified
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
