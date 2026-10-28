import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        register: 'src/register.ts',
      },
      formats: ['es'],
    },
    rolldownOptions: {
      // Consumers bring their own React; r2wc is resolved from this package's dependencies.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@r2wc\//],
      output: {
        // Stable names, so stale chunks never pile up (see emptyOutDir below).
        chunkFileNames: '[name].js',
      },
    },
    // `tsc -p tsconfig.build.json` writes .d.ts files into dist/; keep them during `vite build --watch`.
    emptyOutDir: false,
  },
})
