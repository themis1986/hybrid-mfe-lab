<script setup lang="ts">
import { useRootAttrs } from '../../lib/attrs'
import { tIconVariants } from './TIcon.variants'
import type { TIconProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<TIconProps>()
const root = useRootAttrs(() => tIconVariants({ size: props.size }))
</script>

<template>
  <!-- Lucide hides an icon (aria-hidden) unless it receives an accessibility attribute. -->
  <component
    :is="icon"
    data-slot="icon"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    v-bind="root()"
  />
</template>
