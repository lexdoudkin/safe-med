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
        coral: {
          DEFAULT: '#FF6B5B',
          light: '#FFE8E5',
          dark: '#E84C3D',
        },
        teal: {
          DEFAULT: '#1A5F5A',
          light: '#E8F4F3',
          dark: '#0D3D3A',
        },
        cream: {
          DEFAULT: '#FFFBF7',
          dark: '#F5EDE6',
        },
        navy: '#1E2A3B',
        sage: {
          DEFAULT: '#7CB69D',
          light: '#E8F5EE',
        },
        gold: {
          DEFAULT: '#D4A853',
          light: '#FDF6E7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 91, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(255, 107, 91, 0)' },
        },
      },
    },
  },
  plugins: [],
}
