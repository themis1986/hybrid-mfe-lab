import { TButton } from '@repo/ui'
import { Pencil, Trash2 } from '@repo/ui/icons'
import { TDataTable, type TDataTableColumn } from '@repo/ui/table'
import { useState } from 'react'
import {
  makePeople,
  type Person,
  STATUS_OPTIONS,
  TEAM_OPTIONS,
} from './tableData'

const columns: TDataTableColumn<Person>[] = [
  {
    accessorKey: 'name',
    title: 'Name',
    type: 'avatar',
    width: 220,
    filter: { type: 'text' },
  },
  {
    accessorKey: 'team',
    title: 'Team',
    filter: { type: 'multiSelect', options: TEAM_OPTIONS },
    editable: true,
    editorOptions: TEAM_OPTIONS,
  },
  {
    accessorKey: 'status',
    title: 'Status',
    type: 'badge',
    badge: {
      tones: { active: 'success', away: 'warning', left: 'neutral' },
      labels: { active: 'Active', away: 'Away', left: 'Left' },
    },
    filter: { type: 'select', options: STATUS_OPTIONS },
  },
  {
    accessorKey: 'salary',
    title: 'Salary',
    type: 'number',
    number: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
    filter: { type: 'numberRange', step: 1000 },
    aggregate: 'sum',
    editable: true,
  },
  {
    accessorKey: 'score',
    title: 'Score',
    type: 'progress',
  },
  {
    accessorKey: 'joined',
    title: 'Joined',
    type: 'date',
    filter: { type: 'dateRange' },
  },
  {
    id: 'actions',
    title: 'Actions',
    type: 'actions',
    resizable: false,
    actions: () => [
      { id: 'edit', label: 'Edit', icon: Pencil, onSelect: () => {} },
      {
        id: 'delete',
        label: 'Delete',
        icon: Trash2,
        tone: 'danger',
        onSelect: () => {},
      },
    ],
  },
]

const getRowId = (person: Person) => person.id

export default function TableBasicDemo() {
  const [data, setData] = useState(() => makePeople(240))
  const [zebra, setZebra] = useState(false)
  const [compact, setCompact] = useState(false)
  const [rtl, setRtl] = useState(false)
  return (
    <div dir={rtl ? 'rtl' : undefined}>
      <TDataTable
        aria-label="People"
        data={data}
        columns={columns}
        getRowId={getRowId}
        selection="multiple"
        search
        columnsPanel
        defaultState={{ columnPinning: { start: [], end: ['actions'] } }}
        onCellEdit={({ rowId, columnId, value }) =>
          setData((rows) =>
            rows.map((row) =>
              row.id === rowId ? { ...row, [columnId]: value } : row,
            ),
          )
        }
        csvExport={{ fileName: 'people.csv' }}
        zebra={zebra}
        density={compact ? 'compact' : 'comfortable'}
        maxHeight={460}
        renderToolbar={() => (
          <>
            <TButton
              variant="outline"
              size="sm"
              onClick={() => setZebra(!zebra)}
            >
              Zebra
            </TButton>
            <TButton
              variant="outline"
              size="sm"
              onClick={() => setCompact(!compact)}
            >
              Density
            </TButton>
            <TButton variant="outline" size="sm" onClick={() => setRtl(!rtl)}>
              RTL
            </TButton>
          </>
        )}
        renderBulkActions={({ selectedIds }) => (
          <TButton variant="outline" size="sm">
            Archive {selectedIds.length}
          </TButton>
        )}
      />
    </div>
  )
}
