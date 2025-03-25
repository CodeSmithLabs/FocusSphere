import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'focussphere-purple-light': '#9B4CDA',
        'focussphere-purple': '#7D3CBD',
        'focussphere-purple-dark': '#4B2380',
        'focussphere-purple-darker': '#2A1A4B',
        'focussphere-purple-darkest': '#1A0F2E',
        'focussphere-blue-light': '#4C9BDA',
        'focussphere-blue': '#3C7DBD',
        'focussphere-blue-dark': '#1A4B80',
        'focussphere-blue-darker': '#0F2E4B',
        'focussphere-blue-darkest': '#091A2E'
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-inter)']
      },
      animation: {
        fadeIn: 'fadeIn 700ms ease-in-out'
      },
      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      })
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
};

export default config;
