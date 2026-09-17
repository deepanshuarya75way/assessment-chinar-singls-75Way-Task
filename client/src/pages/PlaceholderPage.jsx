import { Box, Typography, Paper } from '@mui/material';

// Generic placeholder for pages still being built
export default function PlaceholderPage({ title = 'Coming Soon', description = 'This section is under development.' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, maxWidth: 480 }}>
        <Typography variant="h1" sx={{ fontSize: '3rem', mb: 1 }}>🚧</Typography>
        <Typography variant="h5" sx={{ fontFamily: '"Poppins",sans-serif', fontWeight: 700, mb: 1 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{description}</Typography>
      </Paper>
    </Box>
  );
}
