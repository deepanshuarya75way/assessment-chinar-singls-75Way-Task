import React from 'react';
import { 
  Dialog, DialogContent, DialogActions, 
  Button, Box, Typography, Grid, Chip, 
  IconButton, Avatar, Divider, Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import { useColorMode } from '../../context/ThemeContext';

export default function TutorDetailModal({ open, onClose, tutor }) {
  const { mode } = useColorMode();

  if (!open || !tutor) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: mode === 'dark' ? '#0D1D38' : '#ffffff',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative', bgcolor: mode === 'dark' ? '#102B52' : '#EFF6FF', p: 4, textAlign: 'center' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary', bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)' }}>
          <CloseIcon />
        </IconButton>
        
        <Avatar src={tutor.user?.avatar} sx={{ width: 100, height: 100, mx: 'auto', border: '4px solid #3B82F6', mb: 2 }}>
          {tutor.name?.[0]}
        </Avatar>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 700, color: 'text.primary' }}>
            {tutor.name}
          </Typography>
          {tutor.applicationStatus === 'approved' && <VerifiedIcon sx={{ color: '#3B82F6', fontSize: 24 }} />}
        </Box>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
          <LocationOnIcon fontSize="small" /> {tutor.cities?.[0] || 'Remote'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Rating value={Number(tutor.rating) || 5} readOnly precision={0.5} size="small" />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>({tutor.totalReviews || 12} reviews)</Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, borderRadius: '16px', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F6F8FC' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Experience</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{tutor.experience} Years</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, borderRadius: '16px', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F6F8FC' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Fee</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{tutor.expectedFee}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', color: 'text.secondary' }}>Subjects</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(tutor.subjects || []).map(s => <Chip key={s} label={s} sx={{ fontWeight: 600 }} />)}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon fontSize="small" /> Qualification
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{tutor.qualification}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{tutor.user?.email || tutor.email || 'Hidden'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Phone</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{tutor.mobile || 'Hidden'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={onClose} 
          sx={{ bgcolor: '#FBBF00', color: '#1B2A4A', px: 4, py: 1, borderRadius: '50px', fontWeight: 700, '&:hover': { bgcolor: '#F59E0B' } }}
        >
          Awesome!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
