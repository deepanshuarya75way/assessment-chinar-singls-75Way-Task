import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, Box, Typography,
  TextField, Button, Alert, CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { authAPI } from '../../services/api';

// Same policy as the signup form (LoginPage): 6+ chars with upper, lower, digit
const isValidNewPassword = (p) => typeof p === 'string' && p.length >= 6 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p);

const PasswordField = ({ label, value, onChange, show, onToggle, autoComplete, autoFocus, disabled, error, helperText }) => (
  <TextField
    fullWidth
    label={label}
    type={show ? 'text' : 'password'}
    value={value}
    onChange={onChange}
    autoComplete={autoComplete}
    autoFocus={autoFocus}
    disabled={disabled}
    required
    error={!!error}
    helperText={helperText || ''}
    slotProps={{
      input: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              type="button"
              onClick={onToggle}
              edge="end"
              disabled={disabled}
              aria-label={show ? 'Hide password' : 'Show password'}
              sx={{ color: 'text.secondary' }}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      },
    }}
  />
);

export default function ChangePasswordModal({ open, userEmail, onDone, onLogout }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrent(''); setNext(''); setConfirm('');
      setShow({ current: false, next: false, confirm: false });
      setError(''); setLoading(false); setSuccess(false);
    }
  }, [open]);

  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent duplicate submissions
    if (!current) { setError('Please enter your current password.'); return; }
    if (!next) { setError('Please enter a new password.'); return; }
    if (next.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!isValidNewPassword(next)) { setError('Password must contain uppercase, lowercase, and a number.'); return; }
    if (next !== confirm) { setError('New passwords do not match.'); return; }
    if (next === current) { setError('New password must be different from the current password.'); return; }

    setError(''); setLoading(true);
    try {
      await authAPI.updatePassword(current, next);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(e, reason) => { if (reason === 'backdropClick' || reason === 'escapeKeyDown') return; }}
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
      <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 } }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }} aria-live="polite">
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 40 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
              Password Changed! 🎉
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Your new password is ready to use. Taking you to your dashboard...
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={onDone}
              sx={{ borderRadius: '16px', py: 1.4, fontWeight: 700, bgcolor: '#2563EB' }}
            >
              Continue
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,#1B2A4A,#2D6CDF)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                <LockOutlinedIcon sx={{ color: '#fff', fontSize: 26 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Change Your Password
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                For your security, you are using a temporary password. Please create a new password before continuing.
              </Typography>
              {userEmail && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', fontWeight: 600 }}>
                  {userEmail}
                </Typography>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} aria-live="polite">
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <PasswordField
                label="Current Password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                show={show.current}
                onToggle={() => toggle('current')}
                autoComplete="current-password"
                disabled={loading}
              />
              <PasswordField
                label="New Password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                show={show.next}
                onToggle={() => toggle('next')}
                autoComplete="new-password"
                disabled={loading}
              />
              <PasswordField
                label="Confirm New Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                show={show.confirm}
                onToggle={() => toggle('confirm')}
                autoComplete="new-password"
                disabled={loading}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ borderRadius: '16px', py: 1.4, fontWeight: 700, mt: 1, bgcolor: '#2563EB' }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
              <Button
                fullWidth
                type="button"
                onClick={onLogout}
                disabled={loading}
                sx={{ borderRadius: '16px', fontWeight: 700, color: 'text.secondary' }}
              >
                Log out instead
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
