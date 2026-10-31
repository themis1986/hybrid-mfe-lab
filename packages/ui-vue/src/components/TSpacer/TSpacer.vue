<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tSpacerClasses } from './TSpacer.variants'
import type { TSpacerProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TSpacerProps>(), { as: 'div' })
const root = useRootAttrs(() => tSpacerClasses)
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
  </Primitive>
</template>
