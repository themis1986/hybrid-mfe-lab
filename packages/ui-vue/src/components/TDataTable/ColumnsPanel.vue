<script setup lang="ts">
import { ChevronLeft, ChevronRight, Columns3 } from '@lucide/vue'
import { moveTableColumn } from '@repo/table-core'
import { computed } from 'vue'
import { TButton } from '../TButton'
import { TCheckbox } from '../TCheckbox'
import { TIcon } from '../TIcon'
import {
  TPopover,
  TPopoverContent,
  TPopoverFooter,
  TPopoverTrigger,
} from '../TPopover'
import type { EngineTable } from './context'
import { useDataTableContext } from './context'
import {
  tDataTableColumnsItemClasses,
  tDataTableColumnsLabelClasses,
  tDataTableColumnsListClasses,
  tDataTableColumnsTitleClasses,
  tDataTableMoveClasses,
} from './TDataTable.variants'

// Show, hide and move columns: also the way to reorder them from the keyboard or on touch.
const props = defineProps<{ table: EngineTable }>()
const { labels } = useDataTableContext()

const all = computed(() => props.table.getAllLeafColumns())
const columns = computed(() =>
  all.value.filter((column) => column.columnDef.meta?.spec),
)

// The neighbour in the column's own pin region: moving across one has no effect on screen.
const neighbourOf = (index: number, direction: 1 | -1) => {
  const region = columns.value[index]?.getIsPinned()
  let next = index + direction
  while (columns.value[next] && columns.value[next]!.getIsPinned() !== region) {
    next += direction
  }
  return columns.value[next]
}
const move = (index: number, direction: 1 | -1) => {
  const column = columns.value[index]
  const neighbour = neighbourOf(index, direction)
  if (!column || !neighbour) return
  props.table.setColumnOrder(
    moveTableColumn(
      all.value.map((item) => item.id),
      column.id,
      neighbour.id,
      direction === 1 ? 'after' : 'before',
    ),
  )
}
</script>

<template>
  <TPopover>
    <TPopoverTrigger as-child>
      <TButton variant="outline" size="sm">
        <TIcon :icon="Columns3" size="sm" />
        {{ labels.columns }}
      </TButton>
    </TPopoverTrigger>
    <TPopoverContent
      size="sm"
      align="end"
      :title="labels.columns"
      :close-label="labels.closePanel"
    >
      <ul :class="tDataTableColumnsListClasses">
        <li
          v-for="(column, index) in columns"
          :key="column.id"
          :class="tDataTableColumnsItemClasses"
        >
          <label :class="tDataTableColumnsLabelClasses">
            <TCheckbox
              size="sm"
              :model-value="column.getIsVisible()"
              :disabled="!column.getCanHide()"
              @update:model-value="column.toggleVisibility($event === true)"
            />
            <span :class="tDataTableColumnsTitleClasses">
              {{ column.columnDef.meta?.spec?.title ?? column.id }}
            </span>
          </label>
          <TButton
            variant="ghost"
            size="sm"
            :disabled="!neighbourOf(index, -1)"
            :aria-label="
              labels.moveColumnEarlier(
                column.columnDef.meta?.spec?.title ?? column.id,
              )
            "
            :class="tDataTableMoveClasses"
            @click="move(index, -1)"
          >
            <TIcon :icon="ChevronLeft" size="sm" />
          </TButton>
          <TButton
            variant="ghost"
            size="sm"
            :disabled="!neighbourOf(index, 1)"
            :aria-label="
              labels.moveColumnLater(
                column.columnDef.meta?.spec?.title ?? column.id,
              )
            "
            :class="tDataTableMoveClasses"
            @click="move(index, 1)"
          >
            <TIcon :icon="ChevronRight" size="sm" />
          </TButton>
        </li>
      </ul>
      <TPopoverFooter>
        <TButton
          variant="ghost"
          size="sm"
          @click="table.toggleAllColumnsVisible(true)"
        >
          {{ labels.showAllColumns }}
        </TButton>
      </TPopoverFooter>
    </TPopoverContent>
  </TPopover>
</template>
