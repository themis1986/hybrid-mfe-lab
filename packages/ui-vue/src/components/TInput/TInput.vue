<script setup lang="ts">
import { useRootAttrs } from '../../lib/attrs'
import { tInputVariants } from './TInput.variants'
import type { TInputProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<TInputProps>()
// v-model; without one, the input keeps its own value.
const model = defineModel<string>()
const root = useRootAttrs(() => tInputVariants({ size: props.size }))
</script>

<template>
  <input v-model="model" :aria-invalid="invalid || undefined" v-bind="root()" />
</template>
