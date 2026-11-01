<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tCardVariants } from './TCard.variants'
import type { TCardProps } from './types'

defineOptions({ inheritAttrs: false })
// An absent boolean would cast to `false`, so dividers defaults to true explicitly.
const props = withDefaults(defineProps<TCardProps>(), { as: 'div', dividers: true })
const root = useRootAttrs(() =>
  tCardVariants({ variant: props.variant, padding: props.padding, dividers: props.dividers }),
)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
