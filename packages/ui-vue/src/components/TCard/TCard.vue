<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tCardVariants } from './TCard.variants'
import type { TCardProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TCardProps>(), { as: 'div' })
const root = useRootAttrs(() => tCardVariants({ variant: props.variant, padding: props.padding }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
