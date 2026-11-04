import { useRouter } from 'vue-router'

// What a click in a row must leave alone: the row's own controls, and the cell's link does its own navigation.
const INTERACTIVE =
  'a, button, input, select, textarea, label, [role="menuitem"]'

/**
 * Opens a coin when its row is clicked. A listener on the table, as the table has no row event. Pointer only:
 * for the keyboard, and to open a coin in a new tab, each row's name cell holds a real link.
 */
export function useCoinRowClick(isCoin: (id: string) => boolean) {
  const router = useRouter()

  return (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element) || target.closest(INTERACTIVE)) return
    // Selecting a price to copy it shouldn't navigate.
    if (window.getSelection()?.toString()) return
    const id = target
      .closest('tbody [data-row-key]')
      ?.getAttribute('data-row-key')
    if (id && isCoin(id)) void router.push(coinPath(id))
  }
}

export function coinPath(id: string) {
  return `/coins/${encodeURIComponent(id)}`
}
