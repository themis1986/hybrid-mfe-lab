<script setup lang="ts">
import { type TableDisplayItem, tableCellVars } from '@repo/table-core'
import { computed, onMounted, onUpdated, type Ref } from 'vue'
import { TButton } from '../TButton'
import { TSkeleton } from '../TSkeleton'
import { CellContent } from './CellContent'
import type { EngineRow, EngineTable } from './context'
import { useDataTableContext } from './context'
import DetailRow from './DetailRow.vue'
import FullRow from './FullRow.vue'
import {
  tDataTableBodyClasses,
  tDataTableCellClasses,
  tDataTableCellFillerClasses,
  tDataTableRowClasses,
} from './TDataTable.variants'
import TableRow from './TableRow.vue'
import VirtualRows from './VirtualRows.vue'

const SKELETON_ROWS = 8

const props = defineProps<{
  table: EngineTable
  items: TableDisplayItem<EngineRow>[]
  zebra: boolean
  hover: boolean
  loading: boolean
  refetching: boolean
  error: unknown
  pageOffset: number
  selectable: boolean
  hierarchical: boolean
  expanderColumnId?: string
  virtual?: {
    scroller: HTMLElement | null
    headerHeight: number
    estimateRowHeight: number
    overscan: number
    activeRowKey: () => string | null
    activeVersion: number
    scrollToItem: Ref<(index: number) => void>
  }
}>()
const emit = defineEmits<{ rendered: []; retry: [] }>()
const { labels, slots } = useDataTableContext()

onMounted(() => emit('rendered'))
onUpdated(() => emit('rendered'))

const hasError = computed(
  () =>
    props.error !== undefined && props.error !== null && props.error !== false,
)
const filtered = computed(
  () =>
    props.table.atoms.columnFilters.get().length > 0 ||
    Boolean(props.table.atoms.globalFilter.get()),
)
const skeletonCount = computed(() =>
  Math.min(props.table.atoms.pagination.get().pageSize, SKELETON_ROWS),
)
const skeletonColumns = computed(() => props.table.getVisibleLeafColumns())
const showVirtual = computed(
  () =>
    props.virtual &&
    !props.loading &&
    !hasError.value &&
    props.items.length > 0,
)
</script>

<template>
  <VirtualRows
    v-if="showVirtual && virtual"
    :items="items"
    :zebra="zebra"
    :hover="hover"
    :refetching="refetching"
    :page-offset="pageOffset"
    :selectable="selectable"
    :hierarchical="hierarchical"
    :expander-column-id="expanderColumnId"
    v-bind="virtual"
    @rendered="emit('rendered')"
  />
  <tbody
    v-else
    role="rowgroup"
    :data-refetching="refetching ? '' : undefined"
    :class="tDataTableBodyClasses"
  >
    <template v-if="loading">
      <tr
        v-for="rowIndex in skeletonCount"
        :key="rowIndex"
        role="row"
        aria-hidden="true"
        :class="tDataTableRowClasses"
      >
        <td
          v-for="column in skeletonColumns"
          :key="column.id"
          role="presentation"
          :class="tDataTableCellClasses"
          :data-pin="column.getIsPinned() || undefined"
          :style="
            tableCellVars(
              column.columnDef.meta?.index ?? 0,
              column.getIsPinned(),
            )
          "
        >
          <TSkeleton />
        </td>
        <td role="presentation" :class="tDataTableCellFillerClasses" />
      </tr>
    </template>
    <FullRow v-else-if="hasError" row-key="__error">
      <CellContent
        v-if="slots.error"
        :render="slots.error"
        :context="{ error, retry: () => emit('retry') }"
      />
      <template v-else>
        <span>{{ labels.error }}</span>
        <TButton variant="outline" size="sm" @click="emit('retry')">
          {{ labels.retry }}
        </TButton>
      </template>
    </FullRow>
    <FullRow v-else-if="!items.length" row-key="__empty">
      <CellContent
        v-if="slots.empty"
        :render="slots.empty"
        :context="undefined"
      />
      <template v-else>
        {{ filtered ? labels.emptyFiltered : labels.empty }}
      </template>
    </FullRow>
    <template v-else>
      <template v-for="item in items" :key="item.key">
        <DetailRow
          v-if="item.kind === 'detail'"
          :row="item.row"
          :row-index="pageOffset + item.index + 2"
          :is-selected="item.row.getIsSelected()"
          :zebra="zebra && item.index % 2 === 1"
        />
        <TableRow
          v-else
          :row="item.row"
          :row-index="pageOffset + item.index + 2"
          :is-selected="item.row.getIsSelected()"
          :is-some-selected="item.row.getIsSomeSelected()"
          :is-expanded="item.row.getIsExpanded()"
          :can-expand="item.row.getCanExpand()"
          :selectable="selectable"
          :zebra="zebra && item.index % 2 === 1"
          :hover="hover"
          :hierarchical="hierarchical"
          :expander-column-id="expanderColumnId"
          :position-in-set="item.positionInSet"
          :set-size="item.setSize"
        />
      </template>
    </template>
  </tbody>
</template>
