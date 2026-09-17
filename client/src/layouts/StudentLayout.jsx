import { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Divider,
  useTheme, useMediaQuery
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useColorMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmDialog from '../components/common/LogoutConfirmDialog';

const DRAWER_WIDTH = 270;
const NAV_ITEMS = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/student/dashboard' },
  { label: 'Find a Tutor', icon: SearchIcon, path: '/student/find-tutor' },
  { label: 'My Assignments', icon: AssignmentIcon, path: '/student/assignments' },
  { label: 'My Profile', icon: PersonIcon, path: '/student/profile' },
];

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const DrawerContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #F2B705 0%, #1B2A4A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(242, 183, 5, 0.3)' }}>
          <SchoolIcon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Poppins", sans-serif', fontWeight: 600, lineHeight: 1.1, color: 'text.primary' }}>
            Study<span style={{ color: '#FBBF00' }}>Stairs</span>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Student Portal
          </Typography>
        </Box>
      </Box>
      
      <List sx={{ px: 2, py: 1, flex: 1 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <ListItem key={path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton component={Link} to={path} onClick={() => isMobile && setMobileOpen(false)}
              selected={isActive(path)}
              sx={{ 
                borderRadius: '12px', py: 1.2, px: 2,
                transition: 'all 0.2s',
                '&.Mui-selected': { 
                  bgcolor: mode === 'dark' ? 'rgba(251, 191, 0, 0.15)' : '#FFF9E6', 
                  color: mode === 'dark' ? '#FBBF00' : '#D97706', 
                  boxShadow: mode === 'dark' ? 'inset 4px 0 0 #FBBF00' : 'inset 4px 0 0 #F59E0B',
                  '& .MuiListItemIcon-root': { color: 'inherit' }, 
                  '&:hover': { bgcolor: mode === 'dark' ? 'rgba(251, 191, 0, 0.2)' : '#FFF4CC' } 
                },
                '&:hover:not(.Mui-selected)': { bgcolor: 'action.hover', transform: 'translateX(4px)' },
              }}>
              <ListItemIcon sx={{ minWidth: 40, color: isActive(path) ? 'inherit' : 'text.secondary' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: isActive(path) ? 600 : 500, fontFamily: '"Nunito", "Poppins", sans-serif' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mx: 2, opacity: 0.6 }} />
      
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton component={Link} to="/student/settings" onClick={() => isMobile && setMobileOpen(false)} sx={{ borderRadius: '12px', py: 1, px: 2, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setLogoutDialogOpen(true)} sx={{ borderRadius: '12px', py: 1, px: 2, color: 'error.main', '&:hover': { bgcolor: 'error.lighter' } }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Box sx={{ p: 2, m: 2, borderRadius: '16px', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F6F8FC', display: 'flex', alignItems: 'center', gap: 1.5, border: '1px solid', borderColor: 'divider' }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#2563EB', color: '#fff', fontWeight: 'bold' }}>
          {user?.name?.[0]?.toUpperCase() || 'S'}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, color: 'text.primary', fontFamily: '"Nunito", sans-serif' }}>{user?.name || 'Student Buddy'}</Typography>
          <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block' }}>{user?.email}</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: mode === 'dark' ? '#07111F' : '#F6F8FC' }}>
      
      {/* Permanent Drawer (Desktop) & Temporary Drawer (Mobile) */}
      <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
        <Drawer 
          variant={isMobile ? 'temporary' : 'permanent'} 
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: 'none',
              boxShadow: mode === 'dark' ? '1px 0 10px rgba(0,0,0,0.5)' : '1px 0 15px rgba(0,0,0,0.05)',
              bgcolor: mode === 'dark' ? '#0D1D38' : '#ffffff',
            },
          }}
        >
          {DrawerContent()}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <AppBar position="sticky" elevation={0} sx={{ 
          bgcolor: mode === 'dark' ? 'rgba(7, 17, 31, 0.8)' : 'rgba(246, 248, 252, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}>
          <Toolbar sx={{ minHeight: '70px !important', px: { xs: 2, lg: 4 } }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2, color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' }, fontFamily: '"Fredoka", sans-serif', fontWeight: 500 }}>
                {NAV_ITEMS.find(item => isActive(item.path))?.label || 'Student Portal'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={toggleColorMode} size="small" sx={{ color: 'text.secondary', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
              
              <Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: '#2563EB', fontSize: '0.875rem' }}>
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, flexGrow: 1 }}>
          <Outlet />
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
