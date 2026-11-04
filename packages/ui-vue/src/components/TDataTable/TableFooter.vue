<script setup lang="ts">
import { computed } from 'vue'
import { TPagination } from '../TPagination'
import { TSelect } from '../TSelect'
import type { EngineTable } from './context'
import { useDataTableContext } from './context'
import {
  tDataTableFooterClasses,
  tDataTableFooterSizeClasses,
  tDataTablePagerClasses,
  tDataTablePageSizeClasses,
  tDataTableRangeClasses,
} from './TDataTable.variants'

const props = defineProps<{
  table: EngineTable
  pageSizes: readonly number[]
  disabled: boolean
}>()
const { labels } = useDataTableContext()

const pagination = computed(() => props.table.atoms.pagination.get())
const total = computed(() => props.table.getRowCount())
const from = computed(() =>
  total.value === 0
    ? 0
    : pagination.value.pageIndex * pagination.value.pageSize + 1,
)
const to = computed(() =>
  Math.min(
    total.value,
    (pagination.value.pageIndex + 1) * pagination.value.pageSize,
  ),
)
const options = computed(() =>
  props.pageSizes.map((size) => ({
    value: String(size),
    label: String(size),
  })),
)
</script>

<template>
  <div data-slot="data-table-footer" :class="tDataTableFooterClasses">
    <div :class="tDataTableFooterSizeClasses">
      <span>{{ labels.rowsPerPage }}</span>
      <TSelect
        size="sm"
        :aria-label="labels.rowsPerPage"
        :options="options"
        :model-value="String(pagination.pageSize)"
        :disabled="disabled"
        :class="tDataTablePageSizeClasses"
        @update:model-value="table.setPageSize(Number($event))"
      />
    </div>
    <span :class="tDataTableRangeClasses" aria-live="polite">
      {{ labels.rowRange(from, to, total) }}
    </span>
    <TPagination
      size="sm"
      :page="pagination.pageIndex + 1"
      :total="total"
      :items-per-page="pagination.pageSize"
      :disabled="disabled"
      :labels="labels.pagination"
      :class="tDataTablePagerClasses"
      @update:page="table.setPageIndex(($event ?? 1) - 1)"
    />
  </div>
</template>
