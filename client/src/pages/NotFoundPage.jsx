import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', p: 4 }}>
      <Typography variant="h1" sx={{ fontFamily: '"Poppins",sans-serif', fontWeight: 800, fontSize: '6rem', color: 'primary.main', lineHeight: 1 }}>404</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Page Not Found</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>The page you're looking for doesn't exist or has been moved.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Go to Home</Button>
    </Box>
  );
}
