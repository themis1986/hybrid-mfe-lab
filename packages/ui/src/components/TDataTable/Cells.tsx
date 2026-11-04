import {
  formatTableDate,
  formatTableNumber,
  type TableColumn,
} from '@repo/table-core'
import { MoreHorizontal } from 'lucide-react'
import { useRef, useState } from 'react'
import { TAvatar } from '../TAvatar'
import { TBadge } from '../TBadge'
import { TButton } from '../TButton'
import {
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuTrigger,
} from '../TDropdownMenu'
import { TDatePicker } from '../TDatePicker'
import { TIcon } from '../TIcon'
import { TInput } from '../TInput'
import { TProgress } from '../TProgress'
import { TSelect } from '../TSelect'
import { useDataTableContext } from './context'
import {
  tDataTableCellAvatarClasses,
  tDataTableCellButtonClasses,
  tDataTableCellNumberClasses,
  tDataTableCellProgressClasses,
  tDataTableCellProgressValueClasses,
  tDataTableCellTextClasses,
  tDataTableEditorClasses,
} from './TDataTable.variants'
import type { TDataTableColumn } from './types'

function ActionsMenu<TData>({
  spec,
  row,
}: {
  spec: TableColumn<TData, any, any>
  row: TData
}) {
  const { labels } = useDataTableContext()
  return (
    <TDropdownMenu>
      <TDropdownMenuTrigger asChild>
        <TButton
          variant="ghost"
          size="sm"
          tabIndex={-1}
          data-t-activate="menu"
          aria-label={labels.rowActions}
          className={tDataTableCellButtonClasses}
        >
          <TIcon icon={MoreHorizontal} size="sm" />
        </TButton>
      </TDropdownMenuTrigger>
      <TDropdownMenuContent align="end">
        {(spec.actions?.(row) ?? []).map((action) => (
          <TDropdownMenuItem
            key={action.id}
            tone={action.tone}
            disabled={action.disabled}
            onSelect={action.onSelect}
          >
            {action.icon ? <TIcon icon={action.icon} size="sm" /> : null}
            {action.label}
          </TDropdownMenuItem>
        ))}
      </TDropdownMenuContent>
    </TDropdownMenu>
  )
}

/** What a cell shows for its `type`, when the column has no `cell` renderer. */
export function BuiltInCell<TData>({
  spec,
  value,
  row,
}: {
  spec: TDataTableColumn<TData>
  value: unknown
  row: TData
}) {
  const { locale } = useDataTableContext()
  const column = spec as unknown as TableColumn<TData, any, any>
  switch (spec.type) {
    case 'number':
      return (
        <span className={tDataTableCellNumberClasses}>
          {formatTableNumber(value, locale, spec.number)}
        </span>
      )
    case 'date':
      return (
        <span className={tDataTableCellTextClasses}>
          {formatTableDate(value, locale, spec.date)}
        </span>
      )
    case 'badge': {
      if (value === null || value === undefined) return null
      const key = String(value)
      return (
        <TBadge tone={spec.badge?.tones?.[key] ?? 'neutral'}>
          {spec.badge?.labels?.[key] ?? key}
        </TBadge>
      )
    }
    case 'progress': {
      const max = spec.progress?.max ?? 100
      const amount = typeof value === 'number' ? value : Number(value ?? 0)
      const percent = Math.round((amount / max) * 100)
      return (
        <span className={tDataTableCellProgressClasses}>
          <TProgress
            value={amount}
            max={max}
            size="sm"
            tone={spec.progress?.tone}
            aria-label={`${spec.title}: ${percent}%`}
          />
          <span className={tDataTableCellProgressValueClasses}>{percent}%</span>
        </span>
      )
    }
    case 'avatar': {
      const name = spec.avatar?.name?.(row) ?? String(value ?? '')
      return (
        <span className={tDataTableCellAvatarClasses}>
          <TAvatar name={name} src={spec.avatar?.src?.(row)} size="sm" />
          <span className={tDataTableCellTextClasses}>{name}</span>
        </span>
      )
    }
    case 'actions':
      return <ActionsMenu spec={column} row={row} />
    default:
      return (
        <span className={tDataTableCellTextClasses}>
          {value === null || value === undefined ? '' : String(value)}
        </span>
      )
  }
}

/** The editor of the cell being edited. One exists at a time, and its row stays mounted while it lasts. */
export function CellEditor<TData>({
  spec,
  value,
  row,
  rowId,
  columnId,
}: {
  spec: TDataTableColumn<TData>
  value: unknown
  row: TData
  rowId: string
  columnId: string
}) {
  const { labels, locale, latest, finishEdit } = useDataTableContext()
  const [draft, setDraft] = useState(
    value === null || value === undefined ? '' : String(value),
  )
  const [failed, setFailed] = useState(false)
  const done = useRef(false)

  const commit = async (next: unknown, move?: 1 | -1) => {
    if (done.current) return
    done.current = true
    const unchanged = (next ?? '') === (value ?? '')
    if (!unchanged) {
      try {
        await latest.current.onCellEdit?.({
          rowId,
          row,
          columnId,
          value: next,
          previousValue: value,
        })
      } catch {
        // The editor stays open with its draft, marked as failed.
        done.current = false
        setFailed(true)
        return
      }
    }
    finishEdit(move)
  }
  const cancel = () => {
    done.current = true
    finishEdit()
  }

  if (typeof spec.editor === 'function') {
    return spec.editor({
      value,
      row,
      columnId,
      commit: (next) => void commit(next),
      cancel,
    })
  }

  const kind =
    spec.editor ??
    (spec.type === 'number' || spec.type === 'progress'
      ? 'number'
      : spec.type === 'date'
        ? 'date'
        : spec.editorOptions
          ? 'select'
          : 'text')
  const editLabel = labels.editCell(spec.title)
  const failure = failed ? (
    <span role="alert" className="sr-only">
      {labels.editFailed}
    </span>
  ) : null

  if (kind === 'select') {
    return (
      <>
        <TSelect
          size="sm"
          aria-label={editLabel}
          options={spec.editorOptions ?? []}
          value={draft}
          invalid={failed}
          className={tDataTableEditorClasses}
          onValueChange={(next) => {
            setDraft(next)
            void commit(next)
          }}
        />
        {failure}
      </>
    )
  }
  if (kind === 'date') {
    return (
      <>
        <TDatePicker
          size="sm"
          aria-label={editLabel}
          locale={locale}
          value={draft || undefined}
          invalid={failed}
          triggerLabel={labels.openCalendar}
          prevLabel={labels.previousMonth}
          nextLabel={labels.nextMonth}
          className={tDataTableEditorClasses}
          onValueChange={(next) => void commit(next ?? null)}
        />
        {failure}
      </>
    )
  }
  const parse = () =>
    kind === 'number' ? (draft === '' ? null : Number(draft)) : draft
  return (
    <>
      <TInput
        autoFocus
        size="sm"
        type={kind === 'number' ? 'number' : 'text'}
        aria-label={editLabel}
        value={draft}
        invalid={failed}
        className={tDataTableEditorClasses}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => void commit(parse())}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            void commit(parse())
          } else if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            cancel()
          } else if (event.key === 'Tab') {
            event.preventDefault()
            void commit(parse(), event.shiftKey ? -1 : 1)
          }
        }}
      />
      {failure}
    </>
  )
}
