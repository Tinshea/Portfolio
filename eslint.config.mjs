import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  {
    rules: {
      // Theme/mount state is intentionally read from localStorage in effects
      // (SSR-safe hydration pattern); the new react-hooks v6 rule flags it.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default config;
