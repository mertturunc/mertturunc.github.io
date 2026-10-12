import { defineConfig } from 'vite';
import { resolve } from 'path';

// Bundles studio (tool.js) + live embed runtime (ascii-embed.js).
// Loaders and gifenc are code-split; Three core is a shared chunk.
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
      input: {
        tool: resolve(process.cwd(), '_src/main.js'),
        'ascii-embed': resolve(process.cwd(), '_src/embed/entry.js'),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          const path = id.replace(/\\/g, '/');
          if (!path.includes('/node_modules/three/')) return;
          if (path.includes('/examples/jsm/') || path.includes('/addons/')) return;
          return 'three';
        },
      },
    },
  },
});
