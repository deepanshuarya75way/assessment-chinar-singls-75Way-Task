import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, Container, IconButton,
  Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Divider, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SchoolIcon from '@mui/icons-material/School';
import { Link, useLocation } from 'react-router-dom';
import { useColorMode } from '../../context/ThemeContext';
import { useTeacherApplication } from '../../context/TeacherApplicationContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Find Tutor', path: '/find-tutor' },
  { label: 'Become a Teacher', action: 'openModal' },
  { label: 'How It Works', path: '/#learning-adventure' },
  { label: 'About Us', path: '/about' },
];

export default function PublicNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const { openTeacherApplication } = useTeacherApplication();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 0.5,
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5 }}>
            {/* Logo */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textDecoration: 'none', mr: 4 }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '14px',
                background: 'linear-gradient(135deg, #1B2A4A 0%, #2D6CDF 100%)',
                border: '2px solid #F2B705',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                <SchoolIcon sx={{ color: '#F2B705', fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{
                fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800,
                color: mode === 'dark' ? '#ffffff' : 'primary.main', letterSpacing: 0, fontSize: '1.35rem',
              }}>
                Demo<span style={{ color: '#F2B705' }}>Project</span>
              </Typography>
            </Box>

            {/* Desktop Nav */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.label}
                    component={link.action === 'openModal' ? 'button' : Link}
                    to={link.path}
                    onClick={() => { if (link.action === 'openModal') openTeacherApplication(); }}
                    sx={{
                      color: location.pathname === link.path ? (mode === 'dark' ? '#60A5FA' : 'primary.main') : 'text.secondary',
                      fontWeight: location.pathname === link.path ? 800 : 700,
                      fontSize: '0.92rem',
                      borderRadius: '20px',
                      px: 2,
                      fontFamily: '"Fredoka", "Nunito", sans-serif',
                      '&:hover': { color: mode === 'dark' ? '#93C5FD' : 'primary.main', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(45, 108, 223, 0.08)' },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <IconButton onClick={toggleColorMode} size="small" sx={{ color: 'text.secondary', bgcolor: 'action.hover' }}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              {!isMobile && (
                <>
                  <Button component={Link} to="/login" variant="outlined" size="medium"
                    sx={{ borderRadius: '24px', borderColor: 'divider', color: 'text.primary', fontWeight: 700, '&:hover': { borderColor: mode === 'dark' ? '#93C5FD' : 'primary.main', color: mode === 'dark' ? '#93C5FD' : 'primary.main' } }}>
                    Get Started
                  </Button>
                  <Button component={Link} to="/find-tutor" variant="contained" size="medium"
                    sx={{ borderRadius: '24px', bgcolor: '#F2B705', color: '#1B2A4A', fontWeight: 800, fontFamily: '"Fredoka", sans-serif', '&:hover': { bgcolor: '#e0a800' } }}>
                    🟡 Find Tutor
                  </Button>
                </>
              )}
              {isMobile && (
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.primary' }}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 290, borderRadius: '20px 0 0 20px' } }}>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800, color: mode === 'dark' ? '#ffffff' : 'primary.main' }}>
            Study<span style={{ color: '#F2B705' }}>Stairs</span>
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1 }}>
          {NAV_LINKS.map((link) => {
            const isModal = link.action === 'openModal';
            return (
            <ListItem key={link.label} component={isModal ? 'button' : Link} to={link.path}
              onClick={() => { setDrawerOpen(false); if(isModal) openTeacherApplication(); }}
              sx={{ textDecoration: 'none', color: 'text.primary', borderRadius: '16px', my: 0.5, border: 'none', width: '100%', textAlign: 'left', bgcolor: 'transparent', '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}>
              <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 700, fontFamily: '"Fredoka", sans-serif' }} />
            </ListItem>
            );
          })}
        </List>
        <Divider />
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button component={Link} to="/login" variant="outlined" fullWidth onClick={() => setDrawerOpen(false)} sx={{ borderRadius: '24px', fontWeight: 700 }}>
            Get Started
          </Button>
          <Button component={Link} to="/find-tutor" variant="contained" fullWidth onClick={() => setDrawerOpen(false)} sx={{ borderRadius: '24px', bgcolor: '#F2B705', color: '#1B2A4A', fontWeight: 800, fontFamily: '"Fredoka", sans-serif' }}>
            🟡 Find Tutor
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
