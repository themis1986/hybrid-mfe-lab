<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { TInput } from '../TInput'
import type { EngineTable } from './context'
import { useDataTableContext } from './context'
import { tDataTableSearchClasses } from './TDataTable.variants'

const SEARCH_DELAY = 200

const props = defineProps<{ table: EngineTable }>()
const { labels } = useDataTableContext()

const applied = computed<string>(
  () => props.table.atoms.globalFilter.get() ?? '',
)
const text = ref(applied.value)
watch(applied, (next) => {
  text.value = next
})

let timer: ReturnType<typeof setTimeout> | undefined
const onInput = (next: string | undefined) => {
  text.value = next ?? ''
  clearTimeout(timer)
  timer = setTimeout(
    () => props.table.setGlobalFilter(text.value),
    SEARCH_DELAY,
  )
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <TInput
    type="search"
    size="sm"
    :aria-label="labels.search"
    :placeholder="labels.searchPlaceholder"
    :model-value="text"
    :class="tDataTableSearchClasses"
    @update:model-value="onInput"
  />
</template>
