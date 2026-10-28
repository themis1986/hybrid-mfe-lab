import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        register: 'src/register.ts',
      },
      formats: ['es'],
      // The CSS imported by src/index.ts becomes dist/styles.css (exported as '@repo/ui/styles.css').
      cssFileName: 'styles',
    },
    rolldownOptions: {
      // Consumers bring their own React; the other runtime dependencies are resolved from this
      // package's dependencies.
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@r2wc\//,
        /^@radix-ui\//,
        /^class-variance-authority$/,
        /^clsx$/,
        /^tailwind-merge$/,
      ],
      output: {
        // Stable names, so stale chunks never pile up (see emptyOutDir below).
        chunkFileNames: '[name].js',
      },
    },
    // `tsc -p tsconfig.build.json` writes .d.ts files into dist/; keep them during `vite build --watch`.
    emptyOutDir: false,
  },
})
