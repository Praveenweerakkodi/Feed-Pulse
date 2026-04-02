import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-dark': '#0f172a',    // Slate-900
        'surface-card': '#1e293b',    // Slate-800
      },
    },
  },
  plugins: [],
};

export default config;
