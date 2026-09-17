import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Grid, Divider, Button, TextField, useTheme,
  Avatar, CircularProgress, Chip, Autocomplete
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import EditIcon from '@mui/icons-material/Edit';

import { useAuth } from '../../context/AuthContext';
import { teachersAPI } from '../../services/api';
import { SUBJECTS, CLASSES, TUITION_MODES, CITIES } from '../../data/mockData';

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form State
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    expectedFee: '',
    teachingMode: 'Both',
    subjects: [],
    classes: [],
    cities: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await teachersAPI.getMyProfile();
      if (res.data) {
        setProfile(res.data);
        setFormData({
          bio: res.data.bio || '',
          experience: res.data.experience || '',
          expectedFee: res.data.expectedFee || '',
          teachingMode: res.data.teachingMode || 'Both',
          subjects: res.data.subjects || [],
          classes: res.data.classes || [],
          cities: res.data.cities || []
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...formData };
      const res = await teachersAPI.updateMyProfile(payload);
      if (res.data) {
        setProfile(res.data);
        setFormData({
          bio: res.data.bio || '',
          experience: res.data.experience || '',
          expectedFee: res.data.expectedFee || '',
          teachingMode: res.data.teachingMode || 'Both',
          subjects: res.data.subjects || [],
          classes: res.data.classes || [],
          cities: res.data.cities || []
        });
      }
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.message || 'Unable to update your profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ width: '100%', height: 200, bgcolor: 'action.hover', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
      </Box>
    );
  }

  // Generate generic avatar if user doesn't have a photo
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Teacher')}&backgroundColor=E5EDFF`;
  const avatarUrl = user?.photo || user?.avatar || defaultAvatar;

  return (
    <Box sx={{ pb: 6, position: 'relative' }}>
      {/* Decorative background elements */}
      <Typography sx={{ position: 'absolute', top: 50, right: 100, fontSize: '4rem', opacity: 0.03, pointerEvents: 'none', userSelect: 'none', transform: 'rotate(15deg)' }}>⭐</Typography>
      <Typography sx={{ position: 'absolute', bottom: 100, left: 40, fontSize: '6rem', opacity: 0.02, pointerEvents: 'none', userSelect: 'none', transform: 'rotate(-10deg)' }}>📚</Typography>
      <Typography sx={{ position: 'absolute', top: 300, right: 50, fontSize: '3rem', opacity: 0.02, pointerEvents: 'none', userSelect: 'none' }}>a² + b² = c²</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          My Profile ✨
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
          Manage your public teaching profile and preferences.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '320px 1fr' }, gap: 4, alignItems: 'start' }}>
        {/* Profile Card (Left Column) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card sx={{ 
            p: 4, borderRadius: '24px', textAlign: 'center',
            bgcolor: isDark ? '#102344' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(37,99,235,0.08)',
          }}>
            <Avatar src={avatarUrl} sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: isDark ? '#142B52' : '#E5EDFF', border: '4px solid #FBBF00', '& .MuiAvatar-img': { objectFit: 'cover' } }} />
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Nunito", sans-serif', mb: 0.5, color: isDark ? '#fff' : '#172A4D' }}>
              {profile?.name || user?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {profile?.email || user?.email}
            </Typography>
            
            <Chip 
              label={profile?.applicationStatus === 'approved' ? 'Verified Teacher' : 'Pending Verification'} 
              color={profile?.applicationStatus === 'approved' ? 'success' : 'warning'} 
              size="small" 
              icon={profile?.applicationStatus === 'approved' ? <CheckCircleIcon /> : undefined}
              sx={{ fontWeight: 700, mb: 3 }} 
            />

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                  📞 Phone
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>{profile?.mobile || user?.mobile || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                  🎓 Account Role
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize', mt: 0.5 }}>{user?.role}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                  📅 Member Since
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>{new Date(profile?.createdAt || user?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Typography>
              </Box>
            </Box>
          </Card>
        </motion.div>

        {/* Edit Form (Right Column) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card sx={{ 
            p: { xs: 3, md: 5 }, borderRadius: '24px',
            bgcolor: isDark ? '#102344' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)',
          }}>
            <Typography variant="h6" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 4, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1 }}>
              ✏️ Edit Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField 
                  fullWidth multiline rows={4} label="Professional Bio" 
                  placeholder="Tell students about yourself..."
                  value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? '#0B1A32' : '#ffffff' } }} 
                />
              </Box>
              
              <TextField 
                fullWidth label="Years Experience" 
                value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? '#0B1A32' : '#ffffff' } }} 
              />

              <TextField 
                fullWidth label="Expected Fee (₹ / hr)" 
                value={formData.expectedFee} onChange={e => setFormData({ ...formData, expectedFee: e.target.value })} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? '#0B1A32' : '#ffffff' } }} 
              />

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Autocomplete
                  multiple options={SUBJECTS} freeSolo
                  value={formData.subjects} onChange={(e, val) => setFormData({ ...formData, subjects: val })}
                  renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={{ borderRadius: '8px', fontWeight: 600 }} />)}
                  renderInput={(params) => <TextField {...params} label="Subjects" placeholder="Select or type..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? '#0B1A32' : '#ffffff' } }} />}
                />
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Autocomplete
                  multiple options={CLASSES} freeSolo
                  value={formData.classes} onChange={(e, val) => setFormData({ ...formData, classes: val })}
                  renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={{ borderRadius: '8px', fontWeight: 600 }} />)}
                  renderInput={(params) => <TextField {...params} label="Classes" placeholder="Select or type..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? '#0B1A32' : '#ffffff' } }} />}
                />
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Autocomplete
                  multiple options={CITIES} freeSolo
                  value={formData.cities} onChange={(e, val) => setFormData({ ...formData, cities: val })}
                  renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={{ borderRadius: '8px', fontWeight: 600 }} />)}
                  renderInput={(params) => <TextField {...params} label="Preferred Cities" placeholder="Select or type cities..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? '#0B1A32' : '#ffffff' } }} />}
                />
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Autocomplete
                  options={TUITION_MODES}
                  value={formData.teachingMode} onChange={(e, val) => setFormData({ ...formData, teachingMode: val })}
                  renderInput={(params) => <TextField {...params} label="Teaching Mode" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? '#0B1A32' : '#ffffff' } }} />}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
              <Button 
                variant="contained" 
                disabled={saving} 
                onClick={handleSave} 
                sx={{ borderRadius: '20px', px: 5, py: 1.5, fontWeight: 700, bgcolor: '#2563EB', color: '#fff', '&:hover': { bgcolor: '#1D4ED8' }, boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Card>
        </motion.div>
      </Box>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
              background: toast.type === 'success' ? (isDark ? '#16A765' : '#1FAA59') : '#EF4444',
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
    </Box>
  );
}
