<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tStackVariants } from './TStack.variants'
import type { TStackProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TStackProps>(), { as: 'div' })
const root = useRootAttrs(() => tStackVariants({ gap: props.gap, align: props.align, justify: props.justify }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
