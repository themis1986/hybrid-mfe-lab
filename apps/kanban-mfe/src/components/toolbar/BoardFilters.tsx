import { TButton, TIcon, TInput, TSelect } from '@repo/ui'
import { Search, X } from '@repo/ui/icons'
import type { RefObject } from 'react'
import { useBoard } from '../../hooks/useBoard'
import type { FiltersApi } from '../../hooks/useFilters'
import { hasActiveFilters, UNASSIGNED } from '../../lib/filter'
import { PRIORITY_LABELS } from '../../lib/presentation'
import { type Priority, PRIORITIES } from '../../types'

function FilterChip({ label, onRemove }: { label: string; onRemove(): void }) {
  return (
    <span className="box-border inline-flex items-center gap-0.5 rounded-full border border-accent-line bg-accent-subtle py-0.5 ps-2 pe-0.5 text-xs text-accent-fg">
      {label}
      <button
        type="button"
        aria-label={`Remove filter: ${label}`}
        className="inline-flex size-4 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-transparent p-0 text-current outline-offset-1 outline-focus hover:bg-accent-subtle-hover focus-visible:outline-2"
        onClick={onRemove}
      >
        <TIcon icon={X} size="sm" />
      </button>
    </span>
  )
}

export function BoardFilters({
  api,
  searchRef,
  shownCount,
  totalCount,
}: {
  api: FiltersApi
  searchRef: RefObject<HTMLInputElement | null>
  shownCount: number
  totalCount: number
}) {
  const board = useBoard()
  const { filters, updateFilters, clearFilters } = api
  const active = hasActiveFilters(filters)

  const labels = Object.values(board.labels)
  const members = Object.values(board.members)
  const assigneeOptions = [
    { value: UNASSIGNED, label: 'Unassigned' },
    ...members.map(({ id, name }) => ({ value: id, label: name })),
  ]
  const assigneeName = (id: string) =>
    assigneeOptions.find((option) => option.value === id)?.label ?? id

  return (
    <div className="flex flex-col gap-2">
      <div role="search" className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1 sm:max-w-72">
          <span className="pointer-events-none absolute start-2 top-1/2 flex -translate-y-1/2 text-fg-muted">
            <TIcon icon={Search} size="sm" />
          </span>
          <TInput
            ref={searchRef}
            type="search"
            size="sm"
            value={filters.search}
            placeholder="Search cards"
            aria-label="Search cards"
            className="ps-8"
            onChange={(event) => updateFilters({ search: event.target.value })}
          />
        </div>
        <TSelect
          multiple
          size="sm"
          aria-label="Filter by label"
          placeholder="Label"
          className="w-36"
          options={labels.map(({ id, name }) => ({ value: id, label: name }))}
          value={filters.labelIds}
          onValueChange={(labelIds) => updateFilters({ labelIds })}
        />
        <TSelect
          multiple
          size="sm"
          aria-label="Filter by assignee"
          placeholder="Assignee"
          className="w-36"
          options={assigneeOptions}
          value={filters.assigneeIds}
          onValueChange={(assigneeIds) => updateFilters({ assigneeIds })}
        />
        <TSelect
          multiple
          size="sm"
          aria-label="Filter by priority"
          placeholder="Priority"
          className="w-36"
          options={PRIORITIES.map((value) => ({
            value,
            label: PRIORITY_LABELS[value],
          }))}
          value={filters.priorities}
          onValueChange={(priorities) =>
            updateFilters({ priorities: priorities as Priority[] })
          }
        />
      </div>
      {active && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
          <span role="status">
            Showing {shownCount} of {totalCount} cards
          </span>
          {filters.search.trim() && (
            <FilterChip
              label={`Search: ${filters.search.trim()}`}
              onRemove={() => updateFilters({ search: '' })}
            />
          )}
          {filters.labelIds.map((id) => (
            <FilterChip
              key={id}
              label={`Label: ${board.labels[id]?.name ?? id}`}
              onRemove={() =>
                updateFilters({
                  labelIds: filters.labelIds.filter((other) => other !== id),
                })
              }
            />
          ))}
          {filters.assigneeIds.map((id) => (
            <FilterChip
              key={id}
              label={`Assignee: ${assigneeName(id)}`}
              onRemove={() =>
                updateFilters({
                  assigneeIds: filters.assigneeIds.filter(
                    (other) => other !== id,
                  ),
                })
              }
            />
          ))}
          {filters.priorities.map((priority) => (
            <FilterChip
              key={priority}
              label={`Priority: ${PRIORITY_LABELS[priority]}`}
              onRemove={() =>
                updateFilters({
                  priorities: filters.priorities.filter(
                    (other) => other !== priority,
                  ),
                })
              }
            />
          ))}
          <TButton
            variant="ghost"
            size="sm"
            label="Clear filters"
            onClick={clearFilters}
          />
        </div>
      )}
    </div>
  )
}
