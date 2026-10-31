<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tCardBodyClasses } from './TCard.variants'
import type { TCardBodyProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TCardBodyProps>(), { as: 'div' })
const root = useRootAttrs(() => tCardBodyClasses)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
