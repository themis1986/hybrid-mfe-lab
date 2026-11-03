import { onScopeDispose, ref } from 'vue'

/**
 * The page's current colour scheme, for what CSS can't reach (the map's style). It only reads: the host owns
 * the choice, through `data-theme` on <html>; without one, the page follows the OS.
 */
export function useColorScheme() {
  const root = document.documentElement
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const read = () => {
    const forced = root.dataset.theme
    if (forced === 'light' || forced === 'dark') return forced
    return media.matches ? 'dark' : 'light'
  }

  const scheme = ref<'light' | 'dark'>(read())
  const update = () => {
    scheme.value = read()
  }

  const observer = new MutationObserver(update)
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  media.addEventListener('change', update)

  onScopeDispose(() => {
    observer.disconnect()
    media.removeEventListener('change', update)
  })

  return scheme
}
