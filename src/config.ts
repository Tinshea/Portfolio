import {Pathnames, LocalePrefix} from 'next-intl/routing';

export const defaultLocale = 'fr';
export const locales = ['en', 'fr'] as const;

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/projects': {
    en: '/projects',
    fr: '/projets'
  },
  '/projects/[slug]': {
    en: '/projects/[slug]',
    fr: '/projets/[slug]'
  },
  '/blog': '/blog',
  '/blog/[slug]': '/blog/[slug]'
};

export const localePrefix: LocalePrefix<typeof locales> = 'always';