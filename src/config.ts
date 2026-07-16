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