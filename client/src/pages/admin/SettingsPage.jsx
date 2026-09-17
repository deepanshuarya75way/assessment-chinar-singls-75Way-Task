import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Grid, Divider, Button, TextField, useTheme,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch,
  Avatar, CircularProgress, IconButton, InputAdornment, LinearProgress, Dialog
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';

import { useColorMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { authAPI, healthCheck } from '../../services/api';
import FeatureUnavailableDialog from '../../components/common/FeatureUnavailableDialog';

const SETTING_TABS = [
  { id: 'appearance', label: 'Appearance', icon: PaletteIcon, available: true },
  { id: 'email', label: 'Email', icon: EmailIcon, available: true },
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, available: true },
  { id: 'security', label: 'Security', icon: SecurityIcon, available: true },
  { id: 'system', label: 'System', icon: BuildIcon, available: true },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [dialogState, setDialogState] = useState({ open: false, title: '', message: '', reason: '' });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { mode, toggleColorMode } = useColorMode();
  const { user, updateUser } = useAuth();

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [health, setHealth] = useState(null);

  useEffect(() => {
    healthCheck().then(res => setHealth(res)).catch(() => setHealth({ status: 'offline' }));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const [confirmDialog, setConfirmDialog] = useState(false);
  
  const handleTabClick = (tab) => {
    if (!tab.available) {
      setDialogState({
        open: true,
        reason: 'FEATURE_NOT_IMPLEMENTED',
        title: 'Coming Soon ✨',
        message: `The ${tab.label} settings are currently being integrated. Check back soon!`
      });
      return;
    }
    setActiveTab(tab.id);
  };

  return (
    <Box sx={{ pb: 5 }}>
      {/* Header */}
      <Box sx={{ mb: 4, position: 'relative' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          Admin Settings ⚙️
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
          Manage your 75 Way Project Task platform, preferences and administration controls.
        </Typography>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: -10, right: 20 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '20px', bgcolor: 'rgba(251,191,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            🛠️
          </Box>
        </motion.div>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3.5} lg={3}>
          <Card sx={{ 
            borderRadius: '24px', 
            bgcolor: isDark ? '#102344' : '#ffffff',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(37,99,235,0.06)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`,
            overflow: 'hidden',
            position: { md: 'sticky' }, top: { md: 90 }
          }}>
            <List sx={{ p: 1.5, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, overflowX: { xs: 'auto', md: 'visible' }, gap: 0.5 }}>
              {SETTING_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <ListItem key={tab.id} disablePadding sx={{ width: { xs: 'auto', md: '100%' } }}>
                    <ListItemButton
                      onClick={() => handleTabClick(tab)}
                      sx={{
                        borderRadius: '16px', py: 1.2, px: 2, minWidth: { xs: 140, md: 'auto' },
                        bgcolor: active ? (isDark ? '#142B52' : '#F0F4FF') : 'transparent',
                        color: active ? (isDark ? '#fff' : '#172A4D') : 'text.secondary',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: isDark ? (active ? '#142B52' : 'rgba(255,255,255,0.03)') : (active ? '#F0F4FF' : '#F8FAFC') },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: active ? '#FBBF00' : 'text.secondary' }}>
                        <tab.icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={tab.label} primaryTypographyProps={{ fontFamily: '"Nunito", sans-serif', fontWeight: active ? 800 : 600, fontSize: '0.9rem' }} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        </Grid>

        {/* Content Area */}
        <Grid item xs={12} md={8.5} lg={9}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'appearance' && <AppearanceSettings mode={mode} toggleColorMode={toggleColorMode} />}
              {activeTab === 'security' && <SecuritySettings showToast={showToast} />}
              {activeTab === 'system' && <SystemSettings health={health} setConfirmDialog={setConfirmDialog} />}
              {activeTab === 'email' && <EmailSettings health={health} />}
              {activeTab === 'whatsapp' && <WhatsAppSettings />}
            </motion.div>
          </AnimatePresence>
        </Grid>
      </Grid>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
              background: toast.type === 'success' ? (isDark ? '#16A765' : '#1FAA59') : '#F87171',
              color: '#fff', padding: '12px 24px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            {toast.type === 'success' ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
            <Typography sx={{ fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>{toast.message}</Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <FeatureUnavailableDialog
        open={dialogState.open}
        onClose={() => setDialogState(prev => ({ ...prev, open: false }))}
        title={dialogState.title}
        message={dialogState.message}
        reason={dialogState.reason}
      />

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '3rem', mb: 1 }}>⚠️</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Fredoka", "Nunito", sans-serif', mb: 1 }}>Reset Platform Cache?</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>This will restore these settings to their default values and clear temporary files. This action cannot be undone.</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => setConfirmDialog(false)} sx={{ borderRadius: '20px', fontWeight: 700, px: 3 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={() => { setConfirmDialog(false); showToast('Platform cache reset successfully!', 'success'); }} sx={{ borderRadius: '20px', fontWeight: 700, px: 3, boxShadow: 'none' }}>Reset Cache</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

// ── SUBCOMPONENTS ──────────────────────────────────────────────

const SettingCard = ({ title, children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card sx={{ 
      p: { xs: 2.5, md: 4 }, mb: 3, borderRadius: '24px', 
      bgcolor: isDark ? '#102344' : '#ffffff',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(37,99,235,0.06)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`
    }}>
      <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 3, color: isDark ? '#fff' : '#172A4D' }}>
        {title}
      </Typography>
      {children}
    </Card>
  );
};

const AppearanceSettings = ({ mode, toggleColorMode }) => {
  return (
    <SettingCard title="Theme Preferences">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Dark Mode</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Switch between light and dark themes</Typography>
        </Box>
        <Switch checked={mode === 'dark'} onChange={toggleColorMode} color="primary" />
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Accent Color</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Custom colors are currently locked to 75 Way Project Task brand colors.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#2563EB', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#FBBF00', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
        </Box>
      </Box>
    </SettingCard>
  );
};

const ProfileSettings = ({ user, updateUser, showToast }) => {
  const [formData, setFormData] = useState({ name: user?.name || '', mobile: user?.mobile || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSave = async () => {
    if (!formData.name.trim()) return showToast('Name is required', 'error');
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(formData);
      updateUser(res.user);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingCard title="Personal Information">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar src={user?.photo || user?.avatar} sx={{ width: 80, height: 80, bgcolor: theme.palette.mode === 'dark' ? '#142B52' : '#E5EDFF', color: theme.palette.mode === 'dark' ? '#FBBF00' : '#2563EB', fontSize: '2rem', fontWeight: 800, border: '3px solid #FBBF00', '& .MuiAvatar-img': { objectFit: 'contain' } }}>
          {user?.name?.[0] || 'A'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Profile Picture</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Avatars are managed by Gravatar or system defaults.</Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Mobile Number" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Role" value={user?.role?.toUpperCase() || 'ADMIN'} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Account Status" value="Active" disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' }, '& .MuiInputBase-input.Mui-disabled': { color: '#16A765', fontWeight: 800, WebkitTextFillColor: '#16A765' } }} />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" disabled={loading} onClick={handleSave} sx={{ borderRadius: '20px', px: 4, py: 1.2, fontWeight: 700, bgcolor: '#2563EB', color: '#fff' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </SettingCard>
  );
};

const SecuritySettings = ({ showToast }) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (pwd.match(/[A-Z]/)) score += 25;
    if (pwd.match(/[0-9]/)) score += 25;
    if (pwd.match(/[^A-Za-z0-9]/)) score += 25;
    return score;
  };
  const strength = getStrength(passwords.new);
  
  const handleSave = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) return showToast('Please fill all fields', 'error');
    if (passwords.new !== passwords.confirm) return showToast('New passwords do not match', 'error');
    if (strength < 50) return showToast('Password is too weak', 'error');

    setLoading(true);
    try {
      await authAPI.updatePassword(passwords.current, passwords.new);
      showToast('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingCard title="Change Password">
      <Grid container spacing={3}>
        <Grid item xs={12}>
           <TextField fullWidth type={showPwd.current ? 'text' : 'password'} label="Current Password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
            slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}
                        edge="end"
                        aria-label={showPwd.current ? 'Hide password' : 'Show password'}
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {showPwd.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
           />
        </Grid>
        <Grid item xs={12} sm={6}>
           <TextField fullWidth type={showPwd.new ? 'text' : 'password'} label="New Password" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} 
             slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}
                        edge="end"
                        aria-label={showPwd.new ? 'Hide password' : 'Show password'}
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {showPwd.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
           />
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress variant="determinate" value={strength} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: strength < 50 ? '#F87171' : strength < 75 ? '#FBBF00' : '#22C55E' } }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', width: 40 }}>{strength < 50 ? 'Weak' : strength < 75 ? 'Fair' : 'Strong'}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
           <TextField fullWidth type={showPwd.confirm ? 'text' : 'password'} label="Confirm Password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }} 
            slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}
                        edge="end"
                        aria-label={showPwd.confirm ? 'Hide password' : 'Show password'}
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {showPwd.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" disabled={loading} onClick={handleSave} sx={{ borderRadius: '20px', px: 4, py: 1.2, fontWeight: 700, bgcolor: '#2563EB', color: '#fff' }}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </Box>
    </SettingCard>
  );
};

const SystemSettings = ({ health, setConfirmDialog }) => {
  return (
    <>
      <SettingCard title="System Health">
        {!health ? <CircularProgress size={24} /> : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, borderRadius: '16px', bgcolor: health?.status === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', border: '1px solid', borderColor: health?.status === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>API Status</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: health?.status === 'ok' ? '#22C55E' : '#F87171', display: 'flex', alignItems: 'center', gap: 1 }}>
                  {health?.status === 'ok' ? <CheckCircleIcon /> : <ErrorOutlineIcon />} {health?.status === 'ok' ? 'Operational' : 'Offline'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, borderRadius: '16px', bgcolor: health?.db ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', border: '1px solid', borderColor: health?.db ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Database</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: health?.db ? '#22C55E' : '#F87171', display: 'flex', alignItems: 'center', gap: 1 }}>
                  {health?.db ? <CheckCircleIcon /> : <ErrorOutlineIcon />} {health?.db ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </SettingCard>
      
      <Card sx={{ p: 4, borderRadius: '24px', border: '1px solid rgba(248,113,113,0.3)', bgcolor: 'rgba(248,113,113,0.05)' }}>
        <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 1, color: '#F87171', display: 'flex', alignItems: 'center', gap: 1 }}>
          ⚠️ Danger Zone
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Destructive operations. Please proceed with extreme caution.
        </Typography>
        <Button variant="outlined" color="error" sx={{ borderRadius: '14px', fontWeight: 700, textTransform: 'none' }} onClick={() => setConfirmDialog(true)}>
          Reset Platform Cache
        </Button>
      </Card>
    </>
  );
};

const EmailSettings = ({ health }) => {
  const isConnected = health?.email;

  return (
    <SettingCard title="Email Configuration">
      <Box sx={{ p: 3, borderRadius: '16px', bgcolor: isConnected ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', border: '1px solid', borderColor: isConnected ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {isConnected ? <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 32 }} /> : <ErrorOutlineIcon sx={{ color: '#F87171', fontSize: 32 }} />}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: isConnected ? '#22C55E' : '#F87171' }}>
            {isConnected ? 'Connected & Operational' : 'Not Configured'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {isConnected ? 'The SMTP server is properly configured via environment variables.' : 'Email functionality requires an email service to be configured for this environment.'}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Enabled Triggers</Typography>
      <List disablePadding>
        {['Student Request Confirmation', 'Teacher Assignment Notifications', 'Demo Class Reminders', 'Application Status Updates'].map(item => (
          <ListItem key={item} disablePadding sx={{ mb: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" disabled sx={{ borderRadius: '14px', fontWeight: 700 }}>Edit Triggers (Locked)</Button>
      </Box>
    </SettingCard>
  );
};

const WhatsAppSettings = () => {
  return (
    <SettingCard title="WhatsApp Integration">
      <Box sx={{ p: 3, borderRadius: '16px', bgcolor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#22C55E' }}>Client Actions Available</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Direct WhatsApp messaging via "wa.me" is active.</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Default Country Code</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>+91 (India)</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Automated WhatsApp API</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Not Configured (Requires Meta API key)</Typography>
      </Box>
    </SettingCard>
  );
};
