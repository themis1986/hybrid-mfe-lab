<script setup lang="ts">
import { TCard, TIcon, TSkeleton } from '@repo/ui-vue'
import type { Component } from 'vue'

defineProps<{
  label: string
  icon: Component
  /** The main reading. */
  value?: string
  /** A quieter line under it. */
  hint?: string
  /** Waiting on the first answer: a skeleton takes the reading's place. */
  loading?: boolean
}>()
</script>

<template>
  <TCard variant="filled" :padding="3" class="min-w-0">
    <p
      class="m-0 flex items-center gap-1.5 text-xs font-medium tracking-wide text-fg-muted uppercase"
    >
      <TIcon :icon="icon" size="sm" />
      {{ label }}
    </p>
    <template v-if="loading">
      <TSkeleton shape="block" class="mt-2 h-7 w-28" />
      <TSkeleton class="mt-1.5 w-20" />
    </template>
    <template v-else>
      <p class="m-0 mt-2 text-xl font-semibold tracking-tight tabular-nums">
        <slot>{{ value ?? '—' }}</slot>
      </p>
      <p class="m-0 mt-0.5 min-h-4 text-xs text-fg-muted">
        <slot name="hint">{{ hint }}</slot>
      </p>
      <slot name="extra" />
    </template>
  </TCard>
</template>
