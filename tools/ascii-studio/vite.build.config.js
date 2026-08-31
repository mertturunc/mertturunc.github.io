import { defineConfig } from 'vite';
import { resolve } from 'path';

// Bundles the studio's JS (Three.js + gifenc + app) into a single static ES
// module for the Jekyll site: tools/ascii-studio/assets/js/tool.js
// Run with cwd = tools/ascii-studio/.
export default defineConfig({
  root: process.cwd(),
  build: {
    outDir: 'assets/js',
    emptyOutDir: true,
    lib: {
      entry: resolve(process.cwd(), '_src/main.js'),
      formats: ['es'],
      fileName: () => 'tool.js',
    },
    target: 'esnext',
    minify: false,
  },
});
