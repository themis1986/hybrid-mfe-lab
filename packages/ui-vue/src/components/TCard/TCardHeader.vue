<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tCardHeaderClasses } from './TCard.variants'
import type { TCardHeaderProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TCardHeaderProps>(), { as: 'div' })
const root = useRootAttrs(() => tCardHeaderClasses)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
