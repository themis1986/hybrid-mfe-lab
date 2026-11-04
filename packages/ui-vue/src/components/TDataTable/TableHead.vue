<script setup lang="ts">
import { TABLE_HEADER_ROW } from '@repo/table-core'
import { computed } from 'vue'
import type { EngineTable } from './context'
import HeadCell from './HeadCell.vue'
import {
  tDataTableHeadClasses,
  tDataTableHeadFillerClasses,
  tDataTableHeadRowClasses,
} from './TDataTable.variants'

const props = defineProps<{
  table: EngineTable
  sticky: boolean
  scope: 'page' | 'all'
}>()

const headers = computed(() => props.table.getHeaderGroups()[0]?.headers ?? [])
const fillerAt = computed(() => {
  const firstEnd = headers.value.findIndex(
    (header) => header.column.getIsPinned() === 'end',
  )
  return firstEnd < 0 ? headers.value.length : firstEnd
})

const element = defineModel<HTMLElement | null>('element')
</script>

<template>
  <thead
    :ref="(value) => (element = value as HTMLElement | null)"
    role="rowgroup"
    :data-sticky="sticky ? '' : undefined"
    :class="tDataTableHeadClasses"
  >
    <tr
      role="row"
      aria-rowindex="1"
      :data-row-key="TABLE_HEADER_ROW"
      :class="tDataTableHeadRowClasses"
    >
      <template v-for="(header, index) in headers" :key="header.id">
        <th
          v-if="index === fillerAt"
          role="presentation"
          :class="tDataTableHeadFillerClasses"
        />
        <HeadCell
          :table="table"
          :header="header"
          :index="index"
          :scope="scope"
        />
      </template>
      <th
        v-if="fillerAt === headers.length"
        role="presentation"
        :class="tDataTableHeadFillerClasses"
      />
    </tr>
  </thead>
</template>
