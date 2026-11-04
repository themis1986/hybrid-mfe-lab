<script setup lang="ts">
import { X } from '@lucide/vue'
import { describeTableFilter } from '@repo/table-core'
import { computed } from 'vue'
import { TButton } from '../TButton'
import {
  tComboboxChipClasses,
  tComboboxChipIconClasses,
  tComboboxChipLabelClasses,
  tComboboxChipRemoveClasses,
} from '../TCombobox/TCombobox.variants'
import { TIcon } from '../TIcon'
import type { EngineTable } from './context'
import { useDataTableContext } from './context'
import { tDataTableChipsClasses } from './TDataTable.variants'

const props = defineProps<{ table: EngineTable }>()
const { labels, locale } = useDataTableContext()

const globalFilter = computed<string>(
  () => props.table.atoms.globalFilter.get() ?? '',
)
const chips = computed(() =>
  props.table.atoms.columnFilters.get().flatMap(({ id, value }) => {
    const column = props.table.getColumn(id)
    const spec = column?.columnDef.meta?.spec
    if (!column || !spec) return []
    const filter = spec.filter
    const description = describeTableFilter(spec, value, {
      labels: labels.value,
      locale: locale.value,
      filterOptions:
        filter?.type === 'select' || filter?.type === 'multiSelect'
          ? filter.options
          : undefined,
    })
    return [{ id, column, description }]
  }),
)
const clearAll = () => {
  props.table.setColumnFilters([])
  props.table.setGlobalFilter('')
}
</script>

<template>
  <div
    v-if="chips.length || globalFilter"
    data-slot="data-table-chips"
    role="group"
    :aria-label="labels.activeFilters"
    :class="tDataTableChipsClasses"
  >
    <span v-if="globalFilter" :class="tComboboxChipClasses">
      <span :class="tComboboxChipLabelClasses">{{ globalFilter }}</span>
      <button
        type="button"
        :aria-label="labels.removeFilter(globalFilter)"
        :class="tComboboxChipRemoveClasses"
        @click="table.setGlobalFilter('')"
      >
        <TIcon :icon="X" :class="tComboboxChipIconClasses" />
      </button>
    </span>
    <span v-for="chip in chips" :key="chip.id" :class="tComboboxChipClasses">
      <span :class="tComboboxChipLabelClasses">{{ chip.description }}</span>
      <button
        type="button"
        :aria-label="labels.removeFilter(chip.description)"
        :class="tComboboxChipRemoveClasses"
        @click="chip.column.setFilterValue(undefined)"
      >
        <TIcon :icon="X" :class="tComboboxChipIconClasses" />
      </button>
    </span>
    <TButton variant="ghost" size="sm" @click="clearAll">
      {{ labels.clearAllFilters }}
    </TButton>
  </div>
</template>
