import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LandingPage from './pages/LandingPage.vue'
import TodosPage from './pages/TodosPage.vue'
import styles from './styles.css?inline'

export interface MountProps {
  /** URL prefix the host serves this app under, e.g. "/todo-app" ("/" when standalone). */
  basePath: string
}

// The stylesheet travels inside the JavaScript: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. It is on the page only while the app is mounted.
const STYLE_ID = 'todo-mfe-styles'

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
      { path: '/', component: LandingPage },
      { path: '/todos', component: TodosPage },
      { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
  })

  // One Pinia per mount, never at module scope: the federated module stays cached after unmount, so a
  // module-level Pinia would hand the next mount (the shell remounts on every visit) the old todos.
  const pinia = createPinia()

  const app = createApp(App)
  // useId() is unique per app only: the prefix keeps this app's ids apart from other Vue apps on the page.
  app.config.idPrefix = 'todo-mfe'
  app.use(pinia)
  app.use(router)
  app.mount(el)

  return () => {
    app.unmount()
    // app.unmount() detaches the router, but only destroy() removes its window popstate listener.
    history.destroy()
    style.remove()
  }
}
