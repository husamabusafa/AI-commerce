/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'IBM Plex Sans Arabic',
          'Cairo',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol'
        ],
      },
      colors: {
        // Refined luxury palette
        luxury: {
          dark: '#0F1115',
          light: '#F8F8F6',
          text: {
            light: '#0B0D0F',
            dark: '#EDEDED',
          },
          gold: {
            primary: '#C8A96A',
            secondary: '#D4AF37',
          },
          gray: {
            50: '#F8F8F6',
            100: '#F0F0ED',
            200: '#E5E5E2',
            300: '#D1D1CE',
            400: '#A8A8A5',
            500: '#7A7A77',
            600: '#5C5C59',
            700: '#3E3E3B',
            800: '#2A2A27',
            900: '#0F1115',
          }
        }
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.04)',
        glow: '0 8px 30px rgba(200, 169, 106, 0.15)',
        luxury: '0 8px 32px rgba(15, 17, 21, 0.08)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
