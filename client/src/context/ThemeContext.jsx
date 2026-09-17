import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme/theme';

const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });

export const useColorMode = () => useContext(ColorModeContext);

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('tc_theme') || 'light');

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () =>
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('tc_theme', next);
        return next;
      }),
  }), [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
