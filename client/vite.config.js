import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser', // ✅ Now terser is installed
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
          animations: ['framer-motion'],
        }
      }
    }
  }
})
