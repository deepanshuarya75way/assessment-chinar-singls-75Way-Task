import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function LogoutConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          p: 1,
          maxWidth: '400px'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: '"Poppins",sans-serif', fontWeight: 700, color: 'error.main' }}>
        <LogoutIcon /> Confirm Logout
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to log out?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          You will need to sign in again to access your account.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ fontWeight: 700 }}>
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}
