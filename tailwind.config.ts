import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soft-pink': '#FFE5E5',
        'rose': '#FFB3BA',
        'lavender': '#E5D4FF',
        'peach': '#FFD9B3',
        'light-beige': '#FFF8F0',
        'pink-accent': '#FF9AA2',
        'lavender-accent': '#C7B2FF',
        'rose-dark': '#FF8A95',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

