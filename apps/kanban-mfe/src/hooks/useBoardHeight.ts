import { useLayoutEffect, useRef } from 'react'

/**
 * Lets the columns fill the viewport below wherever the board starts, inside the shell or on its own, without
 * knowing what's above it. Sets --kanban-board-height on the element. On a short screen, or one where the
 * shell stacks its menu above the content, the page scrolls instead of squeezing the columns.
 */
export function useBoardHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    function update() {
      const top = Math.round(
        element!.getBoundingClientRect().top + window.scrollY,
      )
      element!.style.setProperty(
        '--kanban-board-height',
        `max(24rem, calc(100dvh - ${top}px - 1.5rem))`,
      )
    }

    update()
    // The toolbar above can wrap to more lines, so its size counts as well as the window's.
    const observer = new ResizeObserver(update)
    if (element.parentElement) observer.observe(element.parentElement)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return ref
}
