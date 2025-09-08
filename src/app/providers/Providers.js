'use client';

import React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../../utils/createEmotionCache';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

export default function Providers({ children }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    </CacheProvider>
  );
}
