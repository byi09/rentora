/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#1A56FF',
        pastelPeach: '#FDEBDD',
        heroOverlay: 'rgba(0,0,0,0.35)',
      },
      spacing: {
        22: '5.5rem',
      },
      fontSize: {
        '7.5xl': '4.75rem',
      },
      maxWidth: {
        screenWide: '72rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 