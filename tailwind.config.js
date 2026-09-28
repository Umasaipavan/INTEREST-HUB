/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        fintech: {
          50: '#F5F7FF',
          100: '#EBF0FE',
          200: '#D6E0FD',
          300: '#B4C6FB',
          400: '#839EF7',
          500: '#5370EF',
          600: '#3B4EE1',
          700: '#2E39C4',
          800: '#1A237E',
          900: '#0F174A',
          950: '#090D2E',
        },
        emerald: {
          450: '#10B981',
          550: '#059669',
        },
        surface: {
          light: '#F8FAFC',
          dark: '#0B0F19',
          cardLight: '#FFFFFF',
          cardDark: '#111827',
          borderLight: '#E2E8F0',
          borderDark: '#1F2937',
        }
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(15, 23, 74, 0.05), 0 2px 6px -1px rgba(15, 23, 74, 0.03)',
        'fintech-lg': '0 12px 32px -4px rgba(15, 23, 74, 0.08), 0 4px 12px -2px rgba(15, 23, 74, 0.04)',
        'fintech-glow': '0 0 24px -2px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
