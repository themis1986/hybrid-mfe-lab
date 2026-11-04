<script setup lang="ts">
import { computed } from 'vue'
import { TCheckbox } from '../TCheckbox'
import type { EngineTable } from './context'
import { useDataTableContext } from './context'

const props = defineProps<{ table: EngineTable; scope: 'page' | 'all' }>()
const { labels } = useDataTableContext()

const checked = computed<boolean | 'indeterminate'>(() => {
  const { table, scope } = props
  const all =
    scope === 'all'
      ? table.getIsAllRowsSelected()
      : table.getIsAllPageRowsSelected()
  const some =
    scope === 'all'
      ? table.getIsSomeRowsSelected()
      : table.getIsSomePageRowsSelected()
  return all ? true : some ? 'indeterminate' : false
})

const toggle = (next: boolean | 'indeterminate' | undefined) => {
  if (props.scope === 'all') props.table.toggleAllRowsSelected(next === true)
  else props.table.toggleAllPageRowsSelected(next === true)
}
</script>

<template>
  <TCheckbox
    size="sm"
    tabindex="-1"
    data-t-activate=""
    :aria-label="labels.selectAll"
    :model-value="checked"
    @update:model-value="toggle"
  />
</template>
