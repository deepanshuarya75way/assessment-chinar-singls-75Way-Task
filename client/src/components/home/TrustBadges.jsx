import { Box, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';

const BADGES = [
  { label: 'Verified Tutors', icon: VerifiedIcon, color: '#1FAA59' },
  { label: 'Background Checked', icon: SecurityIcon, color: '#2D6CDF' },
  { label: '24hr Matching', icon: SpeedIcon, color: '#F2B705' },
  { label: '4.8+ Average Rating', icon: StarIcon, color: '#F2B705' },
];

export default function TrustBadges() {
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: { xs: 1, sm: 1.5 },
      alignItems: 'center',
    }}>
      {BADGES.map(({ label, icon: Icon, color }, index) => (
        <Box
          key={label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            px: 1.8,
            py: 0.8,
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            transition: 'all 0.25s ease',
            animation: `fadeIn 0.5s ease-out ${0.2 + index * 0.1}s both`,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.14)',
              transform: 'translateY(-2px)',
              borderColor: 'rgba(242, 183, 5, 0.4)',
            },
          }}
        >
          <Icon sx={{ fontSize: 16, color }} />
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.92)', fontWeight: 600, letterSpacing: 0.2, fontSize: '0.8rem' }}>
            ✓ {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
