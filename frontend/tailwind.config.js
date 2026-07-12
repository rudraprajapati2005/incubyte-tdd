/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: '#17181C',
          50: '#F4F4F5',
          100: '#E4E4E6',
          200: '#B4B5BB',
          300: '#8A8B93',
          400: '#54555E',
          500: '#2C2D33',
          600: '#232429',
          700: '#1D1E23',
          800: '#17181C',
          900: '#0F1013',
        },
        concrete: '#F3F1EA',
        chrome: '#C9CDD3',
        signal: {
          DEFAULT: '#FFB020',
          dim: '#B87E16',
        },
        racing: '#E0483E',
        lot: '#2E5C4E',
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'diagonal-stripes': 'repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 12px)',
      },
    },
  },
  plugins: [],
}
