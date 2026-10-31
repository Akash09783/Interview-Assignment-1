import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stem: {
          bg: '#EDE8E1',
          cream: '#F7F5F0',
          sand: '#E3DDD4',
          dark: '#141414',
          muted: '#6B6864',
          rose: '#D08C81',
          roseDark: '#B87267',
          border: 'rgba(20, 20, 20, 0.08)',
        },
      },
      fontFamily: {
        degular: ['"Degular Demo"', 'system-ui', 'sans-serif'],
        metropolis: ['Metropolis', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.14em',
      },
    },
  },
  plugins: [],
};

export default config;
