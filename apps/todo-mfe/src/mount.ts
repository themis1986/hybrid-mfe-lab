import '@repo/ui/register'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './HomePage.vue'

export interface MountProps {
  /** URL prefix the host serves this app under, e.g. "/todo-app" ("/" when standalone). */
  basePath: string
}

/** Federation contract: render the app into `el`; the returned function tears it down. */
export function mount(el: HTMLElement, props: MountProps): () => void {
  const history = createWebHistory(props.basePath)
  const router = createRouter({
    history,
    routes: [{ path: '/', component: HomePage }],
  })

  const app = createApp(App)
  app.use(router)
  app.mount(el)

  return () => {
    app.unmount()
    // app.unmount() detaches the router, but only destroy() removes its window popstate listener.
    history.destroy()
  }
}
