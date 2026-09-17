import { Box, Container, Grid, Typography, Link as MuiLink, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';
import { useTeacherApplication } from '../../context/TeacherApplicationContext';

const FOOTER_LINKS = {
  'Quick Links': [
    { label: 'Home', path: '/' },
    { label: 'Find a Tutor', path: '/find-tutor' },
    { label: 'Become a Teacher', action: 'openModal' },
    { label: 'About Us', path: '/about' },
  ],
  'Popular Subjects': [
    { label: 'Mathematics 📐', path: '/find-tutor' },
    { label: 'Physics ⚛️', path: '/find-tutor' },
    { label: 'Chemistry 🧪', path: '/find-tutor' },
    { label: 'English & Skills 🗣️', path: '/find-tutor' },
  ],
};

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Jaipur', 'Lucknow', 'Hyderabad', 'Pune', 'Chennai'];

export default function PublicFooter() {
  const { openTeacherApplication } = useTeacherApplication();
  return (
    <Box component="footer" sx={{ bgcolor: '#060D1A', color: '#e8edf5', pt: 9, pb: 4, borderTop: '2px solid rgba(242, 183, 5, 0.2)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, #1B2A4A 0%, #2D6CDF 100%)', border: '2px solid #F2B705', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SchoolIcon sx={{ color: '#F2B705', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.4rem' }}>
                Study<span style={{ color: '#F2B705' }}>Stairs</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.8, mb: 3, maxWidth: 360, fontSize: '0.92rem', fontFamily: '"Nunito", sans-serif' }}>
              India's most trusted home & online tuition platform connecting children and parents with top verified teachers for an exciting learning adventure.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <PhoneIcon sx={{ fontSize: 18, color: '#F2B705' }} />
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}>+91 70090-79344</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <EmailIcon sx={{ fontSize: 18, color: '#F2B705' }} />
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}>support@tuitionhub.co.in</Typography>
              </Box>
            </Box>
          </Grid>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <Grid item xs={6} md={2} key={section}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2.5, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.78rem', fontFamily: '"Fredoka", sans-serif' }}>
                {section}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {links.map((l) => {
                  if (l.action === 'openModal') {
                    return (
                      <Typography key={l.label} component="button" onClick={openTeacherApplication}
                        sx={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 600, fontFamily: '"Nunito", sans-serif', '&:hover': { color: '#F2B705', transform: 'translateX(4px)' }, transition: 'all 0.2s ease', display: 'inline-block', textAlign: 'left', bgcolor: 'transparent', border: 'none', cursor: 'pointer', p: 0 }}>
                        {l.label}
                      </Typography>
                    );
                  }
                  return (
                    <MuiLink key={l.label} component={Link} to={l.path} underline="none"
                      sx={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 600, fontFamily: '"Nunito", sans-serif', '&:hover': { color: '#F2B705', transform: 'translateX(4px)' }, transition: 'all 0.2s ease', display: 'inline-block' }}>
                      {l.label}
                    </MuiLink>
                  );
                })}
              </Box>
            </Grid>
          ))}

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2.5, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.78rem', fontFamily: '"Fredoka", sans-serif' }}>
              Cities We Serve
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {CITIES.map((city) => (
                <Box key={city} component={Link} to="/find-tutor" sx={{
                  bgcolor: 'rgba(255,255,255,0.06)',
                  px: 1.8,
                  py: 0.7,
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.6,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(242,183,5,0.15)',
                    borderColor: 'rgba(242,183,5,0.5)',
                    '& .city-icon': { color: '#F2B705' },
                    '& .city-text': { color: '#ffffff' },
                  }
                }}>
                  <LocationOnIcon className="city-icon" sx={{ fontSize: 14, color: '#94A3B8', transition: 'color 0.2s' }} />
                  <Typography className="city-text" variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.8rem', transition: 'color 0.2s' }}>
                    {city}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'center', sm: 'space-between' }, alignItems: 'center', flexWrap: 'wrap', gap: 1.5, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600 }}>
            © 2026 75 Way Project Task. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#F2B705', fontSize: '0.85rem', fontWeight: 800, fontFamily: '"Fredoka", sans-serif' }}>
            🇮🇳 Made with ❤️ for Children & Parents Across India
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
