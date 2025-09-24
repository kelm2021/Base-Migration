import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensures assets load correctly on Vercel or any custom domain
  base: './',
  build: {
    outDir: 'dist'
  }
})
