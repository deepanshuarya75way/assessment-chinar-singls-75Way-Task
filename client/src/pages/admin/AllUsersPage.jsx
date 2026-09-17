import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, TextField, InputAdornment, CircularProgress,
  Switch, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, Divider, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { adminAPI } from '../../services/api';
import { motion } from 'framer-motion';

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  const [deactivateDialog, setDeactivateDialog] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: '', type: 'success' });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ search, limit: 100 });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleClick = (user) => {
    if (user.isActive) {
      setDeactivateDialog(user);
    } else {
      // Activating user doesn't require warning modal
      handleConfirmToggle(user._id);
    }
  };

  const handleConfirmToggle = async (idToToggle) => {
    const id = idToToggle || deactivateDialog._id;
    const isDeactivating = !!deactivateDialog;
    if (isDeactivating) setActionLoading(true);
    try {
      await adminAPI.toggleUser(id);
      setToast({ open: true, msg: isDeactivating ? 'User deactivated successfully.' : 'User activated successfully.', type: 'success' });
      fetchUsers();
    } catch (err) {
      setToast({ open: true, msg: err.message || 'Failed to update user status.', type: 'error' });
    } finally {
      if (isDeactivating) {
        setActionLoading(false);
        setDeactivateDialog(null);
      }
    }
  };

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            User Accounts 👥
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            Manage all registered parents, students, and teachers 
          </Typography>
        </Box>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '20px', bgcolor: 'rgba(156,39,176,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            💜
          </Box>
        </motion.div>
      </Box>

      {/* Floating Filter Panel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card sx={{ mb: 4, p: 2, borderRadius: '20px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(37,99,235,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`, bgcolor: isDark ? '#142B52' : '#ffffff' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="medium" placeholder="🔎 Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)} sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' } }}
            InputProps={{ startAdornment: <InputAdornment position="start"></InputAdornment> }} />
        </Box>
      </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <Card sx={{ borderRadius: '24px', boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(37,99,235,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
              <TableRow sx={{ '& th': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, color: 'text.secondary', fontWeight: 800, fontFamily: '"Nunito", sans-serif', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, py: 2.5 } }}>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={40} thickness={4} sx={{ color: '#9C27B0' }} /></TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10, borderBottom: 'none' }}>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                      <Typography sx={{ fontSize: '5rem', mb: 2 }}>👥</Typography>
                    </motion.div>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: '"Fredoka", sans-serif', mb: 1 }}>No Users Found</Typography>
                  </TableCell>
                </TableRow>
              ) : users.map((u) => (
                <TableRow key={u._id} hover sx={{ '& td': { borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`, py: 2 }, transition: 'all 0.2s', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={u.photo || u.avatar} sx={{ width: 36, height: 36, bgcolor: u.role === 'teacher' ? '#16A765' : u.role === 'admin' ? '#EC4899' : '#2563EB', fontSize: '0.9rem', fontWeight: 800, '& .MuiAvatar-img': { objectFit: 'contain' } }}>
                        {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{u.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>{u.email}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>{u.mobile || '—'}</Typography></TableCell>
                  <TableCell>
                    <Chip label={u.role} size="small" 
                      sx={{ textTransform: 'capitalize', fontWeight: 800, fontSize: '0.7rem', 
                        bgcolor: u.role === 'admin' ? 'rgba(236,72,153,0.1)' : u.role === 'teacher' ? 'rgba(22,167,101,0.1)' : 'rgba(37,99,235,0.1)',
                        color: u.role === 'admin' ? '#EC4899' : u.role === 'teacher' ? '#16A765' : '#2563EB',
                        borderRadius: '8px', border: 'none'
                      }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={u.isVerified ? 'Verified' : 'Unverified'} size="small" 
                      sx={{ fontWeight: 800, fontSize: '0.7rem',
                        bgcolor: u.isVerified ? 'rgba(22,167,101,0.1)' : 'rgba(251,191,0,0.1)',
                        color: u.isVerified ? '#16A765' : '#FBBF00',
                        borderRadius: '8px', border: 'none'
                      }} />
                  </TableCell>
                  <TableCell align="right">
                    <Switch checked={u.isActive} onChange={() => handleToggleClick(u)} color="success" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#16A765' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#16A765' } }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      </motion.div>
      
      {/* Deactivation Modal */}
      <Dialog 
        open={Boolean(deactivateDialog)} 
        onClose={() => !actionLoading && setDeactivateDialog(null)}
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: '#EF4444', bgcolor: isDark ? '#142B52' : '#FEF2F2', pb: 2 }}>
          <WarningAmberIcon sx={{ fontSize: 28 }} /> Deactivate User?
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, fontFamily: '"Nunito", sans-serif' }}>
            Are you sure you want to deactivate <strong style={{ color: isDark ? '#fff' : '#172A4D' }}>{deactivateDialog?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif' }}>
            This user will no longer be able to log in or access their 75 Way Project Task account.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: isDark ? '#142B52' : '#F8FAFC' }}>
          <Button onClick={() => setDeactivateDialog(null)} disabled={actionLoading} sx={{ borderRadius: '20px', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={() => handleConfirmToggle()} variant="contained" disabled={actionLoading} sx={{ borderRadius: '20px', fontWeight: 800, bgcolor: '#EF4444', color: '#fff', '&:hover': { bgcolor: '#DC2626' } }}>
            {actionLoading ? 'Deactivating...' : 'Deactivate User 🚫'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.type} onClose={() => setToast(p => ({ ...p, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
