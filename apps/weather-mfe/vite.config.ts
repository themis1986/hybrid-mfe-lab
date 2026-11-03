import { federation } from '@module-federation/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite'

const port = 5177

export default defineConfig({
  devtools: { apply: 'serve' },
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools({ appendTo: /\/src\/mount\.ts$/ }),
    federation({
      name: 'weather',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/mount.ts',
      },
      // Nothing shared yet: this remote bundles its own Vue (see README).
      shared: {},
      dts: false,
    }),
  ],
  server: {
    port,
    strictPort: true,
    // Makes dev-server asset URLs absolute so they resolve when loaded by the shell.
    origin: `http://localhost:${port}`,
  },
  preview: { port, strictPort: true },
})
