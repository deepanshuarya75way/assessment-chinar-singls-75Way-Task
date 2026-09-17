import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, IconButton, Box, Typography,
  TextField, Button, Alert, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { authAPI } from '../../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fresh state every time the modal opens
  useEffect(() => {
    if (open) {
      setEmail('');
      setFieldError('');
      setError('');
      setLoading(false);
      setSubmitted(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent duplicate submissions
    if (!email.trim()) { setFieldError('Please enter your email address.'); return; }
    if (!EMAIL_REGEX.test(email.trim())) { setFieldError('Please enter a valid email address.'); return; }

    setFieldError('');
    setError('');
    setLoading(true);
    try {
      // The backend never returns the new password — only a generic status.
      await authAPI.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { if (!loading) onClose(); }}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          bgcolor: 'background.paper',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        },
      }}
    >
      <DialogTitle sx={{ position: 'relative', pr: 6 }}>
        <IconButton
          aria-label="Close"
          onClick={() => { if (!loading) onClose(); }}
          disabled={loading}
          sx={{ position: 'absolute', right: 10, top: 10, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, pb: { xs: 3, sm: 4 }, mt: -3 }}>
        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 2 }} aria-live="polite">
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 40 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
              Check your email!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Password reset successfully. A temporary password has been sent to your registered email address.
            </Typography>
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>
              For your security, please change this temporary password after logging in.
            </Alert>
            <Button
              fullWidth
              variant="contained"
              onClick={onClose}
              sx={{ borderRadius: '16px', py: 1.4, fontWeight: 700, bgcolor: '#2563EB' }}
            >
              Back to Login
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,#1B2A4A,#2D6CDF)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                <LockOutlinedIcon sx={{ color: '#fff', fontSize: 26 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Forgot Password?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Enter your registered email address and we&apos;ll send you a temporary password.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} aria-live="polite">
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (fieldError) setFieldError(''); }}
                error={!!fieldError}
                helperText={fieldError}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                disabled={loading}
                required
              />
              <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                <Button
                  fullWidth
                  type="button"
                  onClick={() => { if (!loading) onClose(); }}
                  disabled={loading}
                  sx={{ borderRadius: '16px', py: 1.4, fontWeight: 700, color: 'text.secondary' }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ borderRadius: '16px', py: 1.4, fontWeight: 700, bgcolor: '#2563EB' }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
