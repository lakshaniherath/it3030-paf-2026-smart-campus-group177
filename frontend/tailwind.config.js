/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Member 1 design tokens
        primary: { DEFAULT: '#2563EB', hover: '#1D4ED8' },
        accent: '#7C3AED',
        surface: '#FFFFFF',
        background: '#F8FAFC',
        bordercolor: '#E2E8F0',
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        status: {
          success: '#16A34A',
          successBg: '#F0FDF4',
          danger: '#DC2626',
          dangerBg: '#FEF2F2',
          warning: '#D97706',
          warningBg: '#FFFBEB',
        },
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
}