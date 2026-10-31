import { federation } from '@module-federation/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const port = 5176

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'uiReactDocs',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/mount.tsx',
      },
      // Nothing shared yet: this remote bundles its own React (see README).
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
