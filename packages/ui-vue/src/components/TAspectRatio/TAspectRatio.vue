<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tAspectRatioVariants } from './TAspectRatio.variants'
import type { TAspectRatioProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TAspectRatioProps>(), { as: 'div' })
const root = useRootAttrs(() => tAspectRatioVariants({ ratio: typeof props.ratio === 'number' ? null : props.ratio }), () => ({ aspectRatio: typeof props.ratio === 'number' ? props.ratio : undefined }))
</script>

<template>
  <Primitive v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
