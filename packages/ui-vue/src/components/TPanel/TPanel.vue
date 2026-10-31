<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tPanelTitleClasses, tPanelVariants } from './TPanel.variants'
import type { TPanelProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TPanelProps>(), { as: 'div' })
const root = useRootAttrs(() => tPanelVariants({ tone: props.tone, padding: props.padding }))
</script>

<template>
  <Primitive v-bind="root()" :as="as">
    <p v-if="title || $slots.title" :class="tPanelTitleClasses">
      <slot name="title">{{ title }}</slot>
    </p>
    <slot />
  </Primitive>
</template>
