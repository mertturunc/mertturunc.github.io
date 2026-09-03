import { defineConfig } from 'vite';
import { resolve } from 'path';

// Bundles the studio into tools/ascii-studio/assets/js/tool.js (+ lazy chunks).
// Loaders and gifenc are code-split so the first paint only pays for the shell +
// Three core; format-specific parsers download on first use.
// Run with cwd = tools/ascii-studio/.
export default defineConfig({
  root: process.cwd(),
  build: {
    outDir: 'assets/js',
    emptyOutDir: true,
    minify: true,
    target: 'es2020',
    modulePreload: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: resolve(process.cwd(), '_src/main.js'),
      output: {
        format: 'es',
        entryFileNames: 'tool.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          // Keep Three core cacheable; leave examples/jsm (addons) to dynamic chunks.
          const path = id.replace(/\\/g, '/');
          if (!path.includes('/node_modules/three/')) return;
          if (path.includes('/examples/jsm/') || path.includes('/addons/')) return;
          return 'three';
        },
      },
    },
  },
});
