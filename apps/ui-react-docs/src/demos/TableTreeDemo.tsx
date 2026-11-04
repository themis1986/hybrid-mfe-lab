import { TDataTable, type TDataTableColumn } from '@repo/ui/table'
import { useMemo } from 'react'
import { makeTree, type Person } from './tableData'

const columns: TDataTableColumn<Person>[] = [
  { accessorKey: 'name', title: 'Name', width: 300, filter: { type: 'text' } },
  { accessorKey: 'team', title: 'Team' },
  {
    accessorKey: 'salary',
    title: 'Salary',
    type: 'number',
    number: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  },
  { accessorKey: 'joined', title: 'Joined', type: 'date' },
]

const getRowId = (person: Person) => person.id
const getSubRows = (person: Person) => person.children

export default function TableTreeDemo() {
  const data = useMemo(() => makeTree(), [])
  return (
    <TDataTable
      aria-label="People by team"
      data={data}
      columns={columns}
      getRowId={getRowId}
      getSubRows={getSubRows}
      selection="multiple"
      defaultState={{ expanded: { 'team-0': true } }}
      pagination={false}
      maxHeight={420}
    />
  )
}
