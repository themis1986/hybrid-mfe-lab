<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tDividerVariants } from './TDivider.variants'
import type { TDividerProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TDividerProps>(), { as: 'hr' })
const root = useRootAttrs(() => tDividerVariants({ orientation: props.orientation }))
</script>

<template>
  <!-- <hr> is a separator by default; any other element needs the role spelled out. -->
  <Primitive
    :role="asChild || as !== 'hr' ? 'separator' : undefined"
    :aria-orientation="orientation === 'vertical' ? 'vertical' : undefined"
    v-bind="root()"
    :as="as"
    :as-child="asChild"
  />
</template>
