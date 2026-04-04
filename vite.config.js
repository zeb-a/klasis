import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const PB_DEV_PROXY_TARGET =
  process.env.PB_DEV_PROXY_TARGET ||
  process.env.VITE_PB_DEV_PROXY_TARGET ||
  process.env.VITE_BACKEND_URL ||
  (process.env.BACKEND_PORT ? `http://127.0.0.1:${process.env.BACKEND_PORT}` : '') ||
  'http://127.0.0.1:8090';

/** Remove CSP meta only when Vite dev server serves index.html — meta CSP applies at parse time, so removing it in main.jsx is too late. */
function stripCspMetaInDev() {
  return {
    name: 'strip-csp-meta-in-dev',
    transformIndexHtml(html, ctx) {
      if (!ctx.server) return html;
      return html.replace(
        /<!-- Content Security Policy -->[\s\S]*?<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>/i,
        '<!-- CSP meta omitted in dev (Vite HMR / tooling may use eval). Production `vite build` still includes CSP from index.html. -->'
      );
    }
  };
}

export default defineConfig({
  // Web production should use absolute root paths so SW/manifest resolve correctly.
  // Keep optional relative base for Capacitor-style builds.
  base:
    process.env.BUILD_TARGET === 'capacitor' || process.env.CAPACITOR === 'true'
      ? './'
      : '/',
  plugins: [
    stripCspMetaInDev(),
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/**/*.webp', 'icons/**/*.png', 'icons/*.svg', 'favicon.ico', 'branded-loader.css'],
      manifest: {
        name: 'Klasiz.fun - Classroom Management',
        short_name: 'Klasiz',
        description: 'The ultimate classroom management platform for teachers and students',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-48.png',   sizes: '48x48',   type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-72.png',   sizes: '72x72',   type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-96.png',   sizes: '96x96',   type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-128.png',  sizes: '128x128', type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-144.png',  sizes: '144x144', type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-192.png',  sizes: '192x192', type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-256.png',  sizes: '256x256', type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-512.png',  sizes: '512x512', type: 'image/png',  purpose: 'any' },
          { src: '/icons/icon-48.webp',  sizes: '48x48',   type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-72.webp',  sizes: '72x72',   type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-96.webp',  sizes: '96x96',   type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-128.webp', sizes: '128x128', type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-144.webp', sizes: '144x144', type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-192.webp', sizes: '192x192', type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-256.webp', sizes: '256x256', type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-512.webp', sizes: '512x512', type: 'image/webp', purpose: 'any' },
          { src: '/icons/icon-192.png',  sizes: '192x192', type: 'image/png',  purpose: 'maskable' },
          { src: '/icons/icon-512.png',  sizes: '512x512', type: 'image/png',  purpose: 'maskable' }
        ],
        categories: ['education', 'productivity'],
        shortcuts: [
          {
            name: 'My Classes',
            short_name: 'Classes',
            description: 'Quick access to your classes',
            url: '/',
            icons: [{ src: '/icons/icon-96.webp', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        // Do not serve the SPA for PocketBase API routes. Without this, OAuth redirects to
        // /api/oauth2-redirect are answered with cached index.html, the realtime @oauth2
        // handshake never runs, and Google/Microsoft login appears to "bounce" to home.
        navigateFallbackDenylist: [/^\/api\//, /^\/_\//],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3,wav,glb,wasm}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        // Handle network errors gracefully
        runtimeCaching: [
          {
            // Never cache PocketBase API (including oauth2-redirect fetches from the recovery script).
            urlPattern: ({ url }) => url.pathname.startsWith('/api/') || url.pathname.startsWith('/_/'),
            handler: 'NetworkOnly',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 0,
                maxAgeSeconds: 0
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/twemoji\.maxcdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'twemoji-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        cleanupOutdatedCaches: true
      },
      // Keep SW off in dev; `public/manifest.webmanifest` is served so /manifest.webmanifest
      // is valid JSON (SPA fallback would otherwise return index.html and break parsing).
      devOptions: {
        enabled: false
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      pocketbase: resolve(__dirname, 'node_modules/pocketbase/dist/pocketbase.es.mjs')
    }
  },
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter(
          (dep) =>
            !dep.includes('phaser-') &&
            !dep.includes('pixi-vendor-') &&
            !dep.includes('docx-') &&
            !dep.includes('dicebear-vendor-') &&
            !dep.includes('vendor-pdfjs-dist-') &&
            !dep.includes('GameCenter-') &&
            !dep.includes('TornadoGame-') &&
            !dep.includes('FaceOffGame-') &&
            !dep.includes('MemoryMatchGame-') &&
            !dep.includes('QuizGame-') &&
            !dep.includes('MotoRaceGame-') &&
            !dep.includes('HorseRaceGame-') &&
            !dep.includes('SpellTheWordGame-') &&
            !dep.includes('LiveWorksheet-')
        )
    },
    // Ensure assets are properly referenced for Capacitor
    assetsDir: 'assets',
    sourcemap: false,
    // Minify for production builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        pure_funcs: ['console.log']
      }
    },
    chunkSizeWarningLimit: 1500,
    // Performance optimizations
    target: 'esnext',
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        // Ensure consistent chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Manual chunk splitting for better performance
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Phaser game engine (largest - separate it)
            if (id.includes('phaser')) {
              return 'phaser';
            }
            // Dicebear avatars (second largest)
            if (id.includes('@dicebear')) {
              return 'dicebear-vendor';
            }
            // PIXI.js graphics
            if (id.includes('@pixi') || id.includes('pixi.js')) {
              return 'pixi-vendor';
            }
            // LiveWorksheet (docx parsing)
            if (id.includes('docx') || id.includes('mammoth') || id.includes('jszip')) {
              return 'docx';
            }
            // React and core libraries
            // Keep this narrow; many other packages contain "react" in their name
            // (e.g. react-markdown) and would otherwise get dumped into react-vendor.
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'react-vendor';
            }
            // Chart libraries
            if (id.includes('chart.js') || id.includes('react-chartjs-2') || id.includes('highcharts')) {
              return 'chart-vendor';
            }
            // Lottie animations
            // Keep this narrow to avoid capturing unrelated packages containing "lottie".
            if (id.includes('/node_modules/lottie-web/') || id.includes('/node_modules/lottie-react/')) {
              return 'lottie-vendor';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            // Editor libraries
            if (id.includes('@tiptap')) {
              return 'editor-vendor';
            }
            // DOMPurify for sanitization
            if (id.includes('dompurify')) {
              return 'purify';
            }
            // PocketBase SDK
            if (id.includes('pocketbase')) {
              return 'pocketbase';
            }
            // Utility libraries
            if (id.includes('boring-avatars') || id.includes('qrcode')) {
              return 'utils-vendor';
            }
            // Workbox for PWA
            if (id.includes('workbox')) {
              return 'workbox';
            }
            // Webworker scripts
            if (id.includes('webworker')) {
              return 'webworker-vendor';
            }

            // Everything else: split remaining npm packages by package name
            // to prevent a single huge "vendor" chunk.
            const nodeModulesIndex = id.lastIndexOf('/node_modules/');
            if (nodeModulesIndex !== -1) {
              const afterNodeModules = id.slice(nodeModulesIndex + '/node_modules/'.length);
              const parts = afterNodeModules.split('/');
              const first = parts[0];

              // Markdown tooling can generate a few tiny "empty chunks".
              // Grouping these together reduces warning noise.
              if (first === 'zwitch' || first === 'micromark' || first.startsWith('micromark-')) {
                return 'micromark-vendor';
              }

              // Scoped packages: @scope/name => vendor-scope-name
              if (first?.startsWith('@') && parts[1]) {
                // Group dicebear models to avoid many empty chunks.
                if (first === '@dicebear') {
                  return 'dicebear-vendor';
                }
                return `vendor-${first.slice(1)}-${parts[1]}`;
              }
              return `vendor-${first}`;
            }

            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['all', '0v40fbtrif-5173.cnb.run', '0v40fbtrif-4002.cnb.run'],
    proxy: {
      '/api/api': {
        target: PB_DEV_PROXY_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/api/, '/api')
      },
      '/api': {
        target: PB_DEV_PROXY_TARGET,
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
});
