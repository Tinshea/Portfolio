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
// Display serif (headings only): the "épique intemporel" register. Body copy
// stays on Geist for legibility.
export const FONT_SERIF =
  'var(--font-playfair), "Playfair Display", Georgia, "Times New Roman", serif';

// One accent, locked page-wide: a deep crimson (the Persona 5 nod), used for
// hovers, focus and thin active lines only. The other two Persona hues exist
// solely as barely-there background tints (see MuiCssBaseline below): indigo
// night in dark mode (P3), a whisper of gold in light mode (P4).
const ACCENT_LIGHT = '#A3122E'; // 7:1 on the ivory background
const ACCENT_DARK = '#E24B60'; // 4.8:1 on the night background

const INK = '#17171A'; // near-black, slightly cool (never pure #000)
const BONE = '#F2F1EC'; // off-white (never pure #fff)
const IVORY = '#F4F4F2'; // light background: stone paper, not warm beige
const NIGHT = '#0B0E16'; // dark background: blue-leaning deep night

// Shape system (locked): every surface and rectangular control is sharp
// (radius 0, the Persona cut); the only documented exception is circular
// icon buttons, whose hover halo must stay round.
function getDesignTokens(mode: PaletteMode) {
  const isDark = mode === 'dark';
  const accent = isDark ? ACCENT_DARK : ACCENT_LIGHT;
  // JoJo editorial: shadows are hard-edged offsets, never blurred. Tinted to
  // the page, strong enough to read as intentional print offset.
  const hardShadow = isDark ? '6px 6px 0 rgba(0, 0, 0, 0.55)' : '6px 6px 0 rgba(23, 23, 26, 0.16)';

  return createTheme({
    palette: {
      mode,
      ...(isDark
        ? {
            primary: { main: BONE },
            secondary: { main: ACCENT_DARK },
            background: {
              default: NIGHT,
              paper: '#121623',
              alternative: '#161B29',
            },
            text: {
              primary: BONE,
              secondary: '#9FA3B0',
            },
            divider: 'rgba(242, 241, 236, 0.14)',
          }
        : {
            primary: { main: INK },
            secondary: { main: ACCENT_LIGHT },
            background: {
              default: IVORY,
              paper: '#EDEDEA',
              alternative: '#E8E8E4',
            },
            text: {
              primary: INK,
              secondary: '#5A5A60',
            },
            divider: 'rgba(23, 23, 26, 0.14)',
          }),
    },
    shape: { borderRadius: 0 },
    typography: {
      fontFamily: FONT_SANS,
      // Headings carry the whole identity: high-contrast serif, tight sizes
      // are set per-component. Uppercase + wide tracking (already applied in
      // components) turns Playfair into an engraved-inscription register.
      h1: { fontFamily: FONT_SERIF, fontWeight: 700, letterSpacing: '0.02em' },
      h2: { fontFamily: FONT_SERIF, fontWeight: 600, letterSpacing: '0.02em' },
      h3: { fontFamily: FONT_SERIF, fontWeight: 600 },
      h4: { fontFamily: FONT_SERIF, fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
      caption: { fontFamily: FONT_MONO },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? NIGHT : IVORY,
            // The sky lives on <body>, BELOW the fixed starfield canvas, so
            // stars stay visible. Radial washes only (the spiral nod): deep
            // indigo night in dark mode, a faint ink + gold breath in light.
            background: isDark
              ? `repeating-linear-gradient(0deg, rgba(242, 241, 236, 0.014) 0px, rgba(242, 241, 236, 0.014) 1px, transparent 1px, transparent 3px) fixed,
                 conic-gradient(from 210deg at 78% 18%, transparent 0deg, rgba(26, 33, 64, 0.5) 70deg, transparent 160deg) fixed,
                 radial-gradient(1000px circle at 78% 18%, #161C33, transparent 62%) fixed,
                 radial-gradient(700px circle at 12% 92%, rgba(226, 75, 96, 0.05), transparent 55%) fixed, ${NIGHT}`
              : `radial-gradient(1000px circle at 80% 16%, rgba(23, 23, 26, 0.05), transparent 60%) fixed,
                 radial-gradient(900px circle at 10% 88%, rgba(176, 137, 32, 0.05), transparent 55%) fixed, ${IVORY}`,
          },
          // Keyboard focus is part of the accent system, not an afterthought.
          '*:focus-visible': {
            outline: `2px solid ${accent}`,
            outlineOffset: '2px',
          },
          // High-contrast selection: the page answers in accent when touched.
          '::selection': {
            backgroundColor: accent,
            color: isDark ? NIGHT : BONE,
          },
          html: {
            scrollbarWidth: 'thin',
            scrollbarColor: `${isDark ? 'rgba(242, 241, 236, 0.25)' : 'rgba(23, 23, 26, 0.3)'} transparent`,
          },
          // Shared entrance: pure CSS (runs even without JS, so content can
          // never get stuck hidden the way the old JS reveals did). Consumers
          // gate it behind prefers-reduced-motion themselves.
          '@keyframes riseIn': {
            from: { opacity: 0, transform: 'translateY(28px)' },
            to: { opacity: 1, transform: 'none' },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            paddingLeft: 22,
            paddingRight: 22,
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, background-color 0.25s',
            // Ascending hover (the Gurren nod): interactive elements lift.
            '&:hover': { transform: 'translateY(-2px)' },
            '&:active': { transform: 'translateY(0) scale(0.98)' },
          },
          // Persona cut: primary actions lose their top-right corner.
          contained: {
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none', transform: 'translateY(-2px)' },
          },
          outlined: {
            borderWidth: 1,
            '&:hover': {
              borderColor: accent,
              boxShadow: isDark
                ? '4px 4px 0 rgba(226, 75, 96, 0.28)'
                : '4px 4px 0 rgba(163, 18, 46, 0.22)',
            },
          },
          // Persona menu highlight: nav/text links invert into a slanted
          // accent parallelogram on hover.
          text: {
            '&:hover': {
              backgroundColor: accent,
              color: isDark ? NIGHT : BONE,
              clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s',
            '&:hover': { transform: 'translateY(-2px)', color: accent },
            '&:active': { transform: 'scale(0.95)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${isDark ? 'rgba(242, 241, 236, 0.14)' : 'rgba(23, 23, 26, 0.14)'}`,
            // The offset-print shadow is present at rest and grows on hover;
            // the slight counter-rotation gives the lift a kinetic energy.
            boxShadow: isDark ? '3px 3px 0 rgba(0, 0, 0, 0.4)' : '3px 3px 0 rgba(23, 23, 26, 0.1)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s',
            '&:hover': {
              transform: 'translateY(-5px) rotate(-0.4deg)',
              borderColor: accent,
              boxShadow: hardShadow,
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          // Engraved-plate rule: a fine double hairline instead of a single line.
          root: {
            border: 'none',
            height: 3,
            borderTop: `1px solid ${isDark ? 'rgba(242, 241, 236, 0.14)' : 'rgba(23, 23, 26, 0.14)'}`,
            borderBottom: `1px solid ${isDark ? 'rgba(242, 241, 236, 0.14)' : 'rgba(23, 23, 26, 0.14)'}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiChip: {
        styleOverrides: {
          // The Persona slant: the tag container leans, the label stays
          // upright and readable.
          root: {
            fontFamily: FONT_MONO,
            fontSize: '0.8rem',
            borderRadius: 0,
            transform: 'skewX(-6deg)',
            transition: 'border-color 0.2s, color 0.2s, transform 0.2s',
            '&:hover': { borderColor: accent, transform: 'skewX(-6deg) translateY(-1px)' },
          },
          label: {
            transform: 'skewX(6deg)',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            border: `1px solid ${isDark ? 'rgba(242, 241, 236, 0.14)' : 'rgba(23, 23, 26, 0.14)'}`,
            boxShadow: hardShadow,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { backgroundColor: 'transparent' },
          bar: { backgroundColor: accent },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 0 },
        },
      },
    },
  });
}

export default getDesignTokens;
