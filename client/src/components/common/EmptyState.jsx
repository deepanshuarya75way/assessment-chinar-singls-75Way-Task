import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export default function EmptyState({ title = 'No Data', message = 'Nothing to show here yet.', actionLabel, onAction }) {
  return (
    <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
      <InboxIcon sx={{ fontSize: 56, opacity: 0.3, mb: 2 }} />
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>{message}</Typography>
      {actionLabel && <Button variant="contained" onClick={onAction}>{actionLabel}</Button>}
    </Box>
  );
}
