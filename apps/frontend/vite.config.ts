import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
      '/mailpit-api': {
        target: 'http://127.0.0.1:8025',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mailpit-api/, ''),
        secure: false,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'zustand'],
          pdf: ['jspdf', 'html2canvas'],
          qrcode: ['qrcode'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
