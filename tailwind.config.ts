import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF7F2',
        surface: '#FFF9F0',
        primary: {
          DEFAULT: '#C8956C',
          dark: '#A67550',
        },
        accent: '#E8C49A',
        ink: '#2C1A0E',
        muted: '#7A6652',
        border: '#E8DDD0',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(44,26,14,0.06)',
        card: '0 4px 20px rgba(44,26,14,0.10)',
        warm: '0 8px 30px rgba(200,149,108,0.15)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}

export default config
