<script setup lang="ts">
import { TButton } from '@repo/ui-vue'
import { Pencil, Trash2 } from '@repo/ui-vue/icons'
import {
  type TableCellEdit,
  TDataTable,
  type TDataTableColumn,
} from '@repo/ui-vue/table'
import { ref, shallowRef } from 'vue'
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
const data = shallowRef(makePeople(240))
const zebra = ref(false)
const compact = ref(false)
const rtl = ref(false)
const saveEdit = ({ rowId, columnId, value }: TableCellEdit<Person>) => {
  data.value = data.value.map((row) =>
    row.id === rowId ? { ...row, [columnId]: value } : row,
  )
}
</script>

<template>
  <div :dir="rtl ? 'rtl' : undefined">
    <TDataTable
      aria-label="People"
      :data="data"
      :columns="columns"
      :get-row-id="getRowId"
      selection="multiple"
      search
      columns-panel
      :default-state="{ columnPinning: { start: [], end: ['actions'] } }"
      :on-cell-edit="saveEdit"
      :csv-export="{ fileName: 'people.csv' }"
      :zebra="zebra"
      :density="compact ? 'compact' : 'comfortable'"
      :max-height="460"
    >
      <template #toolbar>
        <TButton variant="outline" size="sm" @click="zebra = !zebra"
          >Zebra</TButton
        >
        <TButton variant="outline" size="sm" @click="compact = !compact"
          >Density</TButton
        >
        <TButton variant="outline" size="sm" @click="rtl = !rtl">RTL</TButton>
      </template>
      <template #bulk-actions="{ selectedIds }">
        <TButton variant="outline" size="sm"
          >Archive {{ selectedIds.length }}</TButton
        >
      </template>
    </TDataTable>
  </div>
</template>
