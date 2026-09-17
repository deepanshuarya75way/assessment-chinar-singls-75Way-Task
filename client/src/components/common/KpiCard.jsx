import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Skeleton, useTheme } from '@mui/material';
import { motion, useSpring, useTransform } from 'framer-motion';

function AnimatedCounter({ value }) {
  const [hasMounted, setHasMounted] = useState(false);
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
  
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  useEffect(() => {
    setHasMounted(true);
    if (!isNaN(numericValue)) {
      springValue.set(numericValue);
    }
  }, [numericValue, springValue]);

  const display = useTransform(springValue, (current) => Math.floor(current));

  if (!hasMounted || isNaN(numericValue)) return <>{value}</>;
  return <motion.span>{display}</motion.span>;
}

export default function KpiCard({ icon: Icon, label, value, color = '#2563EB', loading = false, trend }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={{ height: '100%' }}>
      <Card sx={{ 
        height: '100%', 
        borderRadius: '24px', 
        bgcolor: isDark ? '#142B52' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(37,99,235,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft background glow */}
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', bgcolor: color, opacity: isDark ? 0.1 : 0.05, filter: 'blur(20px)', zIndex: 0 }} />
        
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem', fontFamily: '"Nunito", sans-serif' }}>
                {label}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={40} />
              ) : (
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, color: isDark ? '#fff' : '#172A4D', fontFamily: '"Fredoka", "Nunito", sans-serif' }}>
                  <AnimatedCounter value={value} />
                </Typography>
              )}
              {trend && (
                <Typography variant="caption" sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  {trend > 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`} vs last week
                </Typography>
              )}
            </Box>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px',
              bgcolor: isDark ? `${color}30` : `${color}15`,
              color: color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isDark ? `0 4px 15px ${color}30` : `0 4px 15px ${color}20`,
            }}>
              {Icon && <Icon sx={{ color, fontSize: 24 }} />}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
