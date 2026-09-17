import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Card, Grid, Chip, Button, IconButton,
  CircularProgress, Divider, TextField, InputAdornment, 
  MenuItem, Select, FormControl, InputLabel, useTheme, Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';

import { requestsAPI } from '../../services/api';
import StatusChip from '../../components/common/StatusChip';
import FeatureUnavailableDialog from '../../components/common/FeatureUnavailableDialog';

export default function MyAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  
  const [dialogState, setDialogState] = useState({ open: false, title: '', message: '', reason: '' });
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await requestsAPI.getMyAssignments();
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchSearch = 
        (a.parentName || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.subject || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.class || '').toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      const matchMode = modeFilter ? a.mode === modeFilter : true;
      
      return matchSearch && matchStatus && matchMode;
    });
  }, [assignments, search, statusFilter, modeFilter]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setModeFilter('');
  };

  const handleAction = (actionName) => {
    setDialogState({
      open: true,
      reason: 'FEATURE_NOT_IMPLEMENTED',
      title: 'Action Unavailable',
      message: `The "${actionName}" functionality is currently being implemented. Check back soon!`
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1,2,3].map(i => <Box key={i} sx={{ width: '100%', height: 160, bgcolor: 'action.hover', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />)}
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            My Assignments 📚
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            Manage and track your active tuitions.
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2.5, mb: 4, borderRadius: '20px', bgcolor: isDark ? '#102344' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, boxShadow: 'none' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by student, subject or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                sx: { borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={2.5}>
            <FormControl fullWidth size="small">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty sx={{ borderRadius: '14px' }}>
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="demo_scheduled">Demo Scheduled</MenuItem>
                <MenuItem value="demo_completed">Demo Completed</MenuItem>
                <MenuItem value="closed">Closed / Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2.5}>
            <FormControl fullWidth size="small">
              <Select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} displayEmpty sx={{ borderRadius: '14px' }}>
                <MenuItem value="">All Modes</MenuItem>
                <MenuItem value="offline">Home Tuition</MenuItem>
                <MenuItem value="online">Online Tuition</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="text" onClick={clearFilters} disabled={!search && !statusFilter && !modeFilter} sx={{ fontWeight: 700 }}>
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {assignments.length === 0 ? (
        <Card sx={{ 
          p: 6, textAlign: 'center', borderRadius: '24px', 
          bgcolor: isDark ? 'rgba(16,35,68,0.5)' : 'rgba(255,255,255,0.5)',
          border: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: 'none'
        }}>
          <Typography sx={{ fontSize: '4rem', mb: 2, opacity: 0.8 }}>🎓</Typography>
          <Typography variant="h5" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, mb: 1, color: isDark ? '#fff' : '#172A4D' }}>
            No Assignments Yet
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: 400, mx: 'auto' }}>
            Once the 75 Way Project Task team assigns students to you, they'll appear here.
          </Typography>
        </Card>
      ) : filteredAssignments.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No assignments match your filters.</Typography>
          <Button variant="outlined" sx={{ mt: 2, borderRadius: '20px' }} onClick={clearFilters}>Clear Filters</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredAssignments.map((assignment, index) => (
              <Grid item xs={12} md={6} xl={4} key={assignment._id}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, delay: index * 0.05 }} style={{ height: '100%' }}>
                  <Card sx={{ 
                    p: 3, borderRadius: '24px', height: '100%', display: 'flex', flexDirection: 'column',
                    bgcolor: isDark ? '#102344' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.2)' : '0 8px 30px rgba(37,99,235,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.3)' : '0 12px 40px rgba(37,99,235,0.1)' }
                  }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Nunito", sans-serif', color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1 }}>
                          📚 {assignment.subject}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                          {assignment.class}
                        </Typography>
                      </Box>
                      <StatusChip status={assignment.status} />
                    </Box>

                    {/* Details Grid */}
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                          <Typography sx={{ fontSize: '1.2rem' }}>👨‍🎓</Typography>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Student Name</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{assignment.parentName}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Location 📍</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{assignment.city}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Mode 🏠</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{assignment.mode === 'online' ? 'Online' : 'Home Tuition'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Budget 💰</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{assignment.budget || 'N/A'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>Started 📅</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(assignment.createdAt).toLocaleDateString()}</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ flex: 1 }} />

                    {/* Actions */}
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Update Status">
                          <IconButton onClick={() => handleAction('Update Status')} size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: 'text.primary' }}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Add Note">
                          <IconButton onClick={() => handleAction('Add Note')} size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: 'text.primary' }}><NoteAddIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        color="success"
                        size="small"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => {
                          if (assignment.mobile) {
                            window.open(`https://wa.me/${assignment.mobile.replace(/\D/g, '')}`, '_blank');
                          } else {
                            setDialogState({
                              open: true,
                              reason: 'MISSING_DATA',
                              title: 'Cannot Contact Parent',
                              message: "WhatsApp contact isn't available because no phone number is registered for this student."
                            });
                          }
                        }}
                        sx={{ borderRadius: '12px', fontWeight: 700, px: 2, bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1DA851' } }}
                      >
                        Contact
                      </Button>
                    </Box>

                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      <FeatureUnavailableDialog
        open={dialogState.open}
        onClose={() => setDialogState(prev => ({ ...prev, open: false }))}
        title={dialogState.title}
        message={dialogState.message}
        reason={dialogState.reason}
      />
    </Box>
  );
}
