import { createTheme } from '@mui/material/styles';

const sharedTypography = {
  fontFamily: '"Inter", "Roboto", sans-serif',
  h1: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 700 },
  h2: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 700 },
  h3: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
  h4: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
  h5: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
  h6: { fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 },
  button: { fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
};

const sharedShape = { borderRadius: 8 };

const sharedComponents = (mode) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 20px',
        fontSize: '0.9rem',
        boxShadow: 'none',
        fontWeight: 600,
        '&:hover': { boxShadow: 'none' },
      },
      containedPrimary: {
        background: mode === 'light'
          ? '#2563EB'
          : '#3B82F6',
        '&:hover': {
          background: mode === 'light'
            ? '#1D4ED8'
            : '#2563EB',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: mode === 'light'
          ? '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${mode === 'light' ? '#E2E8F0' : '#1E293B'}`,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 12,
      },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'small' },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { fontWeight: 600, fontSize: '0.75rem', borderRadius: 6 },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: { fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${mode === 'light' ? '#e8eaf0' : 'rgba(255,255,255,0.06)'}`,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: mode === 'light'
          ? '0 2px 12px rgba(0,0,0,0.05)'
          : '0 2px 12px rgba(0,0,0,0.3)',
      },
    },
  },
});

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#2563EB', light: '#60A5FA', contrastText: '#ffffff' },
      secondary: { main: '#0F172A', contrastText: '#ffffff' },
      success: { main: '#10B981', light: '#D1FAE5' },
      error: { main: '#EF4444' },
      warning: { main: '#F59E0B' },
      info: { main: '#3B82F6' },
      accent: {
        teal: '#14B8A6',
        purple: '#8B5CF6',
        orange: '#F97316',
        pink: '#EC4899',
        sky: '#0EA5E9',
      },
      ...(mode === 'light'
        ? {
            background: { default: '#F8FAFC', paper: '#FFFFFF' },
            text: { primary: '#0F172A', secondary: '#64748B' },
            divider: '#E2E8F0',
          }
        : {
            background: { default: '#020617', paper: '#0F172A', defaultSecondary: '#1E293B', elevated: '#1E293B' },
            text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
            divider: '#1E293B',
            primary: { main: '#3B82F6', light: '#60A5FA', contrastText: '#F8FAFC' },
            secondary: { main: '#475569', light: '#64748B', contrastText: '#F8FAFC' },
            success: { main: '#10B981' },
          }),
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: sharedComponents(mode),
  });

