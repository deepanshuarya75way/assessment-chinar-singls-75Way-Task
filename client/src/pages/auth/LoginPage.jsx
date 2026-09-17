import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Card, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress, Divider, Chip,
  FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
  DialogContent
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';
import ChangePasswordModal from '../../components/auth/ChangePasswordModal';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login', 'signup'
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Verification Modal State
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [tempPassword, setTempPassword] = useState(''); // To auto-login after verify
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);
  
  // Resend Cooldown
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // Forgot Password modal + forced password change after temporary-password login
  const [forgotOpen, setForgotOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validateForm = () => {
    if (!form.email || !form.password) return 'Email and password are required.';
    if (mode === 'signup') {
      if (!form.name || !form.mobile) return 'All fields are required.';
      if (form.mobile.length !== 10 || !/^\d{10}$/.test(form.mobile)) return 'Enter a valid 10-digit mobile number.';
      if (form.password.length < 6) return 'Password must be at least 6 characters.';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        return 'Password must contain uppercase, lowercase, and a number.';
      }
    }
    return '';
  };

  const handleLoginSuccess = (user) => {
    const params = new URLSearchParams(window.location.search);
    const intent = params.get('intent');
    
    if (intent === 'teacher_application') {
      navigate('/?intent=teacher_application');
      return;
    }

    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'teacher') navigate('/teacher/dashboard');
    else navigate('/student/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setError(''); setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        if (user?.mustChangePassword) {
          // Temporary password issued via "Forgot Password" — require the user
          // to set a permanent password before continuing to the dashboard.
          setPendingUser(user);
          setChangeOpen(true);
        } else {
          handleLoginSuccess(user);
        }
      } else if (mode === 'signup') {
        await authAPI.register(form);
        setVerifyEmail(form.email);
        setTempPassword(form.password);
        setVerifyModalOpen(true);
      }
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        setVerifyEmail(form.email);
        setTempPassword(form.password);
        setVerifyModalOpen(true);
      } else {
        setError(err.message || 'Operation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (emailToResend) => {
    if (resendCooldown > 0) return;
    const targetEmail = emailToResend || verifyEmail;
    try {
      setVerifyError('');
      await authAPI.resendOtp({ email: targetEmail });
      setResendCooldown(60);
    } catch (err) {
      setVerifyError(err.message || 'Failed to resend verification code.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pastedData.length, 5);
      otpRefs.current[nextFocus]?.focus();
    }
  };

  const submitOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setVerifyError('Please enter all 6 digits.');
      return;
    }

    setVerifyLoading(true);
    setVerifyError('');

    try {
      await authAPI.verifyOtp({ email: verifyEmail, otp: code });
      setVerifySuccess(true);
      
      // Auto login safely using the stored temp credentials
      if (tempPassword) {
        const user = await login(verifyEmail, tempPassword);
        setTimeout(() => handleLoginSuccess(user), 1500); // give time to see success animation
      }
    } catch (err) {
      setVerifyError(err.message || 'Invalid verification code.');
      // Keep OTP values but clear error on next type
    } finally {
      setVerifyLoading(false);
    }
  };

  const fillDemo = (role) => {
    setMode('login');
    if (role === 'admin') setForm({ ...form, email: 'admin@tuitionhub.com', password: 'Admin@123456' });
    else setForm({ ...form, email: 'teacher@tuitionhub.com', password: 'Teacher@123' });
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: 'linear-gradient(135deg, #0f1624 0%, #1a2237 50%, #0f2040 100%)',
    }}>
      <Container maxWidth="xs">
        <Card sx={{ p: 4, borderRadius: 3 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,#1B2A4A,#2D6CDF)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
              <SchoolIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: '"Poppins",sans-serif', fontWeight: 700 }}>
              Demo<span style={{ color: '#F2B705' }}>Project</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mode === 'signup' && (
              <>
                <TextField fullWidth label="Full Name" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                <TextField fullWidth label="Mobile Number" value={form.mobile}
                  onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} required inputProps={{ maxLength: 10 }} />
                <FormControl fullWidth size="small">
                  <InputLabel>I am a...</InputLabel>
                  <Select value={form.role} label="I am a..." onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                    <MenuItem value="student">Student / Parent</MenuItem>
                    <MenuItem value="teacher">Teacher / Tutor</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            <TextField fullWidth label="Email Address" type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email" required />
            
            <TextField fullWidth label="Password" type={showPass ? 'text' : 'password'}
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              autoComplete="current-password" required
               slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPass(prev => !prev)}
                        edge="end"
                        aria-label={showPass ? 'Hide password' : 'Show password'}
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
             />

            {mode === 'login' && (
              <Box sx={{ textAlign: 'right', mt: -1 }}>
                <Typography
                  component="button"
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  variant="caption"
                  sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500, bgcolor: 'transparent', border: 'none', p: 0, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot password?
                </Typography>
              </Box>
            )}

            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : (mode === 'login' ? <LockOutlinedIcon /> : <PersonAddIcon />)}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <Typography component="span" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </Typography>
          </Typography>
        </Card>
      </Container>

      {/* Verification Modal */}
      <Dialog 
        open={verifyModalOpen} 
        onClose={() => { if (!verifySuccess && !verifyLoading) setVerifyModalOpen(false); }}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontFamily: '"Fredoka", "Nunito", sans-serif', fontWeight: 800 }}>
            Verify Your Email ✨
          </Typography>
          {!verifySuccess && !verifyLoading && (
            <IconButton onClick={() => setVerifyModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <AnimatePresence mode="wait">
            {!verifySuccess ? (
              <motion.div key="verify-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Box sx={{ textAlign: 'center', mb: 3, mt: 1 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#E5EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <MarkEmailUnreadIcon sx={{ color: '#2563EB', fontSize: 32 }} />
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    We sent a 6-digit verification code to
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#172A4D' }}>
                    {maskEmail(verifyEmail)}
                  </Typography>
                </Box>

                {verifyError && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{verifyError}</Alert>}

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <TextField
                      key={i}
                      inputRef={el => otpRefs.current[i] = el}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, padding: '12px 0' } }}
                      sx={{ width: 48, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  ))}
                </Box>

                <Button 
                  fullWidth variant="contained" size="large" 
                  disabled={verifyLoading || otp.join('').length !== 6}
                  onClick={submitOtp}
                  sx={{ borderRadius: '16px', py: 1.5, fontWeight: 700, mb: 3, bgcolor: '#2563EB' }}
                >
                  {verifyLoading ? 'Verifying...' : 'Verify Email'}
                </Button>

                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 600 }}>
                  Didn't receive the code?{' '}
                  <Typography 
                    component="span" 
                    sx={{ color: resendCooldown > 0 ? 'text.disabled' : '#2563EB', cursor: resendCooldown > 0 ? 'default' : 'pointer', fontWeight: 800 }}
                    onClick={() => handleResendOtp()}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </Typography>
                </Typography>
              </motion.div>
            ) : (
              <motion.div key="verify-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                    <SchoolIcon sx={{ color: '#22C55E', fontSize: 40 }} />
                  </motion.div>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#172A4D' }}>
                  Email Verified! 🎉
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Taking you to your dashboard...
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* ── Forgot Password modal ── */}
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />

      {/* ── Forced password change after temporary-password login ── */}
      <ChangePasswordModal
        open={changeOpen}
        userEmail={pendingUser?.email}
        onDone={() => {
          updateUser({ mustChangePassword: false });
          setChangeOpen(false);
          handleLoginSuccess(pendingUser);
        }}
        onLogout={async () => {
          setChangeOpen(false);
          setPendingUser(null);
          await logout();
        }}
      />
    </Box>
  );
}
