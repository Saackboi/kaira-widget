import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'KairaWidget',
      formats: ['iife'],
      fileName: () => 'kaira.js',
    },
    minify: 'terser',
    emptyOutDir: true,
  },
});
