import { federation } from '@module-federation/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const port = 5175

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: 'uiVueDocs',
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
