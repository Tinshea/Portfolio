// src/themes/index.ts
'use client';

import { PaletteMode, createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypeBackground {
    alternative: string;
  }
}

export const FONT_SANS =
  'var(--font-geist-sans), Inter, Roboto, Helvetica, Arial, sans-serif';
export const FONT_MONO =
  'var(--font-geist-mono), "SFMono-Regular", Consolas, "Liberation Mono", monospace';

// Brand accent: the site's existing cyan. The light value is darkened from the
// historical #348fab so accent text/CTAs pass WCAG AA (4.5:1) on light surfaces.
const ACCENT_LIGHT = '#257a95';
const ACCENT_DARK = '#5db8d1';

function getDesignTokens(mode: PaletteMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      ...(isDark
        ? {
            primary: { main: '#f4f4f5' },
            secondary: { main: ACCENT_DARK },
            background: {
              default: '#0e1114',
              paper: '#16191d',
              alternative: '#1b262c',
            },
            text: {
              primary: '#f4f4f5',
              secondary: '#a7b0b6',
            },
            divider: 'rgba(244, 244, 245, 0.12)',
          }
        : {
            primary: { main: '#1c2227' },
            secondary: { main: ACCENT_LIGHT },
            background: {
              default: '#fafafa',
              paper: '#f1f3f4',
              alternative: '#e2eaed',
            },
            text: {
              primary: '#1c2227',
              secondary: '#4b565e',
            },
            divider: 'rgba(28, 34, 39, 0.12)',
          }),
    },
    // Shape lock: cards/surfaces 12px, interactive elements pill (see MuiButton).
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: FONT_SANS,
      h1: { fontWeight: 700, letterSpacing: '0.02em' },
      h2: { fontWeight: 700, letterSpacing: '0.02em' },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
      caption: { fontFamily: FONT_MONO },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0e1114' : '#fafafa',
            // The sky lives on <body>, BELOW the fixed starfield canvas, so
            // stars stay visible; anything painted on sections would cover them.
            background: isDark
              ? `radial-gradient(900px circle at 75% 25%, #1b262c, transparent 65%) fixed, #0e1114`
              : `radial-gradient(1100px circle at 80% 18%, rgba(37, 122, 149, 0.18), transparent 62%) fixed,
                 radial-gradient(800px circle at 12% 85%, rgba(37, 122, 149, 0.10), transparent 60%) fixed,
                 linear-gradient(180deg, #eef6f9 0%, #fafafa 60%) fixed`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingLeft: 20,
            paddingRight: 20,
            '&:active': { transform: 'scale(0.98)' },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&:active': { transform: 'scale(0.95)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: isDark
              ? '0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.25)'
              : '0 1px 2px rgba(28, 34, 39, 0.08), 0 8px 24px rgba(28, 34, 39, 0.06)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: FONT_MONO,
            fontSize: '0.8rem',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { backgroundColor: 'transparent' },
        },
      },
    },
  });
}

export default getDesignTokens;
