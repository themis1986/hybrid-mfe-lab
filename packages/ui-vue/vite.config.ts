import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  build: {
    lib: {
      entry: { index: 'src/index.ts', icons: 'src/icons.ts' },
      formats: ['es'],
      // The CSS imported by src/index.ts becomes dist/styles.css (exported as '@repo/ui-vue/styles.css').
      cssFileName: 'styles',
    },
    rolldownOptions: {
      // Consumers bring their own Vue; the other runtime dependencies are resolved from this package's
      // dependencies.
      external: [
        /^vue$/,
        /^reka-ui($|\/)/,
        /^@lucide\/vue($|\/)/,
        /^class-variance-authority$/,
        /^clsx$/,
        /^tailwind-merge$/,
      ],
      output: {
        // Stable names, so stale chunks never pile up (see emptyOutDir below).
        chunkFileNames: '[name].js',
      },
    },
    // `vue-tsc -p tsconfig.build.json` writes .d.ts files into dist/; keep them during `vite build --watch`.
    emptyOutDir: false,
  },
})
