import {
  isTableFilterEmpty,
  type TableColumnFilter,
  type TableDateRange,
  type TableNumberRange,
  type TableRowData,
  toFilterOptions,
} from '@repo/table-core'
import { ListFilter } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import { TInput } from '../TInput'
import {
  TPopover,
  TPopoverContent,
  TPopoverFooter,
  TPopoverTrigger,
} from '../TPopover'
import { TRangeDatePicker } from '../TRangeDatePicker'
import { TSelect } from '../TSelect'
import { useDataTableContext } from './context'
import type { EngineTable } from './context'
import {
  tDataTableFilterFormClasses,
  tDataTableFilterRangeClasses,
  tDataTableHeadButtonClasses,
} from './TDataTable.variants'

type EngineColumn<TData extends TableRowData> = ReturnType<
  EngineTable<TData>['getAllLeafColumns']
>[number]

const TEXT_DELAY = 200

/** The column's filter options: its own, or the distinct values of the rows. */
export function useFilterOptions<TData extends TableRowData>(
  column: EngineColumn<TData>,
  filter: TableColumnFilter<TData>,
) {
  const own = filter.type === 'select' || filter.type === 'multiSelect'
  const declared = own ? filter.options : undefined
  return useMemo(() => {
    if (!own) return []
    return declared ?? toFilterOptions(column.getFacetedUniqueValues().keys())
    // The facets are read once per opening of the panel, which mounts this.
  }, [own, declared, column])
}

function FilterForm<TData extends TableRowData>({
  column,
  filter,
  title,
}: {
  column: EngineColumn<TData>
  filter: TableColumnFilter<TData>
  title: string
}) {
  const { labels, locale } = useDataTableContext()
  const value = column.getFilterValue()
  const options = useFilterOptions(column, filter)

  const [text, setText] = useState(typeof value === 'string' ? value : '')
  useEffect(() => {
    setText(typeof value === 'string' ? value : '')
  }, [value])
  useEffect(() => {
    if (filter.type !== 'text' || text === (value ?? '')) return
    const timer = setTimeout(
      () => column.setFilterValue(text || undefined),
      TEXT_DELAY,
    )
    return () => clearTimeout(timer)
  }, [column, filter.type, text, value])
  // The panel can close before the delay ends: what was typed still applies.
  const pendingText = useRef<{ text: string; applied: unknown }>(null)
  useLayoutEffect(() => {
    pendingText.current = { text, applied: value }
  })
  useEffect(
    () => () => {
      const pending = pendingText.current
      if (
        filter.type === 'text' &&
        pending &&
        pending.text !== (pending.applied ?? '')
      ) {
        column.setFilterValue(pending.text || undefined)
      }
    },
    [column, filter.type],
  )

  const setRange = (part: 'min' | 'max', raw: string) => {
    const current = (value ?? {}) as TableNumberRange
    const next: TableNumberRange = {
      ...current,
      [part]: raw === '' ? undefined : Number(raw),
    }
    column.setFilterValue(isTableFilterEmpty(next) ? undefined : next)
  }

  switch (filter.type) {
    case 'numberRange': {
      const range = (value ?? {}) as TableNumberRange
      return (
        <div className={tDataTableFilterRangeClasses}>
          <TInput
            type="number"
            size="sm"
            aria-label={`${title}: ${labels.rangeMin}`}
            placeholder={labels.rangeMin}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            value={range.min ?? ''}
            onChange={(event) => setRange('min', event.target.value)}
          />
          <TInput
            type="number"
            size="sm"
            aria-label={`${title}: ${labels.rangeMax}`}
            placeholder={labels.rangeMax}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            value={range.max ?? ''}
            onChange={(event) => setRange('max', event.target.value)}
          />
        </div>
      )
    }
    case 'dateRange': {
      const range = value as TableDateRange | undefined
      return (
        <TRangeDatePicker
          size="sm"
          aria-label={title}
          locale={locale}
          min={filter.min}
          max={filter.max}
          triggerLabel={labels.openCalendar}
          prevLabel={labels.previousMonth}
          nextLabel={labels.nextMonth}
          value={
            range?.start && range.end
              ? { start: range.start, end: range.end }
              : undefined
          }
          onValueChange={(next) => column.setFilterValue(next)}
        />
      )
    }
    case 'select':
      return (
        <TSelect
          size="sm"
          aria-label={title}
          options={options}
          placeholder={labels.selectPlaceholder}
          value={(value as string | undefined) ?? ''}
          onValueChange={(next) => column.setFilterValue(next || undefined)}
        />
      )
    case 'multiSelect':
      return (
        <TSelect
          multiple
          size="sm"
          aria-label={title}
          options={options}
          placeholder={labels.selectPlaceholder}
          value={(value as string[] | undefined) ?? []}
          onValueChange={(next) =>
            column.setFilterValue(next.length ? next : undefined)
          }
        />
      )
    default:
      return (
        <TInput
          size="sm"
          aria-label={title}
          placeholder={filter.placeholder ?? labels.filter}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      )
  }
}

/** The filter button of a header, and its panel. */
export function ColumnFilter<TData extends TableRowData>({
  column,
  filter,
  title,
}: {
  column: EngineColumn<TData>
  filter: TableColumnFilter<TData>
  title: string
}) {
  const { labels } = useDataTableContext()
  const active = column.getIsFiltered()
  return (
    <TPopover>
      <TPopoverTrigger asChild>
        <TButton
          variant="ghost"
          size="sm"
          tabIndex={-1}
          data-no-reorder
          data-active={active ? '' : undefined}
          aria-label={labels.filterColumn(title)}
          className={tDataTableHeadButtonClasses}
        >
          <TIcon icon={ListFilter} size="sm" />
        </TButton>
      </TPopoverTrigger>
      <TPopoverContent
        size="sm"
        title={labels.filterColumn(title)}
        closeLabel={labels.closePanel}
      >
        <div className={tDataTableFilterFormClasses}>
          <FilterForm column={column} filter={filter} title={title} />
        </div>
        <TPopoverFooter>
          <TButton
            variant="ghost"
            size="sm"
            disabled={!active}
            onClick={() => column.setFilterValue(undefined)}
          >
            {labels.clearFilter}
          </TButton>
        </TPopoverFooter>
      </TPopoverContent>
    </TPopover>
  )
}
