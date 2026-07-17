import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Experience/formation logos are admin-entered URLs, host unknown ahead
    // of time.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // The Keystatic reader loads content/ from disk at runtime; make sure the
  // files ship with the serverless bundles on Vercel.
  outputFileTracingIncludes: {
    '/[locale]': ['./content/**/*'],
    '/[locale]/experiences': ['./content/**/*'],
    '/[locale]/blog': ['./content/**/*'],
    '/[locale]/blog/[slug]': ['./content/**/*'],
    '/[locale]/projects/[slug]': ['./content/**/*'],
    '/sitemap.xml': ['./content/**/*'],
  },
};
 
export default withNextIntl(nextConfig);