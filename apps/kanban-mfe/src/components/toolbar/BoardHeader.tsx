import {
  TButton,
  TIcon,
  TPopover,
  TPopoverContent,
  TPopoverTrigger,
  TProgress,
  TTooltip,
} from '@repo/ui'
import { CircleHelp, Plus, Redo2, Undo2 } from '@repo/ui/icons'
import { useMemo } from 'react'
import { useBoard, useHistoryFlags } from '../../hooks/useBoard'
import { useBoardActions } from '../../hooks/useBoardActions'
import { useDialogs } from '../../hooks/useDialogs'
import { summarizeBoard } from '../../lib/board'
import { today } from '../../lib/dates'
import { IconButton } from '../common/IconButton'

const SHORTCUTS: [string, string][] = [
  ['/', 'Search'],
  ['N', 'New card'],
  ['⌘/Ctrl Z', 'Undo'],
  ['⇧ ⌘/Ctrl Z', 'Redo'],
  ['Space', 'Pick up or drop the focused card'],
  ['Arrow keys', 'Move it while picked up'],
  ['Enter', 'Open the focused card'],
  ['Esc', 'Cancel a move'],
  ['?', 'This list'],
]

export function BoardHeader({
  helpOpen,
  onHelpOpenChange,
}: {
  helpOpen: boolean
  onHelpOpenChange(open: boolean): void
}) {
  const board = useBoard()
  const { openDialog } = useDialogs()
  const { undo, redo } = useBoardActions()
  const { canUndo, canRedo } = useHistoryFlags()
  const summary = useMemo(() => summarizeBoard(board, today()), [board])
  const percentDone =
    summary.total === 0 ? 0 : Math.round((summary.done / summary.total) * 100)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <h1 className="m-0 font-sans text-lg font-semibold text-fg">
        {board.title}
      </h1>
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
        <span>
          {summary.total} card{summary.total === 1 ? '' : 's'}
        </span>
        <span className="inline-flex items-center gap-2">
          <TProgress
            size="sm"
            tone="success"
            value={percentDone}
            aria-label="Cards done"
            className="w-20"
          />
          {percentDone}% done
        </span>
        {summary.overdue > 0 && (
          <span className="font-medium text-danger-fg">
            {summary.overdue} overdue
          </span>
        )}
      </div>
      <div className="ms-auto flex items-center gap-1">
        <TTooltip content="Undo" disabled={!canUndo}>
          <IconButton
            icon={Undo2}
            label="Undo"
            disabled={!canUndo}
            onClick={undo}
          />
        </TTooltip>
        <TTooltip content="Redo" disabled={!canRedo}>
          <IconButton
            icon={Redo2}
            label="Redo"
            disabled={!canRedo}
            onClick={redo}
          />
        </TTooltip>
        <TPopover open={helpOpen} onOpenChange={onHelpOpenChange}>
          <TPopoverTrigger asChild>
            <IconButton icon={CircleHelp} label="Keyboard shortcuts" />
          </TPopoverTrigger>
          <TPopoverContent title="Keyboard shortcuts" align="end">
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
              {SHORTCUTS.map(([keys, what]) => (
                <div key={keys} className="contents">
                  <dt className="font-mono text-xs leading-5 text-fg-muted">
                    {keys}
                  </dt>
                  <dd className="m-0 text-sm">{what}</dd>
                </div>
              ))}
            </dl>
          </TPopoverContent>
        </TPopover>
        <TButton
          size="sm"
          disabled={board.columnIds.length === 0}
          onClick={() => openDialog({ kind: 'new-card' })}
        >
          <TIcon icon={Plus} size="sm" />
          New card
        </TButton>
      </div>
    </div>
  )
}
