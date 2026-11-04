import { TAlarmHost } from '@repo/ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { createInMemoryRepository } from './data/inMemoryRepository'
import { createSeedBoard } from './data/seed'
import { today } from './lib/dates'
import { createBoardStore } from './state/store'
import styles from './styles.css?inline'

export interface MountProps {
  /** URL prefix the host serves this app under, e.g. "/kanban-app" ("/" when standalone). */
  basePath: string
}

// The stylesheet travels inside the JavaScript: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. It is on the page only while the app is mounted.
const STYLE_ID = 'kanban-styles'

/** Federation contract: render the app into `el`; the returned function tears it down. */
export function mount(el: HTMLElement, _props: MountProps): () => void {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = styles
  document.head.appendChild(style)

  // One store per mount, never at module scope: the federated module stays cached after unmount, so a
  // module-level store would carry the board into the next mount.
  const store = createBoardStore(
    createInMemoryRepository(() => createSeedBoard(today())),
  )
  store.load()

  // One page, so no router yet. A router would take props.basePath as its basename.
  // identifierPrefix keeps this root's useId() values apart from other React apps on the page.
  const root = createRoot(el, { identifierPrefix: 'kanban-' })
  root.render(
    <StrictMode>
      <App store={store} />
      {/* Shows the alarms when this app runs on its own; inside the shell, the shell's host does. */}
      <TAlarmHost />
    </StrictMode>,
  )

  // Synchronous unmount is safe here, even from the host's effect cleanup: this remote bundles its own
  // React, so the host's render isn't in progress in this React instance.
  return () => {
    root.unmount()
    store.dispose()
    style.remove()
  }
}
