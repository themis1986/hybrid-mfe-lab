<script setup lang="ts">
import { TIcon } from '@repo/ui-vue'
import { ArrowDown, ArrowUp } from '@repo/ui-vue/icons'
import { computed } from 'vue'
import { formatChange, trendOf } from '../lib/format'

// A percent change: colour, arrow and sign together, so colour is never the only signal.
const props = defineProps<{ value: number | null | undefined }>()
const trend = computed(() => trendOf(props.value))
</script>

<template>
  <span
    class="inline-flex items-center gap-0.5 tabular-nums"
    :class="{
      'text-success-fg': trend === 'up',
      'text-danger-fg': trend === 'down',
      'text-fg-muted': trend === 'flat' || trend === 'none',
    }"
  >
    <TIcon v-if="trend === 'up'" :icon="ArrowUp" size="sm" />
    <TIcon v-else-if="trend === 'down'" :icon="ArrowDown" size="sm" />
    {{ formatChange(value) }}
  </span>
</template>
