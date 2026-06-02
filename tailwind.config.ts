import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        'neo-bg': '#FFFBF0',
        'neo-surface': '#FFF5D6',
        'neo-yellow': '#FFE135',
        'neo-orange': '#FF6B2B',
        'neo-pink': '#FF3CAC',
        'neo-blue': '#2B59FF',
        'neo-green': '#00C853',
        'neo-red': '#FF1744',
        'neo-black': '#0A0A0A',
        'neo-white': '#FFFFFF',
        'neo-muted': '#B0A090',
        // Keep legacy colors for non-redesigned pages
        bg: '#FAF7F2',
        surface: '#FFF9F0',
        primary: { DEFAULT: '#C8956C', dark: '#A67550' },
        accent: '#E8C49A',
        ink: '#2C1A0E',
        muted: '#7A6652',
        border: '#E8DDD0',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        neo: '4px 4px 0px #0A0A0A',
        'neo-hover': '6px 6px 0px #0A0A0A',
        'neo-active': '1px 1px 0px #0A0A0A',
        'neo-lg': '6px 6px 0px #0A0A0A',
        'neo-xl': '8px 8px 0px #0A0A0A',
        // Legacy
        soft: '0 2px 12px rgba(44,26,14,0.06)',
        card: '0 4px 20px rgba(44,26,14,0.10)',
        warm: '0 8px 30px rgba(200,149,108,0.15)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      screens: { xs: '480px' },
    },
  },
  plugins: [],
}

export default config
