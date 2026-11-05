import { TAlarmHost } from '@repo/ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { routes } from './routes'
import styles from './styles.css?inline'

export interface MountProps {
  /** URL prefix the host serves this app under, e.g. "/budget-app" ("/" when standalone). */
  basePath: string
}

// The stylesheet travels inside the JavaScript: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. It is on the page only while the app is mounted.
const STYLE_ID = 'budget-styles'

/** Federation contract: render the app into `el`; the returned function tears it down. */
export function mount(el: HTMLElement, props: MountProps): () => void {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = styles
  document.head.appendChild(style)

  // One router per mount, never at module scope: it listens to the window's popstate from the moment it is
  // created, and the federated module stays cached after unmount.
  const router = createBrowserRouter(routes, { basename: props.basePath })

  // identifierPrefix keeps this root's useId() values apart from other React apps on the page.
  const root = createRoot(el, { identifierPrefix: 'budget-' })
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
      {/* Shows the alarms when this app runs on its own; inside the shell, the shell's host does. */}
      <TAlarmHost />
    </StrictMode>,
  )

  // Synchronous unmount is safe here, even from the host's effect cleanup: this remote bundles its own
  // React, so the host's render isn't in progress in this React instance.
  return () => {
    root.unmount()
    // Unmounting the provider leaves the router listening: only dispose() removes its popstate listener.
    router.dispose()
    style.remove()
  }
}
