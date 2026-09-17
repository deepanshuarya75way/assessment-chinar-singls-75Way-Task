import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Card, Grid, Avatar, Chip, TextField, InputAdornment,
  CircularProgress, Button, Tooltip, IconButton, useTheme, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FeatureUnavailableDialog from '../../components/common/FeatureUnavailableDialog';
import { teachersAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { getDocumentInfo, fetchDocumentObjectUrl, openDocumentInNewTab } from '../../utils/documentUtils';

const getWhatsAppLink = (phone) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[\+\-\s\(\)]/g, '');
  const normalized = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone);
  return `https://wa.me/${normalized}`;
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const objectUrlRef = useRef(null);
  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  // Fetch the document through the authenticated API client and render it
  // via a temporary blob URL (raw URLs cannot carry the JWT header).
  const openPreviewDoc = useCallback(async (doc, ownerId) => {
    if (!doc || !ownerId) return;
    revokeObjectUrl();
    setPreviewDoc({ ...doc, blobUrl: null, loading: true, error: null });
    try {
      const blobUrl = await fetchDocumentObjectUrl(ownerId, doc.type);
      objectUrlRef.current = blobUrl;
      setPreviewDoc((prev) => prev && prev.url === doc.url ? { ...prev, blobUrl, loading: false } : prev);
    } catch (err) {
      setPreviewDoc((prev) => prev && prev.url === doc.url ? { ...prev, loading: false, error: err.message || 'Unable to load this document.' } : prev);
    }
  }, [revokeObjectUrl]);

  // Open document in a new browser tab (authenticated, no tokens in URLs)
  const handleOpenNewTab = useCallback(async (doc, ownerId) => {
    try {
      await openDocumentInNewTab(ownerId, doc.type);
    } catch (err) {
      console.error('Failed to open document:', err.message);
    }
  }, []);

  // Clean up blob URL on unmount
  useEffect(() => revokeObjectUrl, [revokeObjectUrl]);

  const [dialogState, setDialogState] = useState({ open: false, title: '', message: '', reason: '' });
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleAction = (type, data) => {
    if (type === 'whatsapp') {
      if (!data?.mobile) {
        setDialogState({ open: true, reason: 'MISSING_INFORMATION', title: 'Phone Number Missing', message: "This teacher doesn't have a phone number associated with their profile." });
      } else {
        window.open(getWhatsAppLink(data.mobile), '_blank');
      }
    } else if (type === 'email') {
      if (!data?.email) {
        setDialogState({ open: true, reason: 'MISSING_INFORMATION', title: 'Email Address Missing', message: "This teacher doesn't have an email address associated with their profile." });
      } else {
        window.location.href = `mailto:${data.email}?subject=75 Way Project Task Inquiry`;
      }
    } else if (type === 'view_profile') {
      setSelectedTeacher(data);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await teachersAPI.getAll({ status: 'approved', search, limit: 100 });
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTeachers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: isDark ? '#fff' : '#172A4D', display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            Your 75 Way Project Task Community 💙
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif', fontWeight: 600 }}>
            Manage all verified teachers on the platform 🎓
          </Typography>
        </Box>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '20px', bgcolor: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            🌟
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : teachers.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Typography sx={{ fontSize: '5rem', mb: 2 }}>🎓</Typography>
          </motion.div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: '"Fredoka", sans-serif', mb: 1 }}>Your Tutor Team Is Growing! 🎓</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: '"Nunito", sans-serif' }}>Approved teachers will magically appear here.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {teachers.map((t, i) => (
            <Grid item xs={12} sm={6} xl={4} key={t._id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1, type: 'spring' }} style={{ height: '100%' }}>
              <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', borderRadius: '24px', boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.2)' : '0 8px 30px rgba(37,99,235,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', '&:hover': { transform: 'translateY(-6px)', boxShadow: isDark ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(37,99,235,0.12)', '& .avatar': { transform: 'scale(1.05) rotate(2deg)' } } }}>
                <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar className="avatar" src={t.photo || t.avatar} sx={{ width: 72, height: 72, bgcolor: '#FBBF00', color: '#172A4D', fontWeight: 800, fontSize: '1.5rem', border: '3px solid', borderColor: isDark ? '#142B52' : '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', '& .MuiAvatar-img': { objectFit: 'contain' } }}>
                      {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </Avatar>
                    <VerifiedIcon sx={{ position: 'absolute', bottom: -2, right: -2, color: '#16A765', bgcolor: isDark ? '#142B52' : '#ffffff', borderRadius: '50%', fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, fontFamily: '"Fredoka", "Nunito", sans-serif', color: isDark ? '#fff' : '#172A4D', mb: 0.5 }} noWrap>{t.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}>
                      📍 {t.city || (t.cities && t.cities[0])}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontWeight: 600, fontFamily: '"Nunito", sans-serif' }}>
                      ⭐ {t.experience || 'New Teacher'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>Subjects</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(t.subjects || []).map(s => <Chip key={s} label={s} size="small" sx={{ fontSize: '0.7rem', fontWeight: 700, bgcolor: isDark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)', color: '#2563EB', borderRadius: '8px' }} />)}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>Classes</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{(t.classes || []).slice(0, 3).join(', ')}{(t.classes || []).length > 3 ? ` +${t.classes.length - 3} more` : ''}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
                  <Button size="small" variant="contained" sx={{ fontSize: '0.8rem', fontWeight: 700, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: 'text.primary', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', transform: 'translateY(-1px)' }, transition: 'all 0.2s', boxShadow: 'none' }} onClick={() => handleAction('view_profile', t)}>View Profile</Button>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={`Chat with ${t.name} on WhatsApp`}>
                      <IconButton size="small" onClick={() => handleAction('whatsapp', t)} sx={{ color: '#25D366', bgcolor: 'rgba(37,211,102,0.05)', '&:hover': { bgcolor: 'rgba(37,211,102,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
                        <WhatsAppIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Email ${t.name}`}>
                      <IconButton size="small" onClick={() => handleAction('email', t)} sx={{ color: '#2563EB', bgcolor: 'rgba(37,99,235,0.05)', '&:hover': { bgcolor: 'rgba(37,99,235,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
                        <EmailIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Teacher Profile Dialog */}
      <Dialog
        open={Boolean(selectedTeacher)}
        onClose={() => setSelectedTeacher(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', overflow: 'hidden', bgcolor: isDark ? '#07111F' : '#F6F8FC' }
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, bgcolor: isDark ? '#142B52' : '#FFFFFF', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Teacher Profile
          <IconButton onClick={() => setSelectedTeacher(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        {selectedTeacher && (
          <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', mb: 3 }}>
              <Avatar src={selectedTeacher.photo || selectedTeacher.avatar} sx={{ width: 70, height: 70, bgcolor: '#FBBF00', color: '#172A4D', fontWeight: 800, fontSize: '1.6rem' }}>
                {selectedTeacher.name ? selectedTeacher.name.split(' ').map(w => w[0]).join('').slice(0, 2) : 'T'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Fredoka", sans-serif', color: isDark ? '#fff' : '#172A4D' }}>
                  {selectedTeacher.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  🎓 {selectedTeacher.qualification} · ⭐ {selectedTeacher.experience || 'Experienced'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  📍 {selectedTeacher.city || (selectedTeacher.cities && selectedTeacher.cities.join(', ')) || 'India'}
                </Typography>
              </Box>
              <Chip label="Verified Teacher" color="success" size="small" icon={<VerifiedIcon />} sx={{ fontWeight: 700 }} />
            </Box>

            <Card sx={{ p: 3, borderRadius: '16px', bgcolor: isDark ? '#102344' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, boxShadow: 'none', mb: 3 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTeacher.email || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Mobile</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTeacher.mobile || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Teaching Mode</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTeacher.teachingMode || 'Both'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Expected Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTeacher.expectedFee ? `₹${selectedTeacher.expectedFee}/hr` : '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 0.5, display: 'block' }}>Subjects</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selectedTeacher.subjects || []).map(s => <Chip key={s} label={s} size="small" color="primary" variant="outlined" />)}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 0.5, display: 'block' }}>Classes</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selectedTeacher.classes || []).map(c => <Chip key={c} label={c} size="small" variant="outlined" />)}
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Verification Documents */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Fredoka", sans-serif', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                📄 Verified Documents
              </Typography>
              {(() => {
                const idDoc = getDocumentInfo(selectedTeacher, 'idProof');
                const degDoc = getDocumentInfo(selectedTeacher, 'highestDegree');
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
                                onClick={() => openPreviewDoc(idDoc, selectedTeacher._id)}
                                sx={{ bgcolor: isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)', color: '#2563EB' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open in New Tab">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenNewTab(idDoc, selectedTeacher._id)}
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
                                onClick={() => openPreviewDoc(degDoc, selectedTeacher._id)}
                                sx={{ bgcolor: isDark ? 'rgba(251,191,0,0.2)' : 'rgba(251,191,0,0.1)', color: '#FBBF00' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open in New Tab">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenNewTab(degDoc, selectedTeacher._id)}
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
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2.5, bgcolor: isDark ? '#142B52' : '#FFFFFF', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          <Button onClick={() => setSelectedTeacher(null)} sx={{ borderRadius: '20px', fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* In-App Document Preview Modal */}
      <Dialog
        open={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
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
                <IconButton
                  size="small"
                  onClick={() => previewDoc?.blobUrl && window.open(previewDoc.blobUrl, '_blank', 'noopener,noreferrer')}
                  sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={() => setPreviewDoc(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
                <DialogContent sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 380, bgcolor: isDark ? '#050D1A' : '#F1F5F9' }}>
          {previewDoc && previewDoc.loading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={40} sx={{ mb: 2, color: '#2563EB' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Loading document…</Typography>
            </Box>
          ) : previewDoc && previewDoc.error ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="error" sx={{ borderRadius: '12px', mb: 2, justifyContent: 'center' }}>Unable to load this document.</Alert>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 2 }}>{previewDoc.error}</Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon fontSize="small" />}
                onClick={() => openPreviewDoc(previewDoc, selectedTeacher._id)}
              >
                Retry
              </Button>
            </Box>
          ) : previewDoc && previewDoc.blobUrl ? (
            previewDoc.mimeType === 'application/pdf' || previewDoc.url?.toLowerCase().endsWith('.pdf') ? (
              <Box sx={{ width: '100%', height: '65vh', borderRadius: '16px', overflow: 'hidden', bgcolor: '#fff' }}>
                <object
                  data={previewDoc.blobUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                >
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>PDF preview frame not supported by browser.</Typography>
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
            ) : (
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
            )
          ) : null}
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
              onClick={() => previewDoc?.blobUrl && window.open(previewDoc.blobUrl, '_blank', 'noopener,noreferrer')}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Open in Tab
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => { revokeObjectUrl(); setPreviewDoc(null); }}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

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
