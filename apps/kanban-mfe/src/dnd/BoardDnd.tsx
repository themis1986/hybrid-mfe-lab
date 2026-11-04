import type { Plugins } from '@dnd-kit/abstract'
import {
  Accessibility,
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from '@dnd-kit/dom'
import { DragDropProvider, DragOverlay, useDragOperation } from '@dnd-kit/react'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useBoard } from '../hooks/useBoard'
import { useBoardActions } from '../hooks/useBoardActions'
import {
  type CardDraft,
  type DropTarget,
  findDraftColumn,
  moveCardInDraft,
  moveColumnInOrder,
  resolveDropIndex,
} from '../lib/order'
import type { CardId, ColumnId } from '../types'
import {
  announceDrop,
  announceMove,
  announcePickUp,
  KEYBOARD_INSTRUCTIONS,
} from './announcements'

export type DragItem =
  { kind: 'card'; id: CardId } | { kind: 'column'; id: ColumnId }

/** How far down a column, in pixels, a card over it goes to the top rather than to the end. */
const COLUMN_TOP_ZONE = 64

// Module-level on purpose: plain configuration, and the provider compares these by identity.
const SENSORS = [
  PointerSensor.configure({
    // A plain click must stay a click, so a mouse has to travel before a drag starts. By default it starts
    // on press when the target is a handle, and the whole card is a handle. Touch needs a long press, so a
    // swipe still scrolls.
    activationConstraints(event) {
      return event.pointerType === 'touch'
        ? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })]
        : [new PointerActivationConstraints.Distance({ value: 5 })]
    },
  }),
  KeyboardSensor.configure({
    // Enter is left to the button: it opens the card. Space picks up.
    keyboardCodes: {
      ...KeyboardSensor.defaults.keyboardCodes,
      start: ['Space'],
    },
    preventActivation: (event, source) =>
      event.repeat || KeyboardSensor.defaults.preventActivation(event, source),
  }),
]

const PLUGINS = (defaults: Plugins): Plugins => [
  ...defaults,
  // The messages need the draft, which this component holds, so it announces them itself.
  Accessibility.configure({
    announcements: {},
    screenReaderInstructions: { draggable: KEYBOARD_INSTRUCTIONS },
  }),
]

interface DndContextValue {
  shownCardIds: Readonly<Record<ColumnId, readonly CardId[]>>
  shownColumnIds: readonly ColumnId[]
  /** True from the start of a drag until just after it ends, so the click that ends one can be ignored. */
  isDragActive(): boolean
}

const DndContext = createContext<DndContextValue | null>(null)

export function useBoardDnd(): DndContextValue {
  const value = useContext(DndContext)
  if (!value) throw new Error('useBoardDnd needs a BoardDnd.')
  return value
}

/** Whether anything on the board is being dragged. Only for components inside BoardDnd. */
export function useIsDragging(): boolean {
  return !!useDragOperation().source
}

/** Moves focus to a card's or column's drag handle. Returns whether it found one. */
export function focusHandle(id: CardId | ColumnId): boolean {
  const handle = document.querySelector<HTMLElement>(
    `[data-kanban-handle="${CSS.escape(id)}"]`,
  )
  handle?.focus({ preventScroll: true })
  return !!handle
}

