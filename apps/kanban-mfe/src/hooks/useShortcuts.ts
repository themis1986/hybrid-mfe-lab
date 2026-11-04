import { type RefObject, useEffect, useRef } from 'react'

export interface ShortcutHandlers {
  focusSearch(): void
  newCard(): void
  toggleHelp(): void
  undo(): void
  redo(): void
  isDragActive(): boolean
}

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

// The board's keyboard shortcuts. They stay out of the way: not while typing, while a dialog or menu is open
// or during a drag, and only for key presses on this app or on nothing in particular, not on the host's page.
export function useShortcuts(
  rootRef: RefObject<HTMLElement | null>,
  handlers: ShortcutHandlers,
) {
  const latest = useRef(handlers)
  latest.current = handlers

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const { target } = event
      const handlers = latest.current
      if (event.defaultPrevented || handlers.isDragActive()) return
      if (isTyping(target)) return
      const isOnApp =
        target === document.body ||
        (target instanceof Node && rootRef.current?.contains(target))
      if (!isOnApp) return
      if (
        document.querySelector('[role=dialog],[role=alertdialog],[role=menu]')
      ) {
        return
      }

      const key = event.key.toLowerCase()
      if ((event.metaKey || event.ctrlKey) && key === 'z') {
        event.preventDefault()
        if (event.shiftKey) handlers.redo()
        else handlers.undo()
        return
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (key === '/') {
        event.preventDefault()
        handlers.focusSearch()
      } else if (key === 'n') {
        event.preventDefault()
        handlers.newCard()
      } else if (key === '?') {
        event.preventDefault()
        handlers.toggleHelp()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [rootRef])
}
