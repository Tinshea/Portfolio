import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/experiences': '/experiences',
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
  }
});

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
