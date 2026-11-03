<script setup lang="ts">
import { TCard, TIcon } from '@repo/ui-vue'
import type { Component } from 'vue'

defineProps<{
  label: string
  icon: Component
  /** The main reading. */
  value?: string
  /** A quieter line under it. */
  hint?: string
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
    <p class="m-0 mt-2 text-xl font-semibold tracking-tight tabular-nums">
      <slot>{{ value ?? '—' }}</slot>
    </p>
    <p class="m-0 mt-0.5 min-h-4 text-xs text-fg-muted">
      <slot name="hint">{{ hint }}</slot>
    </p>
    <slot name="extra" />
  </TCard>
</template>
