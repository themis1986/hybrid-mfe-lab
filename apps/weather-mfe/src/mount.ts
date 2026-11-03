import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import WeatherPage from './pages/WeatherPage.vue'
import styles from './styles.css?inline'

export interface MountProps {
  /** URL prefix the host serves this app under, e.g. "/weather-app" ("/" when standalone). */
  basePath: string
}

// The stylesheet travels inside the JavaScript: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. It is on the page only while the app is mounted.
const STYLE_ID = 'weather-mfe-styles'

/** Federation contract: render the app into `el`; the returned function tears it down. */
export function mount(el: HTMLElement, props: MountProps): () => void {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = styles
  document.head.appendChild(style)

  const history = createWebHistory(props.basePath)
  const router = createRouter({
    history,
    routes: [
      { path: '/', component: WeatherPage },
      { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
  })

  // One Pinia and one query cache per mount, never at module scope: the federated module stays cached after
  // unmount, so module-level instances would carry state and timers into the next mount.
  const pinia = createPinia()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  })

  const app = createApp(App)
  // useId() is unique per app only: the prefix keeps this app's ids apart from other Vue apps on the page.
  app.config.idPrefix = 'weather-mfe'
  app.use(pinia)
  app.use(router)
  app.use(VueQueryPlugin, { queryClient })
  app.mount(el)

  return () => {
    app.unmount()
    // Cancels what's still running and drops the cache's timers; app.unmount() alone leaves them.
    queryClient.clear()
    // app.unmount() detaches the router, but only destroy() removes its window popstate listener.
    history.destroy()
    style.remove()
  }
}
