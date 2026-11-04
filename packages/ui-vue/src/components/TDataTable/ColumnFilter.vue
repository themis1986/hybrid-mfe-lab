<script setup lang="ts">
import { ListFilter } from '@lucide/vue'
import type { TableColumnFilter } from '@repo/table-core'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  TPopover,
  TPopoverContent,
  TPopoverFooter,
  TPopoverTrigger,
} from '../TPopover'
import type { EngineColumn } from './context'
import { useDataTableContext } from './context'
import FilterForm from './FilterForm.vue'
import {
  tDataTableFilterFormClasses,
  tDataTableHeadButtonClasses,
} from './TDataTable.variants'

// The filter button of a header, and its panel.
defineProps<{
  column: EngineColumn
  filter: TableColumnFilter<any>
  title: string
}>()
const { labels } = useDataTableContext()
</script>

<template>
  <TPopover>
    <TPopoverTrigger as-child>
      <TButton
        variant="ghost"
        size="sm"
        tabindex="-1"
        data-no-reorder=""
        :data-active="column.getIsFiltered() ? '' : undefined"
        :aria-label="labels.filterColumn(title)"
        :class="tDataTableHeadButtonClasses"
      >
        <TIcon :icon="ListFilter" size="sm" />
      </TButton>
    </TPopoverTrigger>
    <TPopoverContent
      size="sm"
      :title="labels.filterColumn(title)"
      :close-label="labels.closePanel"
    >
      <div :class="tDataTableFilterFormClasses">
        <FilterForm :column="column" :filter="filter" :title="title" />
      </div>
      <TPopoverFooter>
        <TButton
          variant="ghost"
          size="sm"
          :disabled="!column.getIsFiltered()"
          @click="column.setFilterValue(undefined)"
        >
          {{ labels.clearFilter }}
        </TButton>
      </TPopoverFooter>
    </TPopoverContent>
  </TPopover>
</template>
