import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // මෙතන 8081 වෙනුවට 8080 දාන්න
        changeOrigin: true,
      }
    }
  }
}) 
