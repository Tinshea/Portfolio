import {Pathnames, LocalePrefix} from 'next-intl/routing';

export const defaultLocale = 'fr';
export const locales = ['en', 'fr'] as const;

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/projects': {
    en: '/projects',
    fr: '/projets'
  }
};

export const localePrefix: LocalePrefix<typeof locales> = 'always';

// Per-locale resume file. The FR entry intentionally points to the EN file
// until a French PDF exists: drop it as public/assets/resume-fr.pdf and update
// the value below.
export const resumePaths: Record<(typeof locales)[number], string> = {
  en: '/assets/resume.pdf',
  fr: '/assets/resume.pdf',
};