import { TBadge, TButton, TProgress } from '@repo/ui'
import { Mail, Star } from '@repo/ui/icons'
import { TIcon } from '@repo/ui'
import {
  TDataTable,
  type TDataTableColumn,
  type TDataTableRowContext,
} from '@repo/ui/table'
import { useMemo } from 'react'
import { makePeople, type Person } from './tableData'

const columns: TDataTableColumn<Person>[] = [
  {
    accessorKey: 'name',
    title: 'Name',
    type: 'avatar',
    width: 240,
    header: ({ title }) => (
      <span>
        <TIcon icon={Star} size="sm" /> {title}
      </span>
    ),
  },
  {
    accessorKey: 'score',
    title: 'Score',
    width: 200,
    cell: ({ value, row }) => (
      <TProgress
        value={value}
        size="sm"
        tone={value > 66 ? 'success' : value > 33 ? 'warning' : 'danger'}
        aria-label={`${row.name}: ${value}`}
      />
    ),
  },
  {
    accessorKey: 'team',
    title: 'Team',
    width: 160,
    aggregate: 'count',
    cell: ({ value }) => <TBadge tone="accent">{value}</TBadge>,
  },
  {
    accessorKey: 'salary',
    title: 'Salary',
    type: 'number',
    aggregate: 'sum',
    number: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  },
  {
    id: 'contact',
    title: 'Contact',
    width: 120,
    cell: ({ tabIndex }) => (
      <TButton variant="ghost" size="sm" tabIndex={tabIndex}>
        <TIcon icon={Mail} size="sm" />
        Write
      </TButton>
    ),
  },
]

const getRowId = (person: Person) => person.id

function Detail({ row }: TDataTableRowContext<Person>) {
  return (
    <p style={{ margin: 0, paddingBlock: 8 + (row.score % 5) * 8 }}>
      {row.name} has been in {row.team} since {row.joined}, and scores{' '}
      {row.score}.
    </p>
  )
}

export default function TableCellsDemo() {
  const data = useMemo(() => makePeople(60), [])
  return (
    <TDataTable
      aria-label="People with custom cells"
      data={data}
      columns={columns}
      getRowId={getRowId}
      renderDetail={(context) => <Detail {...context} />}
      zebra
      maxHeight={420}
    />
  )
}
