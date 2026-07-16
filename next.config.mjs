import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The Keystatic reader loads content/ from disk at runtime; make sure the
    // files ship with the serverless bundles on Vercel.
    outputFileTracingIncludes: {
      '/[locale]': ['./content/**/*'],
      '/[locale]/projects/[slug]': ['./content/**/*'],
      '/sitemap.xml': ['./content/**/*'],
    },
  },
};
 
export default withNextIntl(nextConfig);