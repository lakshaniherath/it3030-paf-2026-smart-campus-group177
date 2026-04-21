/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/features/resources/pages/**/*.{js,jsx,ts,tsx}", // Added path for resource pages
  ],
  theme: {
    extend: {
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
