<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tContainerVariants } from './TContainer.variants'
import type { TContainerProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TContainerProps>(), { as: 'div' })
const root = useRootAttrs(() => tContainerVariants({ size: props.size }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
