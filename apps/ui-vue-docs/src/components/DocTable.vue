<script setup lang="ts">
import { TScrollArea } from '@repo/ui-vue'

defineProps<{
  label: string
  columns: string[]
  rows: string[][]
  /** Columns shown in monospace (code), by index. The first is also accent-coloured. */
  mono: number[]
}>()
</script>

<template>
  <TScrollArea orientation="horizontal" role="region" :aria-label="label">
    <!-- A minimum width so a narrow screen scrolls the table instead of squeezing its columns. -->
    <table class="w-full min-w-xl border-collapse text-left text-sm">
      <thead>
        <tr class="text-xs tracking-wide text-fg-muted uppercase">
          <th v-for="column in columns" :key="column" class="border-b border-line py-2 pr-4 font-semibold">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[0]" class="align-top">
          <td
            v-for="(cell, i) in row"
            :key="i"
            class="border-b border-line py-2 pr-4"
            :class="[
              mono.includes(i) ? 'font-mono text-xs' : 'text-fg-muted',
              i === 0 ? 'whitespace-nowrap text-accent-fg' : '',
            ]"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </TScrollArea>
</template>
