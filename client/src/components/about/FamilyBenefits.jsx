import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ForumIcon from '@mui/icons-material/Forum';
import { AboutContainer, AboutSection, SectionHeading } from './Section';
import { Reveal, usePrefersReducedMotion } from '../../utils/motion.jsx';

const ITEMS = [
  { icon: <ShieldIcon sx={{ fontSize: 30 }} />, title: 'Verified Tutors', desc: 'Learning with people families can trust.', color: '#3B82F6' },
  { icon: <AutoAwesomeIcon sx={{ fontSize: 30 }} />, title: 'Personalized Matches', desc: 'A tutor who fits your child\u2019s pace, interests, and goals.', color: '#F59E0B' },
  { icon: <HomeWorkIcon sx={{ fontSize: 30 }} />, title: 'Home & Online Learning', desc: 'Comfortable sessions at home or online that fit the family\u2019s routine.', color: '#1FAA59' },
  { icon: <ForumIcon sx={{ fontSize: 30 }} />, title: 'Friendly Support', desc: 'A helpful team at every step \u2014 from the first demo class to daily progress.', color: '#EC4899' },
];

export default function FamilyBenefits() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const reduce = usePrefersReducedMotion();

  return (
    <AboutSection ariaLabel="Why families choose 75 Way Project Task" bg={isDark ? 'background.paper' : '#FFFFFF'}>
      <AboutContainer>
        <SectionHeading
          eyebrow="💙 Built for Families"
          title="Why Families Choose 75 Way Project Task 💙"
          description="From verified educators to flexible learning options, everything is designed around one goal — a calmer, happier learning journey for your child."
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 3, md: 3.5 } }}>
          {ITEMS.map((item, i) => (
            <Box key={item.title} sx={{ width: { xs: '100%', sm: 'calc((100% - 24px) / 2)', md: 'calc((100% - 108px) / 4)' } }}>
              <Reveal delay={i * 0.08} style={{ height: '100%' }}>
                <Box
                  data-qa="benefit-card"
                  component={motion.div}
                  whileHover={reduce ? undefined : { y: -5 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  sx={{
                    height: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, p: { xs: 3, md: 3.5 },
                    borderRadius: '24px', bgcolor: isDark ? '#0B1830' : '#F7F9FC',
                    border: `1.5px solid ${isDark ? 'rgba(148,163,184,0.12)' : '#E2E8F0'}`,
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { borderColor: item.color, boxShadow: isDark ? '0 14px 34px rgba(0,0,0,0.3)' : '0 14px 34px rgba(15,23,42,0.08)' },
                  }}
                >
                  <Box sx={{ flexShrink: 0, width: 64, height: 64, borderRadius: '18px', bgcolor: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography component="h3" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: 'text.primary', fontSize: '1.18rem', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, color: 'text.secondary', fontSize: '0.98rem', lineHeight: 1.65 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              </Reveal>
            </Box>
          ))}
        </Box>
      </AboutContainer>
    </AboutSection>
  );
}