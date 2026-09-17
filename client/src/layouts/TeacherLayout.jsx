import { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Divider,
  useTheme, useMediaQuery, Tooltip, Menu, MenuItem,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SchoolIcon from '@mui/icons-material/School';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useColorMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { teachersAPI } from '../services/api';
import LogoutConfirmDialog from '../components/common/LogoutConfirmDialog';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/teacher/dashboard' },
  { label: 'My Students', icon: PeopleIcon, path: '/teacher/students' },
  { label: 'My Assignments', icon: AssignmentIcon, path: '/teacher/assignments' },
  { label: 'My Profile', icon: PersonIcon, path: '/teacher/profile' },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: SettingsIcon, path: '/teacher/settings' },
];

export default function TeacherLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    teachersAPI.getMyProfile()
      .then(res => { if (res.data) setProfile(res.data); })
      .catch(() => {});
  }, []);

  const teacherName = profile?.name || user?.name || 'Teacher';
  const initial = teacherName.replace(/^(dr\.?|mr\.?|ms\.?|mrs\.?|prof\.?)\s+/i, '')[0] || teacherName[0] || 'T';

  const handleLogoutConfirm = async () => { 
    setLogoutDialogOpen(false);
    await logout(); 
    navigate('/login'); 
  };

  const isActive = (path) => {
    return location.pathname === path || (path !== '/teacher' && location.pathname.startsWith(path + '/'));
  };

  const DrawerContent = () => (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', height: '100%', 
      bgcolor: mode === 'dark' ? '#09182D' : '#ffffff',
      borderRight: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Sidebar Doodles */}
      <Typography sx={{ position: 'absolute', top: 20, right: 10, fontSize: '1.2rem', opacity: mode === 'dark' ? 0.05 : 0.08, pointerEvents: 'none', userSelect: 'none', transform: 'rotate(15deg)' }}>✨</Typography>
      <Typography sx={{ position: 'absolute', bottom: 100, left: -10, fontSize: '2rem', opacity: mode === 'dark' ? 0.03 : 0.05, pointerEvents: 'none', userSelect: 'none', transform: 'rotate(-20deg)', fontFamily: 'cursive' }}>a² + b²</Typography>
      
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: '9px', background: 'linear-gradient(135deg, #22C55E 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SchoolIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, lineHeight: 1.1, color: mode === 'dark' ? '#fff' : '#172A4D' }}>
            Study<span style={{ color: '#FBBF00' }}>Stairs</span>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Teacher Portal <span style={{ fontSize: '0.8rem' }}>🎓</span>
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Nav */}
      <List sx={{ px: 1, py: 1.5, flex: 1 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link} to={path}
              onClick={() => isMobile && setMobileOpen(false)}
              selected={isActive(path)}
              sx={{
                borderRadius: '16px', py: 1.2, px: 2, mb: 0.5, mx: 1,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&.Mui-selected': {
                  bgcolor: mode === 'dark' ? '#142B52' : '#F0F4FF',
                  color: mode === 'dark' ? '#fff' : '#172A4D',
                  boxShadow: mode === 'dark' ? '0 4px 15px rgba(0,0,0,0.2)' : '0 4px 15px rgba(37,99,235,0.08)',
                  '& .MuiListItemIcon-root': { color: '#FBBF00', transform: 'scale(1.15)' },
                  '&::before': {
                    content: '""', position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    height: '60%', width: '4px', bgcolor: '#FBBF00', borderRadius: '0 4px 4px 0'
                  },
                  '&:hover': { bgcolor: mode === 'dark' ? '#1A3668' : '#E5EDFF' },
                },
                '&:hover': { 
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                  transform: 'translateX(6px)',
                  '& .MuiListItemIcon-root': { transform: 'scale(1.1)' }
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isActive(path) ? (mode==='dark'?'#FBBF00':'#2563EB') : 'text.secondary', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.9rem', fontWeight: isActive(path) ? 700 : 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {BOTTOM_ITEMS.map(({ label, icon: Icon, path }) => (
          <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              component={Link} 
              to={path}
              selected={isActive(path)} 
              sx={{ borderRadius: '16px', py: 1, px: 2, mx: 1, transition: 'all 0.3s ease', '&:hover': { transform: 'translateX(6px)', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }, '&.Mui-selected': { bgcolor: 'action.selected' } }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary', transition: 'transform 0.3s ease', '.MuiListItemButton-root:hover &': { transform: 'scale(1.1) rotate(15deg)' } }}><Icon fontSize="small" /></ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.9rem', fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setLogoutDialogOpen(true)} sx={{ borderRadius: '16px', py: 1, px: 2, mx: 1, color: '#EC4899', transition: 'all 0.3s ease', '&:hover': { transform: 'translateX(6px)', bgcolor: mode === 'dark' ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.05)' }, '& .MuiListItemIcon-root': { color: '#EC4899' } }}>
            <ListItemIcon sx={{ minWidth: 36, transition: 'transform 0.3s ease', '.MuiListItemButton-root:hover &': { transform: 'scale(1.1) translateX(2px)' } }}><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontFamily: '"Nunito", sans-serif', fontSize: '0.9rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Teacher info */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar src={user?.photo || profile?.photo || user?.avatar} sx={{ width: 38, height: 38, bgcolor: mode === 'dark' ? '#142B52' : '#E5EDFF', color: mode === 'dark' ? '#FBBF00' : '#2563EB', fontSize: '0.9rem', fontWeight: 700, border: '2px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', '& .MuiAvatar-img': { objectFit: 'cover' } }}>
          {initial}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" noWrap sx={{ fontWeight: 800, display: 'block', lineHeight: 1.2, fontFamily: '"Nunito", sans-serif', fontSize: '0.85rem' }}>
            {teacherName}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontSize: '0.7rem', display: 'block' }}>
            {profile?.email || user?.email || 'teacher@tuitionhub.in'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar for desktop */}
      <Drawer variant={isMobile ? 'temporary' : 'permanent'} open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
        <DrawerContent />
      </Drawer>

      {/* Main area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar position="sticky" elevation={0} sx={{ 
          bgcolor: mode === 'dark' ? 'rgba(11, 26, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(12px)',
          color: 'text.primary', 
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          height: { xs: 64, md: 76 },
          justifyContent: 'center',
          zIndex: 10
        }}>
          <Toolbar sx={{ gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} size="small"><MenuIcon /></IconButton>
            )}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, color: 'text.primary', fontFamily: '"Fredoka", "Nunito", sans-serif', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 1 }}>
              {NAV_ITEMS.find(n => isActive(n.path))?.label ?? 'Teacher Dashboard'}
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'inline-block', fontSize: '1.1rem' }}>✨</motion.span>
            </Typography>

            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={toggleColorMode} size="small" sx={{ 
                color: 'text.secondary', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', p: 1, mr: 1,
                transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' } 
              }}>
                {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
              <Avatar src={user?.photo || profile?.photo || user?.avatar} sx={{ width: 36, height: 36, bgcolor: '#FBBF00', color: '#172A4D', fontSize: '0.9rem', fontWeight: 800, border: '2px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', '& .MuiAvatar-img': { objectFit: 'cover' } }}>
                {initial}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { borderRadius: '16px', mt: 1, minWidth: 180, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)' } }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: '"Nunito", sans-serif' }}>{teacherName}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{profile?.email || user?.email}</Typography>
              </Box>
              <MenuItem component={Link} to="/teacher/profile" onClick={() => setAnchorEl(null)} sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, py: 1.5, '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' } }}><PersonIcon sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }}/> My Profile</MenuItem>
              <MenuItem component={Link} to="/teacher/settings" onClick={() => setAnchorEl(null)} sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 600, py: 1.5, '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' } }}><SettingsIcon sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }}/> Settings</MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); setLogoutDialogOpen(true); }} sx={{ color: '#EC4899', fontFamily: '"Nunito", sans-serif', fontWeight: 600, py: 1.5, '&:hover': { bgcolor: mode === 'dark' ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.05)' } }}><LogoutIcon sx={{ mr: 1.5, fontSize: 18 }}/> Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ 
          flex: 1, 
          p: { xs: 2, sm: 3 }, 
          bgcolor: mode === 'dark' ? '#07111F' : '#F6F8FC', 
          overflow: 'auto',
          position: 'relative'
        }}>
          {/* Subtle Educational Background Doodles */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', top: '15%', right: '8%', opacity: mode === 'dark' ? 0.03 : 0.04 }}>
              <Typography sx={{ fontSize: '12rem' }}>🎓</Typography>
            </motion.div>
            <motion.div animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', bottom: '10%', left: '15%', opacity: mode === 'dark' ? 0.02 : 0.03 }}>
              <Typography sx={{ fontSize: '14rem' }}>📚</Typography>
            </motion.div>
            <Typography sx={{ position: 'absolute', top: '40%', left: '5%', fontSize: '3rem', opacity: mode === 'dark' ? 0.04 : 0.06, transform: 'rotate(-15deg)', fontFamily: 'cursive' }}>a² + b² = c²</Typography>
            <Typography sx={{ position: 'absolute', bottom: '25%', right: '15%', fontSize: '3rem', opacity: mode === 'dark' ? 0.03 : 0.05, transform: 'rotate(10deg)', fontFamily: 'cursive' }}>πr²</Typography>
            <Typography sx={{ position: 'absolute', top: '25%', left: '25%', fontSize: '2rem', opacity: mode === 'dark' ? 0.05 : 0.07 }}>⭐</Typography>
          </Box>
          
          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '1400px', mx: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </Box>
  );
}
