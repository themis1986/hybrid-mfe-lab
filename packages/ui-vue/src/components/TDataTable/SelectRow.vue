<script setup lang="ts">
import { computed } from 'vue'
import { TCheckbox } from '../TCheckbox'
import type { EngineRow } from './context'
import { useDataTableContext } from './context'

const props = defineProps<{
  row: EngineRow
  isSelected: boolean
  isSomeSelected: boolean
}>()
const { labels } = useDataTableContext()

const checked = computed<boolean | 'indeterminate'>(() =>
  props.isSelected ? true : props.isSomeSelected ? 'indeterminate' : false,
)

// The checkbox's change event carries no pointer event, and the engine's range selection reads Shift from one.
let shift = false
const onClick = (event: MouseEvent) => {
  shift = event.shiftKey
}
const toggle = (next: boolean | 'indeterminate' | undefined) => {
  props.row.getToggleSelectedHandler()({
    target: { checked: next === true },
    shiftKey: shift,
  })
}
</script>

<template>
  <TCheckbox
    size="sm"
    tabindex="-1"
    data-t-select=""
    data-t-activate=""
    :aria-label="labels.selectRow"
    :disabled="!row.getCanSelect()"
    :model-value="checked"
    @click="onClick"
    @update:model-value="toggle"
  />
</template>
