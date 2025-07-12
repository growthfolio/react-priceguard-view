import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// Configuração ESM para resolver o aviso CJS
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'build',
    sourcemap: command === 'serve',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['recharts', 'lightweight-charts'],
          icons: ['@phosphor-icons/react'],
          utils: ['lodash', 'axios', 'jwt-decode']
        }
      }
    }
  },
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material'],
  },
}))
