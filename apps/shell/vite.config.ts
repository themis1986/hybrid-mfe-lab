import { federation } from '@module-federation/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const port = 5173

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // Build-time settings: where each remote's entry is served from.
  const todoRemoteUrl = env.VITE_TODO_REMOTE_URL || 'http://localhost:5174/remoteEntry.js'
  const uiVueDocsRemoteUrl = env.VITE_UI_VUE_DOCS_REMOTE_URL || 'http://localhost:5175/remoteEntry.js'
  const uiReactDocsRemoteUrl = env.VITE_UI_REACT_DOCS_REMOTE_URL || 'http://localhost:5176/remoteEntry.js'

  return {
    plugins: [
      federation({
        name: 'shell',
        remotes: {
          todo: { type: 'module', name: 'todo', entry: todoRemoteUrl },
          uiVueDocs: { type: 'module', name: 'uiVueDocs', entry: uiVueDocsRemoteUrl },
          uiReactDocs: { type: 'module', name: 'uiReactDocs', entry: uiReactDocsRemoteUrl },
        },
        // Nothing shared yet (see README).
        shared: {},
        dts: false,
      }),
      react(),
      tailwindcss(),
    ],
    server: { port, strictPort: true },
    preview: { port, strictPort: true },
  }
})
