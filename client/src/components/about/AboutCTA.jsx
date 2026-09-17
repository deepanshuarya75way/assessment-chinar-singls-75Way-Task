import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import { useTeacherApplication } from '../../context/TeacherApplicationContext';
import TutorBuddy from '../home/TutorBuddy';
import { CuriousBoy, CuriousGirl, AchievementStar } from '../home/CharacterFamily';
import { AboutContainer, AboutSection } from './Section';
import { Float, Reveal } from '../../utils/motion.jsx';

export default function AboutCTA() {
  const navigate = useNavigate();
  const { openTeacherApplication } = useTeacherApplication();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AboutSection ariaLabel="Get started" bg={isDark ? 'background.paper' : '#FFFFFF'}>
      <AboutContainer>
        <Reveal>
          <Box data-qa="cta-box" sx={{ position: 'relative', overflow: 'hidden', borderRadius: '40px', background: 'linear-gradient(135deg, #111C35 0%, #1E3A6E 50%, #2D6CDF 100%)', border: '2px solid rgba(255,255,255,0.14)', boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.55)' : '0 30px 80px rgba(15,23,42,0.25)', px: { xs: 4, sm: 6, md: 9 }, py: { xs: 6, md: 8 } }}>
            {/* Decorative glows */}
            <Box sx={{ position: 'absolute', top: -100, left: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,183,5,0.28) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: -120, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <Box sx={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' }, gap: { xs: 5, md: 4 }, alignItems: 'center' }}>
              {/* ── LEFT ── */}
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: { xs: 'none', md: 'inline-flex' }, alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <TutorBuddy size={44} animate="bounce" signText="Let's Go! 🎒" />
                </Box>
                <Typography sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 900, color: '#FFFFFF', fontSize: { xs: '2rem', sm: '2.7rem', md: '3.2rem' }, lineHeight: 1.15, mb: 2.5 }}>
                  Ready to Start the Learning Adventure? 🚀
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.7, fontFamily: '"Nunito", sans-serif', mb: 4, maxWidth: 520 }}>
                  Let&rsquo;s find a tutor who makes learning click. Join thousands of families learning on 75 Way Project Task.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/find-tutor')}
                    startIcon={<RocketLaunchIcon />}
                    sx={{ borderRadius: '30px', px: 4, py: 1.6, bgcolor: '#F2B705', color: '#1B2A4A', fontWeight: 900, fontSize: '1.02rem', fontFamily: '"Fredoka", sans-serif', boxShadow: '0 12px 30px rgba(242,183,5,0.4)', '&:hover': { bgcolor: '#ffca28', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}
                  >
                    Find a Tutor
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={openTeacherApplication}
                    startIcon={<SchoolIcon />}
                    sx={{ borderRadius: '30px', px: 4, py: 1.6, color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', borderWidth: 2, fontWeight: 900, fontSize: '1.02rem', fontFamily: '"Fredoka", sans-serif', '&:hover': { borderColor: '#F2B705', color: '#F2B705', bgcolor: 'rgba(242,183,5,0.12)', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}
                  >
                    Become a Teacher
                  </Button>
                </Box>
              </Box>

              {/* ── RIGHT: characters ── */}
              <Box sx={{ position: 'relative', height: { xs: 200, md: 280 }, display: { md: 'flex' }, alignItems: 'flex-end', justifyContent: 'center', mt: { xs: 1, md: 0 } }}>
                <Float distance={10} duration={5.5} style={{ position: 'absolute', top: 0, right: '4%', fontSize: '2.4rem', zIndex: 3 }}>🚀</Float>
                <Float distance={8} duration={6.2} delay={0.5} style={{ position: 'absolute', top: '30%', left: '6%', fontSize: '1.9rem', zIndex: 3 }}>💡</Float>
                <Float distance={12} duration={7} delay={0.9} style={{ position: 'absolute', bottom: '18%', right: '18%', fontSize: '1.7rem', zIndex: 3 }}>⭐</Float>

                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                  <CuriousGirl width={isSmall ? 110 : 140} height={isSmall ? 132 : 168} />
                  <Float distance={7} duration={5.5}>
                    <AchievementStar width={isSmall ? 150 : 190} height={isSmall ? 175 : 220} sx={{ zIndex: 2, marginLeft: '-10px', marginRight: '-10px' }} />
                  </Float>
                  <CuriousBoy width={isSmall ? 110 : 140} height={isSmall ? 132 : 168} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Reveal>
      </AboutContainer>
    </AboutSection>
  );
}