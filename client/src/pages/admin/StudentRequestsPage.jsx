import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, InputAdornment, Chip, Avatar,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, TablePagination, Divider, Grid,
  CircularProgress, Alert, Snackbar, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import StatusChip from '../../components/common/StatusChip';
import FeatureUnavailableDialog from '../../components/common/FeatureUnavailableDialog';
import { requestsAPI, teachersAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const getWhatsAppLink = (phone) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[\+\-\s\(\)]/g, '');
  const normalized = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone);
  return `https://wa.me/${normalized}`;
};

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [detailDialog, setDetailDialog] = useState(null);
  const [assignDialog, setAssignDialog] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [dialogState, setDialogState] = useState({ open: false, title: '', message: '', reason: '' });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleAction = (type, data) => {
    if (type === 'whatsapp') {
      if (!data.mobile) {
        setDialogState({ open: true, reason: 'MISSING_INFORMATION', title: 'Phone Number Missing', message: "This request doesn't have a phone number associated with it." });
      } else {
        window.open(getWhatsAppLink(data.mobile), '_blank');
      }
    } else if (type === 'email') {
      if (!data.email) {
        setDialogState({ open: true, reason: 'MISSING_INFORMATION', title: 'Email Address Missing', message: "This request doesn't have an email address associated with it." });
      } else {
        window.location.href = `mailto:${data.email}?subject=75 Way Project Task Inquiry: ${data.class} ${data.subject}`;
      }
    }
  };

  const fetchRequests = async () => {
    setLoading(true); setError('');
    try {
      const res = await requestsAPI.getAll({
        page: page + 1, limit: rowsPerPage, status: statusFilter, search
      });
      setRequests(res.data);
      setTotal(res.total);
    } catch (err) { setError(err.message || 'Failed to fetch requests'); }
    finally { setLoading(false); }
  };

  const fetchTeachers = async () => {
    try {
      const res = await teachersAPI.getAll({ status: 'approved', limit: 100 });
      setTeachers(res.data);
    } catch (err) { console.error('Failed to fetch teachers', err); }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRequests, 300);
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, statusFilter, search]);

  useEffect(() => { fetchTeachers(); }, []);

  const handleAssign = async () => {
    setActionLoading(true);
    try {
      await requestsAPI.assign(assignDialog._id, selectedTeacher);
      setToast('Teacher assigned successfully!');
      setAssignDialog(null);
      setSelectedTeacher('');
      fetchRequests(); // Refresh table
    } catch (err) {
      alert(err.message || 'Failed to assign teacher');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            Learning Requests 📚
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            Help students find the right learning buddy.
          </Typography>
        </Box>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '20px', bgcolor: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            🧒
          </Box>
        </motion.div>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Floating Filter Panel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card sx={{ mb: 4, p: 2, borderRadius: '20px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(37,99,235,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`, bgcolor: isDark ? '#142B52' : '#ffffff' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField size="medium" placeholder="🔎 Search by name, mobile, subject..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              sx={{ minWidth: 300, flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' } }}
              InputProps={{ startAdornment: <InputAdornment position="start"></InputAdornment> }} />
            <FormControl size="medium" sx={{ minWidth: 200 }}>
              <Select value={statusFilter} displayEmpty onChange={e => { setStatusFilter(e.target.value); setPage(0); }} sx={{ borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                <MenuItem value=""><Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>All Statuses</Typography></MenuItem>
                {['new', 'contacted', 'assigned', 'demo_scheduled', 'completed'].map(s => (
                  <MenuItem key={s} value={s}><StatusChip status={s} /></MenuItem>
                ))}
              </Select>
            </FormControl>
            {(search || statusFilter) && (
              <Button onClick={() => { setSearch(''); setStatusFilter(''); setPage(0); }} sx={{ borderRadius: '12px', fontWeight: 700, color: '#EC4899' }}>Clear</Button>
            )}
            <Box sx={{ ml: { xs: 0, md: 'auto' }, display: 'flex', gap: 1 }}>
              <Chip label={`Total: ${total}`} color="primary" sx={{ fontWeight: 800, borderRadius: '10px', px: 1, py: 2.5 }} />
            </Box>
          </Box>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <Card sx={{ borderRadius: '24px', boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, color: 'text.secondary', fontWeight: 800, fontFamily: '"Nunito", sans-serif', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, py: 2.5 } }}>
                <TableCell>#</TableCell>
                <TableCell>Parent / Student</TableCell>
                <TableCell>Class / Subject</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={10} align="center" sx={{ py: 6 }}><CircularProgress size={40} thickness={4} sx={{ color: '#FBBF00' }} /></TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 10, borderBottom: 'none' }}>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                      <Typography sx={{ fontSize: '5rem', mb: 2 }}>🧒</Typography>
                    </motion.div>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: '"Fredoka", sans-serif', mb: 1 }}>No New Learning Adventures Yet! 📚</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif' }}>When parents request a tutor, they'll magically appear here.</Typography>
                  </TableCell>
                </TableRow>
              ) : requests.map((r) => (
                <TableRow key={r._id} hover sx={{ '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`, py: 2.5 }, transition: 'all 0.2s', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>#{r._id.slice(-6).toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={r.parentPhoto || r.avatar} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem', '& .MuiAvatar-img': { objectFit: 'contain' } }}>{r.parentName[0]}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{r.parentName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.mobile}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{r.class}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.subject}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{r.city}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.locality || '-'}</Typography>
                  </TableCell>
                  <TableCell><Chip label={r.mode} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{r.budget || 'Negotiable'}</Typography></TableCell>
                  <TableCell><StatusChip status={r.status} /></TableCell>
                  <TableCell>
                    {r.assignedTeacher ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip label="🎓 Tutor Assigned" size="small" sx={{ bgcolor: 'rgba(22,167,101,0.1)', color: '#16A765', fontWeight: 800, alignSelf: 'flex-start' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
                          {r.assignedTeacher.name || r.assignedTeacherName} <CheckCircleIcon sx={{ fontSize: 14, color: '#16A765' }} />
                        </Typography>
                      </Box>
                    ) : (
                      <Button variant="outlined" size="small" onClick={() => setAssignDialog(r)} sx={{ borderRadius: '20px', fontWeight: 700, borderColor: '#FBBF00', color: '#FBBF00', '&:hover': { bgcolor: 'rgba(251,191,0,0.1)', borderColor: '#ffca28' } }}>
                        🚀 Assign Tutor
                      </Button>
                    )}
                  </TableCell>
                  <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(r.createdAt).toLocaleDateString()}</Typography></TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setDetailDialog(r)} sx={{ color: '#2563EB', bgcolor: 'rgba(37,99,235,0.05)', '&:hover': { bgcolor: 'rgba(37,99,235,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}><VisibilityIcon sx={{ fontSize: 18 }} /></IconButton>
                      </Tooltip>
                      <Tooltip title={`Chat with ${r.parentName} on WhatsApp`}>
                        <IconButton size="small" onClick={() => handleAction('whatsapp', r)} sx={{ color: '#25D366', bgcolor: 'rgba(37,211,102,0.05)', '&:hover': { bgcolor: 'rgba(37,211,102,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
                          <WhatsAppIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Email ${r.parentName}`}>
                        <IconButton size="small" onClick={() => handleAction('email', r)} sx={{ color: '#FBBF00', bgcolor: 'rgba(251,191,0,0.05)', '&:hover': { bgcolor: 'rgba(251,191,0,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
                          <EmailIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={total} page={page} rowsPerPage={rowsPerPage}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
        />
      </Card>
      </motion.div>

      {/* View Details Dialog */}
      <Dialog open={Boolean(detailDialog)} onClose={() => setDetailDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}>
        <DialogTitle sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, bgcolor: isDark ? '#142B52' : '#F8FAFC', pb: 2 }}>Request Details 📚</DialogTitle>
        <Divider />
        {detailDialog && (
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {[
                ['Parent Name', detailDialog.parentName],
                ['Mobile', detailDialog.mobile],
                ['Email', detailDialog.email || '-'],
                ['Class', detailDialog.class],
                ['Subject', detailDialog.subject],
                ['City', detailDialog.city],
                ['Locality', detailDialog.locality || '-'],
                ['Tuition Mode', detailDialog.mode],
                ['Budget', detailDialog.budget || 'Negotiable'],
                ['Requested On', new Date(detailDialog.createdAt).toLocaleString()],
                ['Assigned Teacher', detailDialog.assignedTeacher ? (detailDialog.assignedTeacher.name || detailDialog.assignedTeacherName) : 'Not Assigned'],
              ].map(([label, value]) => (
                <Grid item xs={6} key={label}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.2 }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Status</Typography>
                <StatusChip status={detailDialog.status} />
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2 }}>
            {!detailDialog?.assignedTeacher && (
              <Button variant="contained" sx={{ borderRadius: '20px', fontWeight: 700, bgcolor: '#FBBF00', color: '#172A4D', '&:hover': { bgcolor: '#ffca28' } }} onClick={() => { setAssignDialog(detailDialog); setDetailDialog(null); }}>🚀 Assign Tutor</Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Assign Teacher Dialog */}
        <Dialog open={Boolean(assignDialog)} onClose={() => setAssignDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}>
          <DialogTitle sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, bgcolor: isDark ? '#142B52' : '#F8FAFC', pb: 2 }}>Assign Tutor 🎓</DialogTitle>
          <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {assignDialog && (
            <>
              <Typography variant="body2" sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                Assigning for: <strong>{assignDialog.parentName}</strong> · {assignDialog.class} · {assignDialog.subject}
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Teacher</InputLabel>
                <Select value={selectedTeacher} label="Select Teacher" onChange={e => setSelectedTeacher(e.target.value)}>
                  {teachers.map(t => (
                    <MenuItem key={t._id} value={t._id}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{(t.subjects||[]).join(', ')} · {t.cities?.[0]}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: isDark ? '#142B52' : '#F8FAFC' }}>
          <Button onClick={() => setAssignDialog(null)} sx={{ borderRadius: '20px', fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" disabled={!selectedTeacher || actionLoading} onClick={handleAssign} sx={{ borderRadius: '20px', fontWeight: 800, bgcolor: '#16A765', color: '#fff', '&:hover': { bgcolor: '#108a50' } }}>
            {actionLoading ? 'Assigning...' : 'Assign & Notify ✨'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast('')} message={toast} />

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
