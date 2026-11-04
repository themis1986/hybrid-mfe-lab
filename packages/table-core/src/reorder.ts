// Dragging a header to reorder columns, on pointer events so both frameworks share it. Touch is left to the
// columns panel's move buttons, because a touch on a header has to keep scrolling the table.

export type TableDropSide = 'before' | 'after'

/** The order after moving `id` to one side of `targetId`. */
export function moveTableColumn(
  order: readonly string[],
  id: string,
  targetId: string,
  side: TableDropSide,
): string[] {
  const next = order.filter((other) => other !== id)
  const index = next.indexOf(targetId)
  if (index < 0) return [...order]
  next.splice(side === 'before' ? index : index + 1, 0, id)
  return next
}

export interface TableReorderOptions {
  /** The header row's parent; its cells carry `data-col`, `data-reorderable` and `data-pin-region`. */
  head: HTMLElement
  scroller: HTMLElement
  onReorder: (id: string, targetId: string, side: TableDropSide) => void
}

const DRAG_THRESHOLD = 6
const EDGE_ZONE = 48
const EDGE_SPEED = 14

export function createTableColumnReorder({
  head,
  scroller,
  onReorder,
}: TableReorderOptions): () => void {
  let cleanupDrag: (() => void) | null = null

  const onPointerDown = (down: PointerEvent) => {
    if (down.button !== 0 || down.pointerType === 'touch') return
    const target = down.target as HTMLElement
    if (target.closest('[data-no-reorder]')) return
    const source = target.closest<HTMLElement>('[data-reorderable]')
    if (!source || !head.contains(source)) return

    const sourceId = source.dataset.col as string
    const region = source.dataset.pinRegion
    let dragging = false
    let drop: { cell: HTMLElement; side: TableDropSide } | null = null
    let lastX = down.clientX
    let lastY = down.clientY
    let frame = 0

    const clearDrop = () => {
      if (drop) delete drop.cell.dataset.drop
      drop = null
    }

    const updateDrop = () => {
      clearDrop()
      const over = document
        .elementFromPoint(lastX, lastY)
        ?.closest<HTMLElement>('[data-reorderable]')
      if (
        !over ||
        over === source ||
        !head.contains(over) ||
        over.dataset.pinRegion !== region
      ) {
        return
      }
      const rect = over.getBoundingClientRect()
      const rtl = getComputedStyle(over).direction === 'rtl'
      const firstHalf = lastX < rect.left + rect.width / 2
      const side: TableDropSide = firstHalf !== rtl ? 'before' : 'after'
      over.dataset.drop = side
      drop = { cell: over, side }
    }

    const autoScroll = () => {
      const rect = scroller.getBoundingClientRect()
      if (lastX < rect.left + EDGE_ZONE) scroller.scrollLeft -= EDGE_SPEED
      else if (lastX > rect.right - EDGE_ZONE) scroller.scrollLeft += EDGE_SPEED
      updateDrop()
      frame = requestAnimationFrame(autoScroll)
    }

    const onMove = (move: PointerEvent) => {
      lastX = move.clientX
      lastY = move.clientY
      if (!dragging) {
        if (
          Math.abs(lastX - down.clientX) < DRAG_THRESHOLD &&
          Math.abs(lastY - down.clientY) < DRAG_THRESHOLD
        ) {
          return
        }
        dragging = true
        source.dataset.dragging = ''
        frame = requestAnimationFrame(autoScroll)
      }
      move.preventDefault()
    }

    const finish = (commit: boolean) => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('keydown', onKey, true)
      delete source.dataset.dragging
      const result = drop
      clearDrop()
      cleanupDrag = null
      if (!dragging) return
      // The release also clicks the header's sort button; that click isn't a sort. The listener goes in the
      // next task if no click came (released elsewhere), or it would eat the next real one.
      const swallow = (click: MouseEvent) => {
        click.preventDefault()
        click.stopPropagation()
      }
      window.addEventListener('click', swallow, { capture: true, once: true })
      setTimeout(() =>
        window.removeEventListener('click', swallow, { capture: true }),
      )
      if (commit && result) {
        onReorder(sourceId, result.cell.dataset.col as string, result.side)
      }
    }
    const onUp = () => finish(true)
    const onCancel = () => finish(false)
    const onKey = (key: KeyboardEvent) => {
      if (key.key === 'Escape') {
        key.stopPropagation()
        finish(false)
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('keydown', onKey, true)
    cleanupDrag = () => finish(false)
  }

  head.addEventListener('pointerdown', onPointerDown)
  return () => {
    head.removeEventListener('pointerdown', onPointerDown)
    cleanupDrag?.()
  }
}
