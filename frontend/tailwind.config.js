/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/features/resources/pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0, 0) scale(1)",
          },
        },
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        secondary: '#0F172A',
        accent: '#14B8A6',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        bordercolor: '#E2E8F0',
        text: {
          primary: '#0F172A',
          secondary: '#475569',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#38BDF8',
          successBg: '#ECFDF5',
          warningBg: '#FEF3C7',
          dangerBg: '#FEF2F2',
          infoBg: '#E0F2FE',
          inactiveBg: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
