import { federation } from '@module-federation/vite'
import { networkOrigin, networkServer } from '@repo/config/vite-server.mjs'
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
    ...networkServer(port),
    // Makes dev-server asset URLs absolute so they resolve when loaded by the shell.
    origin: networkOrigin(port),
  },
  preview: networkServer(port),
})
