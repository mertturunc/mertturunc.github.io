import { defineConfig } from 'vite';
import { resolve } from 'path';

// Single-file ESM runtime for embed zip packages (no /tools/ dependency at view time).
// Run after the main build; emptyOutDir:false keeps tool.js.
export default defineConfig({
  root: process.cwd(),
  build: {
    outDir: 'assets/js',
    emptyOutDir: false,
    minify: true,
    target: 'es2020',
    modulePreload: false,
    chunkSizeWarningLimit: 900,
    lib: {
      entry: resolve(process.cwd(), '_src/embed/entry.js'),
      name: 'AsciiEmbed',
      formats: ['es'],
      fileName: () => 'ascii-embed.standalone.js',
    },
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});
