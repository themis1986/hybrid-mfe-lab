import { TButton } from '@repo/ui'
import { CircleAlert, Columns3, SearchX } from '@repo/ui/icons'
import { useCallback, useMemo, useRef, useState } from 'react'
import { AddColumn } from '../components/board/AddColumn'
import { BoardColumn } from '../components/board/BoardColumn'
import { ColumnPreview } from '../components/board/ColumnPreview'
import { DeleteColumnDialog } from '../components/board/DeleteColumnDialog'
import { WipLimitDialog } from '../components/board/WipLimitDialog'
import { CardDialog } from '../components/card/CardDialog'
import { CardPreview } from '../components/card/CardPreview'
import { BoardSkeleton } from '../components/feedback/BoardSkeleton'
import { Message } from '../components/feedback/Message'
import { BoardFilters } from '../components/toolbar/BoardFilters'
import { BoardHeader } from '../components/toolbar/BoardHeader'
import {
  BoardDnd,
  type DragItem,
  useBoardDnd,
  useIsDragging,
} from '../dnd/BoardDnd'
import { useBoard } from '../hooks/useBoard'
import { useBoardActions } from '../hooks/useBoardActions'
import { useBoardHeight } from '../hooks/useBoardHeight'
import { DialogsProvider, useDialogs } from '../hooks/useDialogs'
import { useFilters } from '../hooks/useFilters'
import { useShortcuts } from '../hooks/useShortcuts'
import { useUndoToast } from '../hooks/useUndoToast'
import { getVisibleCardIds } from '../lib/filter'
import { useBoardStore, useBoardStoreSelector } from '../state/StoreContext'
import type { ColumnId } from '../types'

function Columns({
  hiddenCounts,
}: {
  hiddenCounts: Readonly<Record<ColumnId, number>>
}) {
  const { shownCardIds, shownColumnIds } = useBoardDnd()
  const isDragging = useIsDragging()
  const heightRef = useBoardHeight<HTMLDivElement>()

  return (
    <div
      ref={heightRef}
      role="group"
      aria-label="Board columns"
      data-drag-active={isDragging || undefined}
      // Snapping on a phone helps a swipe land on a column, but it would fight the auto-scroll during a drag.
      className="-mx-4 flex snap-x snap-proximity scroll-ps-4 items-start gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] data-drag-active:snap-none"
    >
      {shownColumnIds.map((id, index) => (
        <BoardColumn
          key={id}
          id={id}
          index={index}
          cardIds={shownCardIds[id] ?? []}
          hiddenCount={hiddenCounts[id] ?? 0}
        />
      ))}
      <AddColumn />
    </div>
  )
}

function renderPreview(item: DragItem) {
  return item.kind === 'card' ? (
    <CardPreview id={item.id} />
  ) : (
    <ColumnPreview id={item.id} />
  )
}

function LoadedBoard() {
  const board = useBoard()
  const { undo, redo } = useBoardActions()
  const { openDialog } = useDialogs()
  const filters = useFilters()
  const [helpOpen, setHelpOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  // BoardDnd lives below this component, so shortcuts ask the DOM whether a drag is on.
  const isDragActive = useCallback(
    () => !!rootRef.current?.querySelector('[data-drag-active]'),
    [],
  )

  useUndoToast()
  useShortcuts(rootRef, {
    focusSearch: () => searchRef.current?.focus(),
    newCard: () => {
      if (board.columnIds.length > 0) openDialog({ kind: 'new-card' })
    },
    toggleHelp: () => setHelpOpen((open) => !open),
    undo,
    redo,
    isDragActive,
  })

  const visibleCardIds = useMemo(
    () => getVisibleCardIds(board, filters.filters),
    [board, filters.filters],
  )
  const hiddenCounts = useMemo(
    () =>
      Object.fromEntries(
        board.columnIds.map((id) => [
          id,
          board.columns[id]!.cardIds.length - (visibleCardIds[id]?.length ?? 0),
        ]),
      ),
    [board, visibleCardIds],
  )
  const shownCount = Object.values(visibleCardIds).reduce(
    (sum, ids) => sum + ids.length,
    0,
  )
  const totalCount = Object.keys(board.cards).length
  const noResults = totalCount > 0 && shownCount === 0

  return (
    <div ref={rootRef} className="flex flex-col gap-3 p-4 font-sans text-fg">
      <BoardHeader helpOpen={helpOpen} onHelpOpenChange={setHelpOpen} />
      <BoardFilters
        api={filters}
        searchRef={searchRef}
        shownCount={shownCount}
        totalCount={totalCount}
      />
      {noResults && (
        <Message
          icon={SearchX}
          title="No cards match these filters"
          action={
            <TButton
              variant="outline"
              size="sm"
              label="Clear filters"
              onClick={filters.clearFilters}
            />
          }
        />
      )}
      {board.columnIds.length === 0 && (
        <Message icon={Columns3} title="This board has no columns yet">
          Add a column to start planning work.
        </Message>
      )}
      <BoardDnd visibleCardIds={visibleCardIds} renderPreview={renderPreview}>
        <Columns hiddenCounts={hiddenCounts} />
      </BoardDnd>
      <CardDialog />
      <DeleteColumnDialog />
      <WipLimitDialog />
    </div>
  )
}

export function BoardPage() {
  const store = useBoardStore()
  const status = useBoardStoreSelector((state) => state.status)
  const errorMessage = useBoardStoreSelector((state) =>
    state.status === 'error' ? state.message : null,
  )

  if (status === 'loading') return <BoardSkeleton />
  if (status === 'error') {
    return (
      <Message
        icon={CircleAlert}
        title="The board could not be loaded"
        action={
          <TButton
            variant="outline"
            size="sm"
            label="Try again"
            onClick={store.load}
          />
        }
      >
        {errorMessage}
      </Message>
    )
  }

  return (
    <DialogsProvider>
      <LoadedBoard />
    </DialogsProvider>
  )
}
