<script setup lang="ts">
import { useRootAttrs } from '../../lib/attrs'
import {
  tSpinnerSvgClasses,
  tSpinnerTrackClasses,
  tSpinnerVariants,
} from './TSpinner.variants'
import type { TSpinnerProps } from './types'

// A loading indicator. The label sits in a role="status" region as visually hidden text, which screen
// readers announce more reliably than an aria-label. Pass aria-hidden when visible text nearby already
// says what is loading.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TSpinnerProps>(), { label: 'Loading' })
const root = useRootAttrs(() => tSpinnerVariants({ size: props.size }))
</script>

<template>
  <span role="status" data-slot="spinner" v-bind="root()">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      :class="tSpinnerSvgClasses"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        :class="tSpinnerTrackClasses"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
