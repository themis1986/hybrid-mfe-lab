<script setup lang="ts">
import { computed } from 'vue'
import { formatChange, trendOf } from '../lib/format'

// A plain SVG line, not a chart: the table shows up to 100 of these at once, and a chart engine instance per
// row would cost far more than the shape is worth. The exact figures sit in the row's other cells.
const props = defineProps<{
  values: number[]
  /** The coin's name, for the accessible label. */
  name: string
  /** The 7-day change, which sets the colour. */
  change: number | null
}>()

const MAX_POINTS = 48
const WIDTH = 100
const HEIGHT = 32
/** Keeps the line's stroke inside the box at its extremes. */
const INSET = 2

const points = computed(() => {
  const { values } = props
  if (values.length < 2) return ''
  const step = Math.max(1, Math.floor(values.length / MAX_POINTS))
  const sampled = values.filter((_, index) => index % step === 0)
  // The latest price is what the line should end on, whatever the step left out.
  if (sampled.at(-1) !== values.at(-1)) sampled.push(values.at(-1)!)

  const min = Math.min(...sampled)
  const range = Math.max(...sampled) - min
  return sampled
    .map((value, index) => {
      const x = (index / (sampled.length - 1)) * WIDTH
      const share = range === 0 ? 0.5 : (value - min) / range
      const y = HEIGHT - INSET - share * (HEIGHT - 2 * INSET)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
})

const trend = computed(() => trendOf(props.change))
const label = computed(() =>
  props.change === null
    ? `${props.name}, last 7 days`
    : `${props.name}, last 7 days: ${formatChange(props.change)}`,
)
</script>

<template>
  <svg
    v-if="points"
    role="img"
    :aria-label="label"
    :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
    preserveAspectRatio="none"
    class="block h-8 w-full"
    :class="{
      'text-success-fg': trend === 'up',
      'text-danger-fg': trend === 'down',
      'text-fg-muted': trend === 'flat' || trend === 'none',
    }"
  >
    <polyline
      :points="points"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
  <span v-else class="text-fg-muted">—</span>
</template>
