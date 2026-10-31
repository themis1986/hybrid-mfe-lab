<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tButtonVariants } from './TButton.variants'
import type { TButtonProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TButtonProps>(), { as: 'button' })
const root = useRootAttrs(() => tButtonVariants({ variant: props.variant, size: props.size }))
</script>

<template>
  <Primitive
    :type="!asChild && as === 'button' ? 'button' : undefined"
    v-bind="root()"
    :as="as"
    :as-child="asChild"
  >
    <slot>{{ label }}</slot>
  </Primitive>
</template>
