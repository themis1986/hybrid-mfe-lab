import { TButton, TSwitch } from '@repo/ui'
import {
  parseTableState,
  serializeTableState,
  TDataTable,
  type TDataTableColumn,
  type TableState,
} from '@repo/ui/table'
import { useCallback, useEffect, useState } from 'react'
import { fetchPeople, type Person, STATUS_OPTIONS } from './tableData'

const columns: TDataTableColumn<Person>[] = [
  { accessorKey: 'name', title: 'Name', type: 'avatar', width: 240 },
  {
    accessorKey: 'status',
    title: 'Status',
    type: 'badge',
    badge: {
      tones: { active: 'success', away: 'warning', left: 'neutral' },
      labels: { active: 'Active', away: 'Away', left: 'Left' },
    },
    filter: { type: 'multiSelect', options: STATUS_OPTIONS },
  },
  { accessorKey: 'team', title: 'Team' },
  {
    accessorKey: 'salary',
    title: 'Salary',
    type: 'number',
    number: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  },
]

const getRowId = (person: Person) => person.id
const STORAGE_KEY = 't-docs-table-state'

function readStoredState(): Partial<TableState> {
  try {
    return parseTableState(localStorage.getItem(STORAGE_KEY), columns)
  } catch {
    return {}
  }
}

export default function TableServerDemo() {
  const [state, setState] = useState<Partial<TableState>>(() => ({
    pagination: { pageIndex: 0, pageSize: 10 },
    ...readStoredState(),
  }))
  const [result, setResult] = useState<{ rows: Person[]; total: number }>()
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<unknown>()
  const [failNext, setFailNext] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const statusFilter = state.columnFilters?.find(
    (filter) => filter.id === 'status',
  )
  const { pagination, sorting, globalFilter } = state

  useEffect(() => {
    let current = true
    setFetching(true)
    fetchPeople(
      {
        pageIndex: pagination?.pageIndex ?? 0,
        pageSize: pagination?.pageSize ?? 10,
        sorting: sorting ?? [],
        search: globalFilter ?? '',
        statuses: (statusFilter?.value as string[] | undefined) ?? [],
      },
      { fail: failNext },
    ).then(
      (next) => {
        if (!current) return
        setResult(next)
        setError(undefined)
        setFetching(false)
      },
      (reason: unknown) => {
        if (!current) return
        setError(reason)
        setFetching(false)
      },
    )
    return () => {
      current = false
    }
  }, [pagination, sorting, globalFilter, statusFilter, failNext, attempt])

  const onStateChange = useCallback((next: TableState) => {
    setState(next)
    try {
      localStorage.setItem(STORAGE_KEY, serializeTableState(next))
    } catch {
      // Private window: the state just isn't kept.
    }
  }, [])

  return (
    <TDataTable
      aria-label="People on a server"
      mode="server"
      data={result?.rows ?? []}
      rowCount={result?.total ?? 0}
      columns={columns}
      getRowId={getRowId}
      state={state}
      onStateChange={onStateChange}
      selection="multiple"
      search
      maxHeight={420}
      loading={fetching && !result && !error}
      refetching={fetching && Boolean(result)}
      error={error}
      onRetry={() => {
        setFailNext(false)
        setAttempt((value) => value + 1)
      }}
      renderToolbar={() => (
        <>
          <TSwitch
            aria-label="Fail the next request"
            checked={failNext}
            onCheckedChange={setFailNext}
          />
          <TButton
            variant="outline"
            size="sm"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Refetch
          </TButton>
        </>
      )}
    />
  )
}
