import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, IconButton, Box, Typography,
  TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Chip, Checkbox, FormControlLabel, CircularProgress, Autocomplete,
  Radio, RadioGroup, FormLabel, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';

import { useTeacherApplication } from '../../context/TeacherApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { teachersAPI } from '../../services/api';
import { SUBJECTS, CLASSES, CITIES, TUITION_MODES } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const QUALIFICATIONS = ['B.Tech / B.E.', 'B.Sc', 'B.Com', 'B.A.', 'M.Tech / M.E.', 'M.Sc', 'M.Com', 'M.A.', 'MBA', 'MBBS', 'PhD', 'CA', 'Other'];

/* ── theme-aware color tokens ──
   Dark values reproduce the existing dark design EXACTLY (unchanged).
   Light values follow the 75 Way Project Task light palette defined in src/theme/theme.js:
   white surfaces (#FFFFFF / #F8FAFC), navy-slate text (#1E293B / #475569),
   blue accent #2D6CDF, divider #E2E8F0. */
const getTokens = (theme) => {
  if (theme.palette.mode === 'dark') {
    return {
      paper: '#102344',
      text: '#F8FAFC',
      textSecondary: '#AFC0D8',
      accent: '#3B82F6',
      fieldBg: 'rgba(255,255,255,0.04)',
      fieldBorder: 'rgba(255,255,255,0.15)',
      subtleBorder: 'rgba(255,255,255,0.12)',
      sectionTint: 'rgba(255,255,255,0.02)',
      divider: 'rgba(255,255,255,0.08)',
      scrim: 'rgba(255,255,255,0.06)',
      scrimHover: 'rgba(255,255,255,0.12)',
      hoverSoft: 'rgba(255,255,255,0.06)',
      menuBg: '#1B3358',
      menuText: '#F8FAFC',
      confirmBg: '#1B3358',
      successText: '#22C55E',
      errorBg: 'rgba(239,68,68,0.15)',
      errorBorder: 'rgba(239,68,68,0.4)',
      errorText: '#FCA5A5',
      disabledBg: '#1e3a6e',
      disabledText: '#6b88b3',
      dangerBtn: '#EF4444',
      dangerBtnHover: '#DC2626',
      shadow: '0 24px 80px rgba(0,0,0,0.5)',
      cardShadow: '0 8px 24px rgba(0,0,0,0.25)',
      selectedTint: 'rgba(59,130,246,0.1)',
      placeholderSx: {},
    };
  }
  return {
    paper: theme.palette.background.paper,          // #FFFFFF
    text: theme.palette.text.primary,               // #1E293B
    textSecondary: theme.palette.text.secondary,    // #475569
    accent: theme.palette.primary.light,            // #2D6CDF
    fieldBg: '#FFFFFF',
    fieldBorder: 'rgba(11, 27, 51, 0.18)',
    subtleBorder: 'rgba(11, 27, 51, 0.15)',
    sectionTint: theme.palette.background.default,  // #F8FAFC
    divider: theme.palette.divider,                 // #E2E8F0
    scrim: 'rgba(11, 27, 51, 0.05)',
    scrimHover: 'rgba(11, 27, 51, 0.10)',
    hoverSoft: 'rgba(11, 27, 51, 0.04)',
    menuBg: theme.palette.background.paper,         // #FFFFFF
    menuText: theme.palette.text.primary,           // #1E293B
    confirmBg: theme.palette.background.paper,
    successText: '#15803D',
    errorBg: 'rgba(229, 57, 53, 0.06)',
    errorBorder: 'rgba(229, 57, 53, 0.35)',
    errorText: '#B91C1C',
    disabledBg: 'rgba(11, 27, 51, 0.08)',
    disabledText: 'rgba(11, 27, 51, 0.35)',
    dangerBtn: '#DC2626',
    dangerBtnHover: '#B91C1C',
    shadow: '0 24px 80px rgba(11, 27, 51, 0.18)',
    cardShadow: '0 8px 24px rgba(11, 27, 51, 0.12)',
    selectedTint: 'rgba(45, 108, 223, 0.08)',
    placeholderSx: { '& .MuiInputBase-input::placeholder': { color: '#64748B', opacity: 1 } },
  };
};

