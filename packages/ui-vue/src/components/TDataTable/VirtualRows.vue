<script setup lang="ts">
import { type TableDisplayItem, withRetainedTableRows } from '@repo/table-core'
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/vue-virtual'
import { computed, onMounted, onUpdated, type Ref } from 'vue'
import type { EngineRow } from './context'
import { useDataTableContext } from './context'
import DetailRow from './DetailRow.vue'
import { tDataTableBodyClasses } from './TDataTable.variants'
import TableRow from './TableRow.vue'

// A component of its own: scrolling re-renders this and nothing above it.
const props = defineProps<{
  items: TableDisplayItem<EngineRow>[]
  zebra: boolean
  hover: boolean
  refetching: boolean
  pageOffset: number
  selectable: boolean
  hierarchical: boolean
  expanderColumnId?: string
  scroller: HTMLElement | null
  headerHeight: number
  estimateRowHeight: number
  overscan: number
  activeRowKey: () => string | null
  activeVersion: number
  scrollToItem: Ref<(index: number) => void>
}>()
const emit = defineEmits<{ rendered: [] }>()
const { editing } = useDataTableContext()

const indexByKey = computed(
  () => new Map(props.items.map((item) => [item.key, item.index])),
)

const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(
  computed(() => {
    // Read here, so a change of active row or edit recomputes which rows stay mounted.
    void props.activeVersion
    const editingRow = editing.value?.rowId
    return {
      count: props.items.length,
      getScrollElement: () => props.scroller,
      estimateSize: () => props.estimateRowHeight,
      overscan: props.overscan,
      getItemKey: (index: number) => props.items[index]?.key ?? index,
      // The rows start after the header, which sits in the same scroller.
      scrollMargin: props.headerHeight,
      rangeExtractor: (range: Parameters<typeof defaultRangeExtractor>[0]) => {
        const active = props.activeRowKey()
        return withRetainedTableRows(defaultRangeExtractor(range), [
          active === null ? undefined : indexByKey.value.get(active),
          editingRow ? indexByKey.value.get(editingRow) : undefined,
        ])
      },
    }
  }),
)

const virtualRows = computed(() =>
  virtualizer.value.getVirtualItems().flatMap((virtualItem) => {
    const item = props.items[virtualItem.index]
    return item ? [{ item, start: virtualItem.start - props.headerHeight }] : []
  }),
)
const totalHeight = computed(
  () => virtualizer.value.getTotalSize() - props.headerHeight,
)
const measure = (element: Element | null) => {
  if (element) virtualizer.value.measureElement(element as HTMLElement)
}

// The root reaches the virtualizer through this.
props.scrollToItem.value = (index) =>
  virtualizer.value.scrollToIndex(index, { align: 'auto' })

onMounted(() => emit('rendered'))
onUpdated(() => emit('rendered'))
</script>

<template>
  <tbody
    role="rowgroup"
    :data-refetching="refetching ? '' : undefined"
    :class="tDataTableBodyClasses"
    :style="{ height: `${totalHeight}px` }"
  >
    <template v-for="{ item, start } in virtualRows" :key="item.key">
      <DetailRow
        v-if="item.kind === 'detail'"
        :row="item.row"
        :row-index="pageOffset + item.index + 2"
        :is-selected="item.row.getIsSelected()"
        :zebra="zebra && item.index % 2 === 1"
        :virtual-start="start"
        :virtual-index="item.index"
        :measure="measure"
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
        :virtual-start="start"
        :virtual-index="item.index"
        :measure="measure"
      />
    </template>
  </tbody>
</template>
