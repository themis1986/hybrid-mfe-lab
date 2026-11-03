import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: { index: 'src/index.ts' },
      formats: ['es'],
    },
    rolldownOptions: {
      // Consumers bundle the engine themselves. Every highcharts path stays external, not only the bare
      // name: its modules (accessibility, no-data…) register on the core they import, so the app must
      // resolve core and modules through one module graph, or it would hold two engines.
      external: [/^highcharts($|\/)/],
      output: {
        // Stable names, so stale chunks never pile up (see emptyOutDir below).
        chunkFileNames: '[name].js',
      },
    },
    // `tsc -p tsconfig.build.json` writes .d.ts files into dist/; keep them during `vite build --watch`.
    emptyOutDir: false,
  },
})
