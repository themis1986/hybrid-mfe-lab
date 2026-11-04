<script setup lang="ts">
import { TBadge, TButton, TIcon, TProgress } from '@repo/ui-vue'
import { Mail, Star } from '@repo/ui-vue/icons'
import { TDataTable, type TDataTableColumn } from '@repo/ui-vue/table'
import { shallowRef } from 'vue'
import { makePeople, type Person } from './tableData'

const columns: TDataTableColumn<Person>[] = [
  { accessorKey: 'name', title: 'Name', type: 'avatar', width: 240 },
  { accessorKey: 'score', title: 'Score', width: 200 },
  { accessorKey: 'team', title: 'Team', width: 160, aggregate: 'count' },
  {
    accessorKey: 'salary',
    title: 'Salary',
    type: 'number',
    aggregate: 'sum',
    number: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  },
  { id: 'contact', title: 'Contact', width: 120 },
]

const getRowId = (person: Person) => person.id
const data = shallowRef(makePeople(60))
</script>

<template>
  <TDataTable
    aria-label="People with custom cells"
    :data="data"
    :columns="columns"
    :get-row-id="getRowId"
    zebra
    :max-height="420"
  >
    <template #header-name="{ title }">
      <span><TIcon :icon="Star" size="sm" /> {{ title }}</span>
    </template>
    <template #cell-score="{ value, row }">
      <TProgress
        :value="value"
        size="sm"
        :tone="value > 66 ? 'success' : value > 33 ? 'warning' : 'danger'"
        :aria-label="`${row.name}: ${value}`"
      />
    </template>
    <template #cell-team="{ value }">
      <TBadge tone="accent">{{ value }}</TBadge>
    </template>
    <template #cell-contact="{ tabIndex }">
      <TButton variant="ghost" size="sm" :tabindex="tabIndex">
        <TIcon :icon="Mail" size="sm" />
        Write
      </TButton>
    </template>
    <template #detail="{ row }">
      <p :style="{ margin: 0, paddingBlock: `${8 + (row.score % 5) * 8}px` }">
        {{ row.name }} has been in {{ row.team }} since {{ row.joined }}, and
        scores {{ row.score }}.
      </p>
    </template>
  </TDataTable>
</template>
