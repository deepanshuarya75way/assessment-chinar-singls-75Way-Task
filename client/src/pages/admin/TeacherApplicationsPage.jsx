import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Card, Grid, Avatar, Button, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment,
  Divider, Alert, Snackbar, CircularProgress, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import StatusChip from '../../components/common/StatusChip';
import FeatureUnavailableDialog from '../../components/common/FeatureUnavailableDialog';
import { teachersAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import VerifiedIcon from '@mui/icons-material/Verified';

const getWhatsAppLink = (phone) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[\+\-\s\(\)]/g, '');
  const normalized = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone);
  return `https://wa.me/${normalized}`;
};

import { getDocumentInfo, fetchDocumentObjectUrl, openDocumentInNewTab } from '../../utils/documentUtils';

export default function TeacherApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewDialog, setViewDialog] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const objectUrlRef = useRef(null);

  // Blob object URLs are revoked as soon as they are no longer shown
  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  // Fetches the document through the authenticated API client and renders it
  // via a temporary blob URL (raw URLs cannot carry the JWT header).
  const openPreview = async (doc, ownerId) => {
    revokeObjectUrl();
    setPreviewDoc({ ...doc, loading: true, blobUrl: null, error: null });
    try {
      const blobUrl = await fetchDocumentObjectUrl(ownerId, doc.type);
      objectUrlRef.current = blobUrl;
      setPreviewDoc((prev) => (prev && prev.url === doc.url ? { ...prev, blobUrl, loading: false } : prev));
    } catch (err) {
      setPreviewDoc((prev) => (prev && prev.url === doc.url ? { ...prev, loading: false, error: err.message || 'Unable to load this document.' } : prev));
    }
  };

  const closePreview = () => {
    revokeObjectUrl();
    setPreviewDoc(null);
  };

  useEffect(() => () => revokeObjectUrl(), []);
  
  // Rejection modal
  const [rejectDialog, setRejectDialog] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [snack, setSnack] = useState({ open: false, msg: '', type: 'success' });
  const [dialogState, setDialogState] = useState({ open: false, title: '', message: '', reason: '' });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleAction = (type, data) => {
    if (type === 'whatsapp') {
      if (!data.mobile) {
        setDialogState({ open: true, reason: 'MISSING_INFORMATION', title: 'Phone Number Missing', message: "This applicant doesn't have a phone number associated with their profile." });
      } else {
        window.open(getWhatsAppLink(data.mobile), '_blank');
      }
    } else if (type === 'email') {
      if (!data.email) {
        setDialogState({ open: true, reason: 'MISSING_INFORMATION', title: 'Email Address Missing', message: "This applicant doesn't have an email address associated with their profile." });
      } else {
        window.location.href = `mailto:${data.email}?subject=75 Way Project Task Application`;
      }
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await teachersAPI.getApplications({ status: statusFilter, search, limit: 100 });
      setApplications(res.data);
      setTotal(res.total);
    } catch (err) {
      setSnack({ open: true, msg: err.message || 'Failed to load applications', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchApplications, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const handleApprove = async (id) => {
    try {
      await teachersAPI.approve(id);
      setSnack({ open: true, msg: `Application approved successfully.`, type: 'success' });
      setViewDialog(null);
      fetchApplications();
    } catch (err) {
      setSnack({ open: true, msg: err.message || `Failed to approve`, type: 'error' });
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setSnack({ open: true, msg: 'Please provide a reason for rejection.', type: 'error' });
      return;
    }
    try {
      await teachersAPI.reject(rejectDialog._id, rejectReason);
      setSnack({ open: true, msg: `Application rejected successfully.`, type: 'success' });
      setRejectDialog(null);
      setViewDialog(null);
      setRejectReason('');
      fetchApplications();
    } catch (err) {
      setSnack({ open: true, msg: err.message || `Failed to reject`, type: 'error' });
    }
  };

  const filteredApplications = applications.filter(a => {
    if (search) {
      const s = search.toLowerCase();
      return (a.fullName?.toLowerCase().includes(s) || a.email?.toLowerCase().includes(s));
    }
    return true;
  });

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            Teacher Applications 👩‍🏫
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            Review, approve or reject teacher applications
          </Typography>
        </Box>
      </Box>

      {/* Filter Panel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card sx={{ mb: 4, p: 2, borderRadius: '20px', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(37,99,235,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`, bgcolor: isDark ? '#142B52' : '#ffffff' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 0, flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { label: 'All', val: '' },
          { label: 'Pending', val: 'pending' },
          { label: 'Approved', val: 'approved' },
          { label: 'Rejected', val: 'rejected' },
        ].map(({ label, val }) => (
          <Chip key={val} label={label} clickable onClick={() => setStatusFilter(val)}
            variant={statusFilter === val ? 'filled' : 'outlined'}
            color={statusFilter === val ? 'primary' : 'default'} sx={{ fontWeight: 600 }} />
        ))}
          <TextField size="medium" placeholder="🔎 Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)} sx={{ ml: { xs: 0, md: 'auto' }, minWidth: 300, flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' } }}
            InputProps={{ startAdornment: <InputAdornment position="start"></InputAdornment> }} />
        </Box>
      </Card>
      </motion.div>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2.5}>
            {filteredApplications.map((a, i) => (
              <Grid item xs={12} sm={6} xl={4} key={a._id}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1, type: 'spring' }} style={{ height: '100%' }}>
                <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '24px', boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.2)' : '0 8px 30px rgba(37,99,235,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', '&:hover': { transform: 'translateY(-6px)', boxShadow: isDark ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(37,99,235,0.12)' } }}>
                  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar className="avatar" sx={{
                        width: 64, height: 64, fontSize: '1.2rem', fontWeight: 800,
                        bgcolor: a.status === 'approved' ? 'success.main' : a.status === 'rejected' ? 'error.main' : '#FBBF00',
                        color: a.status === 'pending' ? '#172A4D' : '#fff',
                        border: '3px solid',
                        borderColor: isDark ? '#142B52' : '#ffffff',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        {a.fullName ? a.fullName.split(' ').map(w => w[0]).join('').slice(0, 2) : 'T'}
                      </Avatar>
                      {a.status === 'approved' && (
                        <VerifiedIcon sx={{ position: 'absolute', bottom: -4, right: -4, color: '#16A765', bgcolor: isDark ? '#142B52' : '#ffffff', borderRadius: '50%', fontSize: 24 }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, fontFamily: '"Fredoka", "Nunito", sans-serif', color: isDark ? '#fff' : '#172A4D', mb: 0.5 }} noWrap>{a.fullName}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}>
                        🎓 {a.qualification}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}>
                        📍 {a.cities?.[0]} · ⭐ {a.experience || 'New'}
                      </Typography>
                    </Box>
                    <StatusChip status={a.status} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>Subjects</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(a.subjects || []).map(s => <Chip key={s} label={s} size="small" sx={{ fontSize: '0.7rem', fontWeight: 700, bgcolor: isDark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)', color: '#2563EB', borderRadius: '8px' }} />)}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>Classes</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{(a.classes || []).slice(0, 3).join(', ')}{(a.classes || []).length > 3 ? ` +${a.classes.length - 3} more` : ''}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Button size="small" variant="contained" 
                      onClick={() => setViewDialog(a)} sx={{ fontSize: '0.8rem', fontWeight: 700, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: 'text.primary', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', transform: 'translateY(-1px)' }, transition: 'all 0.2s', boxShadow: 'none' }}>
                      View Full Information
                    </Button>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                      <Tooltip title={`Chat on WhatsApp`}>
                        <IconButton size="small" onClick={() => handleAction('whatsapp', a)} sx={{ color: '#25D366', bgcolor: 'rgba(37,211,102,0.05)', '&:hover': { bgcolor: 'rgba(37,211,102,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
                          <WhatsAppIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Email`}>
                        <IconButton size="small" onClick={() => handleAction('email', a)} sx={{ color: '#2563EB', bgcolor: 'rgba(37,99,235,0.05)', '&:hover': { bgcolor: 'rgba(37,99,235,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
                          <EmailIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: -0.5, fontWeight: 600 }}>Applied: {new Date(a.createdAt).toLocaleDateString()}</Typography>
                </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {applications.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Typography sx={{ fontSize: '5rem', mb: 2 }}>👩‍🏫</Typography>
              </motion.div>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 800, fontFamily: '"Fredoka", sans-serif', mb: 1 }}>No Applications Found</Typography>
              <Typography variant="body1" sx={{ fontFamily: '"Nunito", sans-serif' }}>There are no teacher applications matching your criteria.</Typography>
            </Box>
          )}
        </>
      )}

      {/* View Application Dialog */}
      <Dialog open={Boolean(viewDialog)} onClose={() => setViewDialog(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', bgcolor: isDark ? '#07111F' : '#F6F8FC' } }}>
        <DialogTitle sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, bgcolor: isDark ? '#142B52' : '#FFFFFF', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Teacher Application
          <IconButton onClick={() => setViewDialog(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        {viewDialog && (
          <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Fredoka", sans-serif', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                👨‍🏫 Teacher Information
              </Typography>
              <Card sx={{ p: 3, borderRadius: '16px', bgcolor: isDark ? '#102344' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, boxShadow: 'none' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewDialog.fullName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Email</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewDialog.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Mobile</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewDialog.mobile}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Qualification</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewDialog.qualification}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Experience</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewDialog.experience || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Expected Fee</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewDialog.expectedFee ? `₹${viewDialog.expectedFee}/hr` : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Teaching Mode</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{viewDialog.teachingMode || 'Both'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>Subjects</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(viewDialog.subjects || []).map(s => <Chip key={s} label={s} size="small" color="primary" variant="outlined" />)}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>Classes</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(viewDialog.classes || []).map(c => <Chip key={c} label={c} size="small" variant="outlined" />)}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>Cities</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(viewDialog.cities || []).map(c => <Chip key={c} label={c} size="small" variant="outlined" />)}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>Professional Bio</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', p: 2, borderRadius: '12px' }}>
                      {viewDialog.professionalBio || 'No bio provided.'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Fredoka", sans-serif', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                📄 Verification Documents
              </Typography>
              {(() => {
                const idDoc = getDocumentInfo(viewDialog, 'idProof');
                const degDoc = getDocumentInfo(viewDialog, 'highestDegree');
                return (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ p: 2, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2, bgcolor: isDark ? '#102344' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, boxShadow: 'none' }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(37,99,235,0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <InsertDriveFileIcon />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>ID Proof</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {idDoc ? idDoc.fileName : 'Not uploaded'}
                          </Typography>
                        </Box>
                        {idDoc && (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Preview In-App">
                              <IconButton
                                size="small"
                                onClick={() => openPreview(idDoc, viewDialog._id)}
                                sx={{ bgcolor: isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)', color: '#2563EB', '&:hover': { bgcolor: isDark ? 'rgba(37,99,235,0.3)' : 'rgba(37,99,235,0.2)' } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open in New Tab">
                              <IconButton
                                size="small"
                                onClick={() => openDocumentInNewTab(viewDialog._id, idDoc.type).catch((err) => setSnack({ open: true, msg: err.message || 'Unable to open document.', type: 'error' }))}
                                sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ p: 2, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2, bgcolor: isDark ? '#102344' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, boxShadow: 'none' }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(251,191,0,0.1)', color: '#FBBF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <InsertDriveFileIcon />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Highest Degree</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {degDoc ? degDoc.fileName : 'Not uploaded'}
                          </Typography>
                        </Box>
                        {degDoc && (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Preview In-App">
                              <IconButton
                                size="small"
                                onClick={() => openPreview(degDoc, viewDialog._id)}
                                sx={{ bgcolor: isDark ? 'rgba(251,191,0,0.2)' : 'rgba(251,191,0,0.1)', color: '#FBBF00', '&:hover': { bgcolor: isDark ? 'rgba(251,191,0,0.3)' : 'rgba(251,191,0,0.2)' } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open in New Tab">
                              <IconButton
                                size="small"
                                onClick={() => openDocumentInNewTab(viewDialog._id, degDoc.type).catch((err) => setSnack({ open: true, msg: err.message || 'Unable to open document.', type: 'error' }))}
                                sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Card>
                    </Grid>
                  </Grid>
                );
              })()}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Status:</Typography>
              <StatusChip status={viewDialog.status} />
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 3, bgcolor: isDark ? '#142B52' : '#FFFFFF', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, justifyContent: 'space-between' }}>
          <Button onClick={() => setViewDialog(null)} sx={{ borderRadius: '20px', fontWeight: 700 }}>Close</Button>
          {viewDialog?.status === 'pending' && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => setRejectDialog(viewDialog)} sx={{ borderRadius: '20px', fontWeight: 700, px: 3 }}>Reject Application</Button>
              <Button variant="contained" color="success" onClick={() => handleApprove(viewDialog._id)} sx={{ borderRadius: '20px', fontWeight: 800, px: 3 }}>✓ Approve Application</Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* In-App Document Preview Modal */}
      <Dialog
        open={Boolean(previewDoc)}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
            bgcolor: isDark ? '#07111F' : '#FFFFFF',
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: '"Fredoka", "Nunito", sans-serif',
          fontWeight: 800,
          bgcolor: isDark ? '#142B52' : '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <InsertDriveFileIcon sx={{ color: '#2563EB' }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }} noWrap>
                {previewDoc?.title || 'Document Preview'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap display="block">
                {previewDoc?.fileName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {previewDoc && (
              <Tooltip title="Open in new browser tab">
                <span>
                  <IconButton
                    size="small"
                    disabled={!previewDoc.blobUrl}
                    onClick={() => window.open(previewDoc.blobUrl, '_blank', 'noopener,noreferrer')}
                    sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <IconButton onClick={closePreview}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 380, bgcolor: isDark ? '#050D1A' : '#F1F5F9' }}>
          {previewDoc && (
            previewDoc.loading ? (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={40} sx={{ mb: 2, color: '#2563EB' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Loading document…</Typography>
              </Box>
            ) : previewDoc.error ? (
              <Box sx={{ textAlign: 'center' }}>
                <Alert severity="error" sx={{ borderRadius: '12px', mb: 2, justifyContent: 'center' }}>Unable to load this document.</Alert>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 2 }}>{previewDoc.error}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon fontSize="small" />}
                  onClick={() => openPreview(previewDoc, viewDialog?._id)}
                >
                  Retry
                </Button>
              </Box>
            ) : previewDoc.blobUrl && (previewDoc.mimeType === 'application/pdf' || previewDoc.url?.toLowerCase().endsWith('.pdf')) ? (
              <Box sx={{ width: '100%', height: '65vh', borderRadius: '16px', overflow: 'hidden', bgcolor: '#fff' }}>
                <object
                  data={previewDoc.blobUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                >
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>Preview frame not supported by browser.</Typography>
                    <Button
                      variant="contained"
                      onClick={() => window.open(previewDoc.blobUrl, '_blank', 'noopener,noreferrer')}
                      startIcon={<OpenInNewIcon />}
                    >
                      Open PDF in New Tab
                    </Button>
                  </Box>
                </object>
              </Box>
            ) : previewDoc.blobUrl ? (
              <Box sx={{ textAlign: 'center', width: '100%', maxHeight: '70vh', overflow: 'auto' }}>
                <img
                  src={previewDoc.blobUrl}
                  alt={previewDoc.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '68vh',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    display: 'inline-block',
                  }}
                />
              </Box>
            ) : null
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3, bgcolor: isDark ? '#142B52' : '#F8FAFC', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            75 Way Project Task Secure Document Viewer
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<OpenInNewIcon />}
              disabled={!previewDoc?.blobUrl}
              onClick={() => window.open(previewDoc.blobUrl, '_blank', 'noopener,noreferrer')}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Open in Tab
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={closePreview}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={Boolean(rejectDialog)} onClose={() => setRejectDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle sx={{ fontFamily: '"Fredoka", sans-serif', fontWeight: 800 }}>Reject Teacher Application?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Please provide a reason for rejecting this application. The applicant will receive this in an email.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            InputProps={{ sx: { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRejectDialog(null)} sx={{ borderRadius: '20px', fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReject} sx={{ borderRadius: '20px', fontWeight: 700 }}>Reject Application</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.type} onClose={() => setSnack(p => ({ ...p, open: false }))} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>

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
