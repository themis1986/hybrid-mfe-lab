import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { retryDelay, shouldRetry } from './lib/retry'
import CoinPage from './pages/CoinPage.vue'
import MarketPage from './pages/MarketPage.vue'
import WatchlistPage from './pages/WatchlistPage.vue'
import styles from './styles.css?inline'

export interface MountProps {
  /** URL prefix the host serves this app under, e.g. "/crypto-app" ("/" when standalone). */
  basePath: string
}

// The stylesheet travels inside the JavaScript: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. It is on the page only while the app is mounted.
const STYLE_ID = 'crypto-mfe-styles'

const THIRTY_MINUTES = 30 * 60 * 1000

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
      { path: '/', component: MarketPage },
      {
        path: '/coins/:id',
        component: CoinPage,
        props: (route) => ({ id: String(route.params.id) }),
      },
      { path: '/watchlist', component: WatchlistPage },
      { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
    scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
  })

  // One Pinia and one query cache per mount, never at module scope: the federated module stays cached after
  // unmount, so module-level instances would carry state and timers into the next mount.
  const pinia = createPinia()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetry,
        retryDelay,
        // The keyless API allows about 5 calls a minute, so a tab switch must not spend them. Going back to a
        // coin or a range reuses the cache for the same reason.
        refetchOnWindowFocus: false,
        gcTime: THIRTY_MINUTES,
      },
    },
  })

  const app = createApp(App)
  // useId() is unique per app only: the prefix keeps this app's ids apart from other Vue apps on the page.
  app.config.idPrefix = 'crypto-mfe'
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
