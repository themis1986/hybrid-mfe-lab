<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tScrollAreaVariants } from './TScrollArea.variants'
import type { TScrollAreaProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TScrollAreaProps>(), { as: 'div' })
const root = useRootAttrs(() => tScrollAreaVariants({ orientation: props.orientation }), () => ({ maxHeight: props.maxHeight }))
</script>

<!--
  A scrollable region must be reachable by keyboard, so it is focusable by default (a caller's own
  tabindex wins: it is bound after). Callers should also pass role="region" and an aria-label.
-->
<template>
  <Primitive tabindex="0" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
