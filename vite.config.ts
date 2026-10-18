import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@emme/ui': path.resolve(__dirname, './packages/ui/src'),
        '@emme/api': path.resolve(__dirname, './packages/api/src'),
        '@emme/core': path.resolve(__dirname, './packages/core/src'),
        '@emme/business': path.resolve(__dirname, './packages/business/src'),
        '@emme/infrastructure': path.resolve(__dirname, './packages/infrastructure/src'),
        '@emme/auth': path.resolve(__dirname, './packages/auth/src'),
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        'motion',
        'motion/react',
        'date-fns',
        'clsx',
        'tailwind-merge',
        'zustand',
        'sonner',
        'canvas-confetti',
        'recharts',
      ],
      exclude: ['@google/genai'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
