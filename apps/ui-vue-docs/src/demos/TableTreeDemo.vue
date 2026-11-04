<script setup lang="ts">
import { TDataTable, type TDataTableColumn } from '@repo/ui-vue/table'
import { shallowRef } from 'vue'
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
const data = shallowRef(makeTree())
</script>

<template>
  <TDataTable
    aria-label="People by team"
    :data="data"
    :columns="columns"
    :get-row-id="getRowId"
    :get-sub-rows="getSubRows"
    selection="multiple"
    :default-state="{ expanded: { 'team-0': true } }"
    :pagination="false"
    :max-height="420"
  />
</template>
