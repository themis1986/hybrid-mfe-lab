<script setup lang="ts">
import { TDataTable, type TDataTableColumn } from '@repo/ui-vue/table'
import { shallowRef } from 'vue'
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
    width: 160,
    number: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
    filter: { type: 'numberRange' },
  },
  { accessorKey: 'score', title: 'Score', type: 'progress', width: 220 },
  { accessorKey: 'joined', title: 'Joined', type: 'date', width: 180 },
  { id: 'id', accessorKey: 'id', title: 'Id', width: 160 },
]

const getRowId = (person: Person) => person.id
const data = shallowRef(makePeople(100_000))
</script>

<template>
  <TDataTable
    aria-label="One hundred thousand people"
    :data="data"
    :columns="columns"
    :get-row-id="getRowId"
    selection="multiple"
    search
    columns-panel
    virtualized
    :pagination="false"
    :max-height="520"
    :default-state="{ columnPinning: { start: ['name'], end: ['id'] } }"
  >
    <template #detail="{ row }">
      <p :style="{ margin: 0, paddingBlock: `${8 + (row.score % 5) * 10}px` }">
        {{ row.name }} has been in {{ row.team }} since {{ row.joined }}.
      </p>
    </template>
  </TDataTable>
</template>
