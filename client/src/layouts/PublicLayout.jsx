import { Box } from '@mui/material';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicNavbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <PublicFooter />
    </Box>
  );
}
