import React, { useState } from 'react';
import { 
  Box, Typography, Card, Grid, TextField, Button, 
  Avatar, Divider, Alert, CircularProgress 
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import SaveIcon from '@mui/icons-material/Save';

import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '../../context/ThemeContext';

export default function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const { mode } = useColorMode();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await authAPI.updateProfile(formData);
      // Update context and localStorage with the returned user data
      if (res.user) {
        updateUser(res.user);
      }
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* 🌟 HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '16px', bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PersonIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary' }}>
            My Profile
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Manage your personal details and account settings
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card elevation={0} sx={{ 
              borderRadius: '24px', textAlign: 'center', p: 4, 
              bgcolor: mode === 'dark' ? '#102344' : '#FFFFFF', 
              border: `2px solid ${mode === 'dark' ? 'rgba(96,165,250,0.1)' : '#E2E8F0'}` 
            }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar sx={{ width: 120, height: 120, border: '4px solid #FBBF00', bgcolor: '#2563EB', fontSize: '3rem', fontWeight: 800 }}>
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </Avatar>
                {user?.isVerified && (
                  <VerifiedIcon sx={{ position: 'absolute', bottom: 0, right: 0, color: '#3B82F6', fontSize: 32, bgcolor: '#fff', borderRadius: '50%' }} />
                )}
              </Box>
              <Typography variant="h5" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, mb: 0.5 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 2 }}>
                {user?.email}
              </Typography>
              
              <Box sx={{ display: 'inline-block', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', px: 2, py: 0.5, borderRadius: '8px' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                  Active Student
                </Typography>
              </Box>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card elevation={0} sx={{ 
              borderRadius: '24px', 
              bgcolor: mode === 'dark' ? '#102344' : '#FFFFFF', 
              border: `2px solid ${mode === 'dark' ? 'rgba(96,165,250,0.1)' : '#E2E8F0'}`,
              overflow: 'hidden'
            }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: mode === 'dark' ? '#0B1830' : '#F9FAFB' }}>
                <Typography variant="h6" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700 }}>
                  Personal Information
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth label="Full Name" name="name" 
                      value={formData.name} onChange={handleChange} required
                      InputProps={{ sx: { borderRadius: '12px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth label="Email Address" 
                      value={user?.email || ''} disabled
                      InputProps={{ sx: { borderRadius: '12px' } }}
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth label="Mobile Number" name="mobile" 
                      value={formData.mobile} onChange={handleChange}
                      InputProps={{ sx: { borderRadius: '12px' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{ 
                          bgcolor: '#FBBF00', color: '#1B2A4A', px: 4, py: 1.5, borderRadius: '12px', fontWeight: 800,
                          '&:hover': { bgcolor: '#F59E0B' }
                        }}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
