import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button, Avatar,
  Divider, Chip, IconButton, Tooltip, Skeleton, Alert,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import KpiCard from '../../components/common/KpiCard';
import StatusChip from '../../components/common/StatusChip';
import FeatureUnavailableDialog from '../../components/common/FeatureUnavailableDialog';
import { adminAPI } from '../../services/api';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useColorMode } from '../../context/ThemeContext';

const KPI_CONFIG = [
  { key: 'newRequests', label: 'New Student Requests', icon: AssignmentIcon, color: '#2563EB' },
  { key: 'newApplications', label: 'New Teacher Applications', icon: PersonAddIcon, color: '#16A765' },
  { key: 'assignedTeachers', label: 'Assigned Teachers', icon: SchoolIcon, color: '#FBBF00' },
  { key: 'totalUsers', label: 'Total Users', icon: PeopleIcon, color: '#9C27B0' },
];

const getWhatsAppLink = (phone) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[\+\-\s\(\)]/g, '');
  const normalized = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone);
  return `https://wa.me/${normalized}`;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { mode } = useColorMode();
  
  // Feature Unavailable Dialog State
  const [dialogState, setDialogState] = useState({ open: false, title: '', message: '', reason: '' });

  const handleAction = (type, personData) => {
    if (type === 'whatsapp') {
      if (!personData.mobile) {
        setDialogState({
          open: true,
          reason: 'MISSING_INFORMATION',
          title: 'Phone Number Missing',
          message: `This request doesn't have a phone number associated with it.`
        });
        return;
      }
      window.open(getWhatsAppLink(personData.mobile), '_blank');
    } else if (type === 'email') {
      if (!personData.email) {
        setDialogState({
          open: true,
          reason: 'MISSING_INFORMATION',
          title: 'Email Address Missing',
          message: `This request doesn't have an email address associated with it.`
        });
        return;
      }
      window.open(`mailto:${personData.email}?subject=75 Way Project Task Inquiry`, '_self');
    }
  };

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const res = await adminAPI.getDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data. Please check your connection.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const kpis = data?.kpis || {};
  const recentRequests = data?.recentRequests || [];
  const recentApplications = data?.recentApplications || [];

  return (
    <Box sx={{ pb: 4 }}>
      {/* 🚀 Dashboard Hero Section */}
      <Box sx={{ 
        bgcolor: mode === 'dark' ? '#102344' : '#ffffff', 
        borderRadius: '24px', 
        p: { xs: 3, md: 5 }, 
        mb: 4, 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)',
        border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`
      }}>
        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Chip icon={<AutoAwesomeIcon sx={{ color: '#FBBF00 !important' }} />} label="Admin Dashboard" sx={{ bgcolor: 'rgba(251,191,0,0.15)', color: '#FBBF00', fontWeight: 800, fontFamily: '"Fredoka", sans-serif', mb: 2 }} />
              <Typography variant="h3" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: mode === 'dark' ? '#fff' : '#172A4D', mb: 1.5, letterSpacing: '-0.02em' }}>
                Welcome Back, <span style={{ color: '#2563EB' }}>Admin!</span> 👋
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: '"Nunito", sans-serif', color: 'text.secondary', fontWeight: 600, mb: 4, maxWidth: '90%', lineHeight: 1.5 }}>
                Let's keep 75 Way Project Task learning adventures running smoothly. Here's what's happening today. 🚀
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={fetchData} startIcon={loading ? <RefreshIcon sx={{ animation: 'spin 1s linear infinite' }} /> : <RefreshIcon />} sx={{ bgcolor: '#FBBF00', color: '#172A4D', fontWeight: 800, borderRadius: '20px', px: 3, py: 1.2, '&:hover': { bgcolor: '#ffca28', transform: 'translateY(-2px)' }, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(251,191,0,0.4)' }}>
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'relative', height: '100%', minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ fontSize: '8rem', zIndex: 2 }}>👩‍🏫</motion.div>
              <motion.div animate={{ y: [0, 10, 0], x: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: -20, right: 40, fontSize: '3rem', zIndex: 1 }}>✨</motion.div>
              <motion.div animate={{ y: [0, -15, 0], x: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: 0, left: 20, fontSize: '4rem', zIndex: 3 }}>📚</motion.div>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: 30, left: 50, fontSize: '2rem', zIndex: 1 }}>⭐</motion.div>
              
              {/* Floating Stat Card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, type: 'spring' }} style={{ position: 'absolute', bottom: 20, right: 0, zIndex: 4 }}>
                <Box sx={{ bgcolor: mode === 'dark' ? 'rgba(20,43,82,0.9)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', p: 1.5, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 1.5, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)'}` }}>
                  <Avatar sx={{ bgcolor: '#16A765', width: 36, height: 36 }}><TrendingUpIcon fontSize="small" /></Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>+{kpis.newRequests || 0}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>New Requests</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
        
        {/* Background blobs for hero */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0) 70%)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,0,0.1) 0%, rgba(251,191,0,0) 70%)', zIndex: 0 }} />
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Animated KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {KPI_CONFIG.map(({ key, label, icon, color }, index) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={key}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }} style={{ height: '100%' }}>
              <Box sx={{ '&:hover': { transform: 'translateY(-6px)' }, transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', height: '100%' }}>
                <KpiCard icon={icon} label={label} value={loading ? '—' : (kpis[key] ?? 0)} color={color} trend={kpis.trends?.[key]} loading={loading} />
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Requests */}
        <Grid item xs={12} xl={7}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ height: '100%' }}>
          <Card sx={{ height: '100%', borderRadius: '24px', boxShadow: mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)', border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}` }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: mode === 'dark' ? '#142B52' : '#F8FAFC' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: '"Fredoka", sans-serif', color: mode === 'dark' ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1 }}>
                  Latest Learning Requests 📚
                </Typography>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin/requests')} sx={{ fontWeight: 700, borderRadius: '20px', color: '#2563EB', bgcolor: mode === 'dark' ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)' }}>View All</Button>
              </Box>
              <Divider />
              <TableContainer sx={{ p: 1 }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: 'none', color: 'text.secondary', fontWeight: 700, fontFamily: '"Nunito", sans-serif' } }}>
                      <TableCell>Parent</TableCell>
                      <TableCell>Class / Subject</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? Array(4).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton width={120} /></TableCell>
                        <TableCell><Skeleton width={100} /></TableCell>
                        <TableCell><Skeleton width={60} /></TableCell>
                        <TableCell><Skeleton width={70} /></TableCell>
                        <TableCell><Skeleton width={60} /></TableCell>
                      </TableRow>
                    )) : recentRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                          <Box sx={{ opacity: 0.8, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                            <Typography sx={{ fontSize: '4rem', mb: 1 }}>🧒</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: '"Fredoka", sans-serif' }}>No New Learning Adventures Yet! 📚</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : recentRequests.map((r, i) => (
                      <TableRow key={r._id || r.id} hover sx={{ '& td': { borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}` }, transition: 'all 0.2s', '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={r.parentPhoto || r.avatar} sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.72rem', '& .MuiAvatar-img': { objectFit: 'contain' } }}>{r.parentName?.[0]}</Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{r.parentName}</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.mobile}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.class}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.subject}</Typography>
                        </TableCell>
                        <TableCell><Typography variant="body2">{r.city}</Typography></TableCell>
                        <TableCell><StatusChip status={r.status} /></TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => navigate('/admin/requests')}><AssignmentIcon sx={{ fontSize: 16 }} /></IconButton>
                            </Tooltip>
                            <Tooltip title={`Chat with ${r.parentName} on WhatsApp`}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleAction('whatsapp', r)}
                              >
                                <WhatsAppIcon sx={{ fontSize: 16, color: '#25D366' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`Email ${r.parentName}`}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleAction('email', r)}
                              >
                                <EmailIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          </motion.div>
        </Grid>

        {/* Teacher Applications */}
        <Grid item xs={12} xl={5}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ height: '100%' }}>
          <Card sx={{ height: '100%', borderRadius: '24px', boxShadow: mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)', border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}` }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: mode === 'dark' ? '#142B52' : '#F8FAFC' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: '"Fredoka", sans-serif', color: mode === 'dark' ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1 }}>
                  New Teacher Applications 👩‍🏫
                </Typography>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin/applications')} sx={{ fontWeight: 700, borderRadius: '20px', color: '#16A765', bgcolor: mode === 'dark' ? 'rgba(22,167,101,0.1)' : 'rgba(22,167,101,0.05)' }}>Review All</Button>
              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>
                {loading ? Array(4).fill(0).map((_, i) => (
                  <Box key={i} sx={{ p: 1.5, display: 'flex', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="40%" /></Box>
                  </Box>
                )) : recentApplications.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: 'center', opacity: 0.8, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                    <Typography sx={{ fontSize: '4rem', mb: 1 }}>👩‍🏫</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: '"Fredoka", sans-serif' }}>No New Teacher Applications Yet!</Typography>
                  </Box>
                ) : recentApplications.map((a, i) => (
                  <Box key={a._id || a.id} sx={{ mb: 1.5 }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: '16px', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`, transition: 'all 0.2s', '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff', transform: 'translateY(-2px)', boxShadow: mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.05)' } }}>
                      <Avatar src={a.photo || a.avatar} sx={{ bgcolor: a.applicationStatus === 'approved' || a.status === 'approved' ? 'success.main' : a.applicationStatus === 'rejected' || a.status === 'rejected' ? 'error.main' : 'warning.main', width: 44, height: 44, fontSize: '1rem', fontWeight: 800, '& .MuiAvatar-img': { objectFit: 'contain' } }}>
                        {a.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{a.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{(a.subjects || []).join(', ')} · {a.cities?.[0] || a.city}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <StatusChip status={a.applicationStatus || a.status} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : a.date}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
      </Grid>

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
