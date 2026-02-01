/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple Health palette
        health: {
          red: '#FF3B30',
          orange: '#FF9500',
          green: '#34C759',
          blue: '#007AFF',
          teal: '#5AC8FA',
          pink: '#FF2D55',
        },
        // Neutrals
        bg: {
          primary: '#FFFFFF',
          secondary: '#F2F2F7',
          tertiary: '#E5E5EA',
        },
        text: {
          primary: '#000000',
          secondary: '#3C3C43',
          tertiary: '#8E8E93',
        },
        separator: 'rgba(60, 60, 67, 0.12)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'SF Pro Display', 'sans-serif'],
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