const chipSx = { borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem' };

/* ── grid helpers ── */
const formGrid = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
  gap: '20px',
};

export default function TeacherApplicationModal() {
  const { isOpen, closeTeacherApplication } = useTeacherApplication();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  /* ── theme-aware shared styles (dark = existing design, light = 75 Way Project Task light theme) ── */
  const T = getTokens(theme);

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      minHeight: '56px',
      bgcolor: T.fieldBg,
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.accent },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: T.accent, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: T.fieldBorder },
    ...T.placeholderSx,
  };

  const autocompleteSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      minHeight: '56px',
      bgcolor: T.fieldBg,
      flexWrap: 'wrap',
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.accent },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: T.accent, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: T.fieldBorder },
    ...T.placeholderSx,
  };

  const selectSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      minHeight: '56px',
      bgcolor: T.fieldBg,
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.accent },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: T.accent, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: T.fieldBorder },
    ...T.placeholderSx,
  };

  const sectionHeader = (icon, title) => (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <Typography variant="subtitle1" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 700, color: T.accent, mb: 2, mt: 1, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.05rem' }}>
        {icon} {title}
      </Typography>
    </motion.div>
  );

  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', qualification: '',
    subjects: [], classes: [], mode: '', cities: [],
    experience: '', expectedFee: '', bio: '', consent: false,
  });
  
  const [files, setFiles] = useState({ idProof: null, certificate: null });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Application status for already applied users
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Sync form with user when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setForm(p => ({ ...p, name: user.name || '', mobile: user.mobile || '', email: user.email || '' }));
      
      // Check if already applied
      teachersAPI.getMyProfile().then(res => {
        if (res.data) setApplicationStatus(res.data.applicationStatus);
      }).catch(err => {
        // If 404, it means they haven't applied, which is fine
        if (err.message && err.message.includes('not found')) {
           setApplicationStatus(null);
        }
      });
    } else if (isOpen && !user) {
       setApplicationStatus(null);
    }
  }, [isOpen, user]);

  const handleChange = (key, value) => setForm(p => ({ ...p, [key]: value }));
  const handleFileChange = (key, file) => setFiles(p => ({ ...p, [key]: file }));

  const handleSubmit = async () => {
    // Basic Validation
    if (!form.name || !form.email || !form.mobile) {
      setErrorMsg('Name, Email, and Mobile are required.');
      return;
    }
    if (form.mobile.length !== 10 || !/^\d{10}$/.test(form.mobile)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!files.idProof || !files.certificate) {
      setErrorMsg('Please upload both ID Proof and Certificate.');
      return;
    }
    if (form.subjects.length === 0 || form.classes.length === 0 || !form.mode || form.cities.length === 0) {
      setErrorMsg('Please fill in all teaching details (Subjects, Classes, Mode, Cities).');
      return;
    }
    if (!form.consent) {
      setErrorMsg('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      Object.keys(form).forEach(k => {
        if (Array.isArray(form[k])) formData.append(k, JSON.stringify(form[k]));
        else formData.append(k, form[k]);
      });
      if (files.idProof) formData.append('idProof', files.idProof);
      if (files.certificate) formData.append('certificate', files.certificate);

      await teachersAPI.apply(formData);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!submitted && form.name && !applicationStatus) {
      setConfirmOpen(true);
      return;
    }
    closeTeacherApplication();
    // Reset state after closing animation
    setTimeout(() => {
      setSubmitted(false);
      setErrorMsg('');
      setFiles({ idProof: null, certificate: null });
    }, 500);
  };

  const confirmClose = () => {
    setConfirmOpen(false);
    closeTeacherApplication();
    setTimeout(() => {
      setSubmitted(false);
      setErrorMsg('');
      setFiles({ idProof: null, certificate: null });
    }, 500);
  };

  const cancelClose = () => {
    setConfirmOpen(false);
  };

  if (!isOpen) return null;

  /* ── Document upload card ── */
  const DocCard = ({ label, emoji, fileKey }) => {
    const file = files[fileKey];
    return (
      <motion.div whileHover={{ y: -3, boxShadow: T.cardShadow }} transition={{ duration: 0.2 }}
        style={{ border: `2px dashed ${file ? '#22C55E' : T.fieldBorder}`, borderRadius: '16px', padding: '28px 20px', textAlign: 'center', background: file ? 'rgba(34,197,94,0.06)' : T.sectionTint, transition: 'border-color 0.3s, background 0.3s' }}>
        <CloudUploadIcon sx={{ fontSize: 38, color: file ? '#22C55E' : 'text.secondary', mb: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{emoji} {label}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>PDF / JPG / PNG</Typography>
        <Button variant="outlined" component="label" size="small"
          sx={{ borderRadius: '20px', fontWeight: 700, textTransform: 'none', color: file ? T.successText : T.accent, borderColor: file ? '#22C55E' : T.accent }}>
          {file ? 'Change File' : 'Select File'}
          <input type="file" hidden onChange={e => handleFileChange(fileKey, e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
        </Button>
        {file && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: T.successText, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', mx: 'auto' }}>
            ✓ {file.name}
          </Typography>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            bgcolor: T.paper,
            backgroundImage: 'none',
            boxShadow: T.shadow,
            overflowY: 'auto',
            maxHeight: '90vh',
            width: 'min(1100px, calc(100vw - 48px))',
            maxWidth: '1100px',
            color: T.text,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }
        }}
      >
        {/* ── HEADER ── */}
        <DialogTitle sx={{ pb: 1, pt: 4, px: { xs: 3, sm: 4 }, position: 'relative' }}>
          <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, color: T.text, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            🎓 Become a Tutor
          </Typography>
          <Typography variant="subtitle1" sx={{ color: T.textSecondary, fontWeight: 600, fontFamily: '"Nunito", sans-serif', mt: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
            Share your knowledge and help a child learn something amazing!
          </Typography>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 16, top: 16, color: T.textSecondary, bgcolor: T.scrim, '&:hover': { bgcolor: T.scrimHover } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 3, sm: 4 }, pb: 4, pt: 2 }}>

          {/* ── NOT LOGGED IN ── */}
          {!user && !submitted && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Fredoka", sans-serif', color: T.text }}>
                Join 75 Way Project Task
              </Typography>
              <Typography variant="body1" sx={{ color: T.textSecondary, mb: 4, maxWidth: 400, mx: 'auto' }}>
                Please log in or create an account first so we can securely link your teacher application.
              </Typography>
              <Button variant="contained" onClick={() => { closeTeacherApplication(); navigate('/login?intent=teacher_application'); }}
                sx={{ borderRadius: '30px', px: 5, py: 1.5, fontWeight: 700, bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}>
                Log In / Sign Up
              </Button>
            </Box>
          )}

          {/* ── ALREADY APPLIED OR TEACHER ── */}
          {user && applicationStatus && !submitted && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              {applicationStatus === 'approved' ? (
                <>
                  <CheckCircleIcon sx={{ fontSize: 70, color: '#22C55E', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Fredoka", sans-serif', color: T.text }}>
                    You're already a 75 Way Project Task Teacher
                  </Typography>
                  <Button variant="contained" onClick={() => { closeTeacherApplication(); navigate('/teacher/dashboard'); }}
                    sx={{ borderRadius: '30px', mt: 2, px: 4, bgcolor: '#2563EB' }}>
                    Go to Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>⏳</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Fredoka", sans-serif', color: T.text }}>
                    Application {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: T.textSecondary, mb: 4, maxWidth: 400, mx: 'auto' }}>
                    Your teacher application is currently {applicationStatus}. We will notify you once there is an update.
                  </Typography>
                  <Button variant="outlined" onClick={handleClose} sx={{ borderRadius: '30px', px: 4, color: T.textSecondary, borderColor: T.textSecondary, ...(theme.palette.mode === 'dark' ? {} : { '&:hover': { borderColor: T.textSecondary } }) }}>Close</Button>
                </>
              )}
            </Box>
          )}

          {/* ══════════════════════════════════════════════════════════
               APPLICATION FORM — SINGLE INSTANCE, NO DUPLICATES
             ══════════════════════════════════════════════════════════ */}
          {user && !applicationStatus && !submitted && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

              {/* Error banner */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Box sx={{ mb: 3, p: 2, bgcolor: T.errorBg, border: `1px solid ${T.errorBorder}`, color: T.errorText, borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem' }}>
                      ⚠️ {errorMsg}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── SECTION: Basic Information ── */}
              {sectionHeader('👤', 'BASIC INFORMATION')}
              <Box sx={formGrid}>
                <TextField fullWidth label="Full Name" placeholder="Enter your full name" value={form.name} onChange={e => handleChange('name', e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
                <TextField fullWidth label="Mobile Number" placeholder="Enter mobile number" value={form.mobile} onChange={e => handleChange('mobile', e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
                <TextField fullWidth label="Email" placeholder="Enter email address" value={form.email} disabled InputLabelProps={{ shrink: true }} sx={inputSx} />
                <FormControl fullWidth sx={selectSx}>
                  <InputLabel shrink>Qualification</InputLabel>
                  <Select value={form.qualification} label="Qualification" displayEmpty onChange={e => handleChange('qualification', e.target.value)} MenuProps={{ PaperProps: { sx: { bgcolor: T.menuBg, color: T.menuText, maxHeight: 300 } } }}
                    renderValue={v => v || <span style={{ color: T.textSecondary }}>Select qualification</span>}>
                    {QUALIFICATIONS.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              {/* ── SECTION: Teaching Details ── */}
              <Box sx={{ mt: 4 }}>{sectionHeader('📚', 'TEACHING DETAILS')}</Box>
              <Box sx={formGrid}>
                <TextField fullWidth label="Experience (Years)" type="number" placeholder="Years of experience" value={form.experience} onChange={e => handleChange('experience', e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
                <TextField fullWidth label="Expected Fee (₹ / hr)" type="number" placeholder="₹500 / hour" value={form.expectedFee} onChange={e => handleChange('expectedFee', e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />

                {/* Full-width multi-selects */}
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Autocomplete multiple options={SUBJECTS} freeSolo value={form.subjects} onChange={(e, val) => handleChange('subjects', val)}
                    renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={chipSx} />)}
                    renderInput={(params) => <TextField {...params} label="Subjects" placeholder="Select or type subjects…" InputLabelProps={{ shrink: true }} sx={autocompleteSx} />}
                  />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Autocomplete multiple options={CLASSES} freeSolo value={form.classes} onChange={(e, val) => handleChange('classes', val)}
                    renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={chipSx} />)}
                    renderInput={(params) => <TextField {...params} label="Classes" placeholder="Select or type classes…" InputLabelProps={{ shrink: true }} sx={autocompleteSx} />}
                  />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Autocomplete multiple options={CITIES} freeSolo value={form.cities} onChange={(e, val) => handleChange('cities', val)}
                    renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={chipSx} />)}
                    renderInput={(params) => <TextField {...params} label="Cities" placeholder="Select or type cities…" InputLabelProps={{ shrink: true }} sx={autocompleteSx} />}
                  />
                </Box>

                {/* Teaching Mode — radio group */}
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel sx={{ color: T.textSecondary, fontWeight: 600, mb: 1, fontSize: '0.95rem', '&.Mui-focused': { color: T.accent } }}>Teaching Mode</FormLabel>
                    <RadioGroup row value={form.mode} onChange={e => handleChange('mode', e.target.value)} sx={{ gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                      {TUITION_MODES.map(m => (
                        <FormControlLabel key={m} value={m} label={m}
                          control={<Radio sx={{ color: T.textSecondary, '&.Mui-checked': { color: T.accent } }} />}
                          sx={{ border: '1px solid', borderColor: form.mode === m ? T.accent : T.subtleBorder, borderRadius: '12px', px: 2, py: 0.5, mr: 0, transition: 'all 0.2s', bgcolor: form.mode === m ? T.selectedTint : 'transparent', '&:hover': { borderColor: T.accent }, '& .MuiFormControlLabel-label': { fontWeight: 600, fontSize: '0.9rem' } }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>

              {/* ── SECTION: About You ── */}
              <Box sx={{ mt: 4 }}>{sectionHeader('✨', 'ABOUT YOU')}</Box>
              <TextField fullWidth multiline rows={4} label="Professional Bio (Optional)" placeholder="Tell parents about your teaching experience, style and subjects…" value={form.bio} onChange={e => handleChange('bio', e.target.value)} InputLabelProps={{ shrink: true }}
                sx={{ ...inputSx, '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], minHeight: '130px' } }} />

              {/* ── SECTION: Documents ── */}
              <Box sx={{ mt: 4 }}>{sectionHeader('📄', 'VERIFICATION DOCUMENTS')}</Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '20px' }}>
                <DocCard label="ID Proof" emoji="📄" fileKey="idProof" />
                <DocCard label="Highest Degree" emoji="🎓" fileKey="certificate" />
              </Box>

              {/* ── Consent + Actions ── */}
              <Box sx={{ mt: 4, borderTop: `1px solid ${T.divider}`, pt: 3 }}>
                <FormControlLabel
                  control={<Checkbox checked={form.consent} onChange={e => handleChange('consent', e.target.checked)} sx={{ color: T.textSecondary, '&.Mui-checked': { color: T.accent } }} />}
                  label={<Typography variant="body2" sx={{ color: T.textSecondary }}>I agree to the Terms & Conditions and certify that all information is accurate.</Typography>}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button onClick={handleClose} sx={{ fontWeight: 700, color: T.textSecondary, '&:hover': { bgcolor: T.hoverSoft } }}>Cancel</Button>
                  <Button variant="contained" onClick={handleSubmit} disabled={loading}
                    sx={{ borderRadius: '24px', px: 4, py: 1.5, fontWeight: 800, bgcolor: '#2563EB', color: '#fff', textTransform: 'none', fontSize: '0.95rem', '&:hover': { bgcolor: '#1D4ED8' }, '&.Mui-disabled': { bgcolor: T.disabledBg, color: T.disabledText } }}>
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Application 🚀'}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* ── SUCCESS STATE ── */}
          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: '#22C55E', mb: 2 }} />
                <Typography variant="h4" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800, mb: 2, color: T.text }}>
                  🎉 Application Submitted!
                </Typography>
                <Typography variant="body1" sx={{ color: T.textSecondary, mb: 4, maxWidth: 500, mx: 'auto', fontSize: '1.1rem' }}>
                  Thanks for applying to become a 75 Way Project Task tutor. Our team will review your application and get back to you within 24-48 hours.
                </Typography>
                <Button variant="contained" onClick={handleClose}
                  sx={{ borderRadius: '30px', px: 5, py: 1.5, fontWeight: 700, bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}>
                  Done
                </Button>
              </Box>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Confirm-Leave Dialog ── */}
      <Dialog open={confirmOpen} onClose={cancelClose} maxWidth="xs" fullWidth
        PaperProps={{ sx: { bgcolor: T.confirmBg, color: T.text, borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Leave Application?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: T.textSecondary }}>Your entered information will be lost. Do you want to continue?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cancelClose} sx={{ color: T.textSecondary }}>Cancel</Button>
          <Button onClick={confirmClose} variant="contained" sx={{ bgcolor: T.dangerBtn, '&:hover': { bgcolor: T.dangerBtnHover }, borderRadius: '10px', fontWeight: 700 }}>Yes, Leave</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
