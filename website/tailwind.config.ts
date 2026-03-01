import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#1a1f2e',
        iron: '#3a3d44',
        'iron-light': '#5c5f66',
        cream: '#f4f1ec',
        'cream-dark': '#e8e3da',
        amber: '#d4a843',
        'amber-dark': '#b8902e',
        scarlet: '#c0392b',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica Neue', 'sans-serif'],
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        header: '69px',
      },
      height: {
        header: '69px',
      },
      minHeight: {
        header: '69px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config
