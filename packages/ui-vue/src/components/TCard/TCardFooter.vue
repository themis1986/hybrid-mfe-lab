<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tCardFooterClasses } from './TCard.variants'
import type { TCardFooterProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TCardFooterProps>(), { as: 'div' })
const root = useRootAttrs(() => tCardFooterClasses)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
