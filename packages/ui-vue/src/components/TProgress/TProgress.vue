<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { tProgressIndicatorVariants, tProgressVariants } from './TProgress.variants'
import type { TProgressProps } from './types'

// A progress bar (Reka Progress): `value` out of `max` (100); null or no value is indeterminate. Name it
// with `aria-label`, and `getValueLabel` for a spoken value other than the percentage.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TProgressProps>(), { max: 100 })
const root = useRootAttrs(() => tProgressVariants({ size: props.size }))
const percent = computed(() =>
  props.value == null ? undefined : Math.min(100, Math.max(0, (props.value / props.max) * 100)),
)
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="root()"
    :model-value="value ?? null"
    :max="max"
    :get-value-label="getValueLabel"
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      :class="tProgressIndicatorVariants({ tone })"
      :style="percent === undefined ? undefined : { translate: `${percent - 100}% 0` }"
    />
  </ProgressRoot>
</template>
