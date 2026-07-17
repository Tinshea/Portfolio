'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getDesignTokens from '../themes'; // Assurez-vous que le chemin est correct
import { NextIntlClientProvider } from 'next-intl';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import React from 'react';
import { ModeProvider, useMode } from '@/contexts/ModeProvider';


// Resolved server-side (filesystem check) and exposed to client components.
const ResumeHrefContext = React.createContext<string>('/assets/resume.pdf');

export function useResumeHref() {
  return React.useContext(ResumeHrefContext);
}

export default function Providers({ children, locale, messages, resumeHref = '/assets/resume.pdf' }: { readonly children: React.ReactNode; readonly locale: string; readonly messages: Record<string, any>; readonly resumeHref?: string }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppRouterCacheProvider>
        <ResumeHrefContext.Provider value={resumeHref}>
          <ModeProvider>
            <InnerProviders>{children}</InnerProviders>
          </ModeProvider>
        </ResumeHrefContext.Provider>
      </AppRouterCacheProvider>
    </NextIntlClientProvider>
  );
}

function InnerProviders({ children }: { readonly children: React.ReactNode }) {
  const { mode } = useMode();
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      {/* Themes the <body> background/text so transparent sections (hero)
          follow light/dark mode. */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
