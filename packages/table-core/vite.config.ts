import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: { index: 'src/index.ts' },
      formats: ['es'],
    },
    rolldownOptions: {
      // Consumers bundle the engine themselves, through one module graph with their framework adapter.
      external: [/^@tanstack\/table-core$/],
      output: {
        // Stable names, so stale chunks never pile up (see emptyOutDir below).
        chunkFileNames: '[name].js',
      },
    },
    // `tsc -p tsconfig.build.json` writes .d.ts files into dist/; keep them during `vite build --watch`.
    emptyOutDir: false,
  },
})
