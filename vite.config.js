import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// Configuração ESM para resolver o aviso CJS
export default defineConfig(({ command, mode }) => {
  // Carrega as variáveis de ambiente com base no modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  
  // Adiciona debug para ver quais variáveis estão sendo carregadas
  console.log('Vite Mode:', mode);
  console.log('Skip Auth:', env.REACT_APP_SKIP_AUTH);
  
  return {
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
      // Expor todas as variáveis de ambiente com prefixo REACT_APP_ para a aplicação
      ...Object.keys(env).reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(env[key]);
        return acc;
      }, {}),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@mui/material'],
    },
  }
})
