import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
  vite: {
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'games': ['./src/components/games/TornadoGame.jsx', './src/components/games/SpellTheWordGame.jsx'],
            'vendor': ['react', 'react-dom'],
          }
        }
      }
    }
  }
});
