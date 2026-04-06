import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ec',
          100: '#f9f0cc',
          200: '#f2df94',
          300: '#eac855',
          400: '#e4b429',
          500: '#C9963A',  // primary gold
          600: '#b8832e',
          700: '#946424',
          800: '#7a5020',
          900: '#5c3c18',
        },
        obsidian: {
          DEFAULT: '#080808',
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#c8c8c8',
          300: '#a0a0a0',
          400: '#6b6b6b',
          500: '#444444',
          600: '#2a2a2a',
          700: '#1a1a1a',
          800: '#111111',
          900: '#080808',
        },
        champagne: '#F5E6C8',
        ivory: '#FAF6EF',
      },
      fontFamily: {
        serif:  ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:   ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display:['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        '8xl':  ['6rem',   { lineHeight: '1' }],
        '9xl':  ['8rem',   { lineHeight: '1' }],
        '10xl': ['10rem',  { lineHeight: '1' }],
      },
      letterSpacing: {
        'ultra': '0.25em',
        'widest': '0.3em',
      },
      backgroundImage: {
        'gold-gradient':     'linear-gradient(135deg, #C9963A 0%, #F5E6C8 50%, #C9963A 100%)',
        'dark-gradient':     'linear-gradient(180deg, #080808 0%, #111111 100%)',
        'hero-overlay':      'linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.95) 100%)',
        'card-overlay':      'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.4) 60%, transparent 100%)',
      },
      boxShadow: {
        'gold':      '0 0 30px rgba(201,150,58,0.3)',
        'gold-lg':   '0 0 60px rgba(201,150,58,0.2)',
        'dark':      '0 25px 60px rgba(0,0,0,0.8)',
        'card':      '0 8px 32px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-up':      'fadeUp 0.8s ease forwards',
        'fade-in':      'fadeIn 1s ease forwards',
        'shimmer':      'shimmer 2.5s infinite',
        'float':        'float 6s ease-in-out infinite',
        'pulse-gold':   'pulseGold 2s ease-in-out infinite',
        'slide-left':   'slideLeft 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,150,58,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(201,150,58,0.6)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
