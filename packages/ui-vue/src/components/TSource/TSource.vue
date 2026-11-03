<script setup lang="ts">
import { watch } from 'vue'
import { useMapContext } from '../TMapView/context'
import type { TSourceProps } from './types'

// Escape hatch: any source spec the engine accepts. Draw it with TLayer (in the default slot or anywhere
// else in the map: a layer waits for its source).
const props = defineProps<TSourceProps>()
const { layers } = useMapContext('TSource')
const owner = {}

watch(
  () => props.id,
  (id, _, onCleanup) => {
    layers.addSource(owner, id, props.spec)
    onCleanup(() => layers.removeSource(owner, id))
  },
  { immediate: true },
)

watch(
  () => props.spec,
  (spec) => layers.updateSource(owner, props.id, spec),
)
</script>

<template><slot /></template>
