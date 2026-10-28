import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const port = 5173

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // Build-time setting: where the todo remote's entry is served from.
  const todoRemoteUrl = env.VITE_TODO_REMOTE_URL || 'http://localhost:5174/remoteEntry.js'

  return {
    plugins: [
      federation({
        name: 'shell',
        remotes: {
          todo: { type: 'module', name: 'todo', entry: todoRemoteUrl },
        },
        // Nothing shared yet (see README).
        shared: {},
        dts: false,
      }),
      react(),
    ],
    server: { port, strictPort: true },
    preview: { port, strictPort: true },
  }
})