// The only component that knows about the drag library's events. During a drag the board shows a draft of
// the order; the drop turns it into one action, so a drag is one history entry and one Undo however many
// columns it crossed, and a cancel just drops the draft.
export function BoardDnd({
  visibleCardIds,
  renderPreview,
  children,
}: {
  /** The cards the filters leave on the board, by column. */
  visibleCardIds: Readonly<Record<ColumnId, readonly CardId[]>>
  renderPreview: (item: DragItem) => ReactNode
  children: ReactNode
}) {
  const board = useBoard()
  const { moveCard, moveColumn } = useBoardActions()

  const [cardDraft, setCardDraft] = useState<CardDraft | null>(null)
  const [columnDraft, setColumnDraft] = useState<readonly ColumnId[] | null>(
    null,
  )

  // The library runs its handlers in a transition and swaps them at commit, so a handler can be a render
  // behind. The refs always hold the latest values, and the drop reads them, not the state.
  const latest = useRef({ board, visibleCardIds })
  latest.current = { board, visibleCardIds }
  const cardDraftRef = useRef<CardDraft | null>(null)
  const columnDraftRef = useRef<readonly ColumnId[] | null>(null)
  const dragActive = useRef(false)
  const keyboardItem = useRef<DragItem | null>(null)

  // A move to another column remounts the card, and a keyboard user's focus goes with it. The draft renders
  // in a transition, so this has to run at its commit, not from the handler that set it.
  useLayoutEffect(() => {
    if (keyboardItem.current) focusHandle(keyboardItem.current.id)
  }, [cardDraft, columnDraft])

  const announcer = useRef<HTMLDivElement>(null)
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  function announce(message: string, delayMs = 0) {
    clearTimeout(announceTimer.current)
    announceTimer.current = setTimeout(() => {
      if (announcer.current) announcer.current.textContent = message
    }, delayMs)
  }

  useEffect(() => {
    // The sensor ends a drag on any Space or Enter keydown, so holding the key would drop right after the
    // pick-up. Key repeats never reach it during a drag.
    function ignoreKeyRepeat(event: KeyboardEvent) {
      const isDropKey = event.key === ' ' || event.key === 'Enter'
      if (event.repeat && isDropKey && dragActive.current) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }
    window.addEventListener('keydown', ignoreKeyRepeat, true)
    return () => {
      window.removeEventListener('keydown', ignoreKeyRepeat, true)
      clearTimeout(announceTimer.current)
    }
  }, [])

  const value = useMemo<DndContextValue>(
    () => ({
      shownCardIds: cardDraft ?? visibleCardIds,
      shownColumnIds: columnDraft ?? board.columnIds,
      isDragActive: () => dragActive.current,
    }),
    [cardDraft, columnDraft, visibleCardIds, board.columnIds],
  )

  return (
    <DndContext.Provider value={value}>
      <DragDropProvider
        sensors={SENSORS}
        plugins={PLUGINS}
        onDragStart={(event) => {
          try {
            dragActive.current = true
            const { source, activatorEvent } = event.operation
            if (!source) return
            const item = toItem(source)
            keyboardItem.current = isKeyboardEvent(activatorEvent) ? item : null
            announce(
              announcePickUp(
                latest.current.board,
                latest.current.visibleCardIds,
                item,
              ),
            )
          } catch (error) {
            console.error(error)
          }
        }}
        onDragMove={(event) => {
          // The library's keyboard moves pick the nearest target in that direction, so Down at the bottom
          // of a column would jump into the next one, and a column could reorder on Up or Down. Between
          // columns is what Left and Right are for.
          try {
            const { source } = event.operation
            if (
              !source ||
              !event.by?.y ||
              !isKeyboardEvent(event.nativeEvent)
            ) {
              return
            }
            const item = toItem(source)
            if (item.kind === 'column') {
              event.preventDefault()
              return
            }
            const draft = cardDraftRef.current ?? latest.current.visibleCardIds
            const columnId = findDraftColumn(draft, item.id)
            const list = columnId ? draft[columnId]! : []
            const edge = event.by.y < 0 ? list[0] : list.at(-1)
            if (edge === item.id) event.preventDefault()
          } catch (error) {
            console.error(error)
          }
        }}
        onDragOver={(event) => {
          // A handler that throws would leave the drag stuck: the library waits on a render that never comes.
          try {
            const { source, target, shape, position } = event.operation
            if (!source || !target) return
            const { board, visibleCardIds } = latest.current
            const item = toItem(source)
            const targetId = String(target.id)

            if (item.kind === 'column') {
              if (target.type !== 'column') return
              const order = columnDraftRef.current ?? board.columnIds
              const next = moveColumnInOrder(order, item.id, targetId)
              if (next === order) return
              columnDraftRef.current = next
              setColumnDraft(next)
              announce(announceMove(board, item, null, next), 150)
              return
            }

            const draft = cardDraftRef.current ?? visibleCardIds
            const y = shape?.current.center.y ?? position.current.y
            const dropTarget: DropTarget =
              target.type === 'column'
                ? {
                    kind: 'column',
                    id: targetId,
                    atTop:
                      !!target.shape &&
                      y < target.shape.boundingRectangle.top + COLUMN_TOP_ZONE,
                  }
                : {
                    kind: 'card',
                    id: targetId,
                    below: !!target.shape && y > target.shape.center.y,
                  }
            const next = moveCardInDraft(draft, item.id, dropTarget)
            if (next === draft) return
            cardDraftRef.current = next
            setCardDraft(next)
            announce(announceMove(board, item, next, null), 150)
          } catch (error) {
            console.error(error)
          }
        }}
        onDragEnd={(event) => {
          try {
            const { source } = event.operation
            if (!source) return
            const { board } = latest.current
            const item = toItem(source)

            if (!event.canceled && item.kind === 'column') {
              const order = columnDraftRef.current
              if (order) moveColumn(item.id, order.indexOf(item.id))
            }
            const draft = cardDraftRef.current
            if (!event.canceled && item.kind === 'card' && draft) {
              const toColumn = findDraftColumn(draft, item.id)
              if (toColumn) {
                moveCard(
                  item.id,
                  toColumn,
                  resolveDropIndex(
                    board.columns[toColumn]!.cardIds,
                    draft[toColumn]!,
                    item.id,
                  ),
                )
              }
            }

            announce(
              announceDrop(
                latest.current.board,
                item,
                event.canceled,
                draft,
                columnDraftRef.current,
              ),
            )
          } catch (error) {
            console.error(error)
          } finally {
            cardDraftRef.current = null
            columnDraftRef.current = null
            setCardDraft(null)
            setColumnDraft(null)
            setTimeout(() => {
              dragActive.current = false
            })
          }
        }}
      >
        {children}
        {/* Not dropAnimation={null} for reduced motion: the library honours that itself, and null also skips
            its focus restore. */}
        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
          {(source) => renderPreview(toItem(source))}
        </DragOverlay>
      </DragDropProvider>
      <div
        ref={announcer}
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </DndContext.Provider>
  )
}

function toItem(source: { id: string | number; type?: unknown }): DragItem {
  return {
    kind: source.type === 'column' ? 'column' : 'card',
    id: String(source.id),
  }
}

function isKeyboardEvent(event: unknown): boolean {
  return typeof KeyboardEvent !== 'undefined' && event instanceof KeyboardEvent
}
