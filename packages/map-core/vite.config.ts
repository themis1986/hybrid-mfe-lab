import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: { index: 'src/index.ts' },
      formats: ['es'],
    },
    rolldownOptions: {
      // Consumers bundle the engine themselves. Exact match: 'mapbox-gl/dist/mapbox-gl.css?inline' must
      // stay in, inlined as a string (see src/styles.ts).
      external: [/^mapbox-gl$/],
      output: {
        // Stable names, so stale chunks never pile up (see emptyOutDir below).
        chunkFileNames: '[name].js',
      },
    },
    // `tsc -p tsconfig.build.json` writes .d.ts files into dist/; keep them during `vite build --watch`.
    emptyOutDir: false,
  },
})
