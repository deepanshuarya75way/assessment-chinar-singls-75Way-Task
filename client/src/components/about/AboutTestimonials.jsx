import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { ParentMom, ParentDad } from '../home/CharacterFamily';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Reveal, usePrefersReducedMotion } from '../../utils/motion.jsx';

const REVIEWS = [
  {
    name: 'Sarah M.',
    role: 'Parent of 5th Grader',
    text: 'My daughter used to hate math. Now she looks forward to her sessions every week! The tutor was so patient and made learning fun.',
    Avatar: <ParentMom size={52} />,
  },
  {
    name: 'David L.',
    role: 'Parent of 8th Grader',
    text: 'Finding a good science tutor was hard until we found 75 Way Project Task. The personalized matching was perfect. Highly recommended!',
    Avatar: <ParentDad size={52} />,
  },
  {
    name: 'Priya K.',
    role: 'Parent of 3rd Grader',
    text: 'The safest and most reliable platform we have used. The tutors are thoroughly verified and genuinely care about the kids.',
    Avatar: <ParentMom size={52} color="#10B981" />,
  },
];

function TestimonialCard({ review, isDark, reduce }) {
  return (
    <Box
      data-qa="testimonial-card"
      component={motion.div}
      whileHover={reduce ? undefined : { y: -8, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      sx={{
        position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
        p: { xs: 3.5, sm: 4 }, borderRadius: '28px', overflow: 'visible',
        bgcolor: isDark ? '#162447' : '#FFFFFF',
        border: `2.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#F2B705'}`,
        boxShadow: isDark ? '0 15px 35px rgba(0,0,0,0.4)' : '0 15px 40px rgba(242,183,5,0.18)',
      }}
    >
      {/* Tape */}
      <Box sx={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: 84, height: 24, bgcolor: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 5px rgba(0,0,0,0.06)', borderRadius: '2px', zIndex: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 0.4 }} aria-label="Rated 5 out of 5 stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Box key={star} component="span" sx={{ fontSize: '1.15rem', color: '#F2B705' }}>⭐</Box>
          ))}
        </Box>
        <FormatQuoteIcon sx={{ color: '#FCD34D', fontSize: 42, opacity: 0.4 }} />
      </Box>

      <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, color: 'text.primary', fontStyle: 'italic', lineHeight: 1.75, fontSize: '1.05rem', flexGrow: 1, mb: 3.5 }}>
        &ldquo;{review.text}&rdquo;
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderTop: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9'}`, pt: 3 }}>
        {review.Avatar}
        <Box>
          <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: '1.08rem', lineHeight: 1.2 }}>{review.name}</Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, color: 'text.secondary', fontSize: '0.88rem', mt: 0.3 }}>{review.role}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function AboutTestimonials() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const reduce = usePrefersReducedMotion();

  return (
    <AboutSection ariaLabel="What families say" bg={isDark ? '#081021' : '#FFFBEB'}>
      <AboutContainer>
        <SectionHeading
          eyebrow="💬 Parent Stories"
          title="What Happy Families Say 💛"
          description="Hear it from the families who found their child\u2019s learning buddy on 75 Way Project Task."
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 3.5, md: 4 } }}>
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.12} style={{ height: '100%' }}>
              <TestimonialCard review={review} isDark={isDark} reduce={reduce} />
            </Reveal>
          ))}
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}