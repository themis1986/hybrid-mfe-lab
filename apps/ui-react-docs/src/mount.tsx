import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DocsPage } from './DocsPage'
import styles from './styles.css?inline'

export interface MountProps {
  /** URL prefix the host serves this app under, e.g. "/ui-react-docs" ("/" when standalone). */
  basePath: string
}

// The stylesheet travels inside the JavaScript: a federated remote can't count on its host, or on the
// federation runtime, to load a CSS file for it. It is on the page only while the app is mounted.
const STYLE_ID = 'ui-react-docs-styles'

/** Federation contract: render the app into `el`; the returned function tears it down. */
export function mount(el: HTMLElement, _props: MountProps): () => void {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = styles
  document.head.appendChild(style)

  // One page with hash anchors, so no router yet. A router would take props.basePath as its basename.
  // identifierPrefix keeps this root's useId() values apart from other React apps on the page.
  const root = createRoot(el, { identifierPrefix: 'ui-react-docs-' })
  root.render(
    <StrictMode>
      <DocsPage />
    </StrictMode>,
  )

  // Synchronous unmount is safe here, even from the host's effect cleanup: this remote bundles its own
  // React, so the host's render isn't in progress in this React instance.
  return () => {
    root.unmount()
    style.remove()
  }
}
