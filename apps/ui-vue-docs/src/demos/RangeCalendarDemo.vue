<script setup lang="ts">
import { defaultRangePresets, type TDateRange, TRangeCalendar, TStack } from '@repo/ui-vue'
import { ref } from 'vue'

const presets = defaultRangePresets()
const range = ref<TDateRange>(presets[1].value)
</script>

<template>
  <TStack :gap="2" class="text-sm">
    <TRangeCalendar v-model="range" :presets="presets" :number-of-months="2" label="Report period" />
    <span class="text-fg-muted">Range: {{ range ? `${range.start} → ${range.end}` : '—' }}</span>
  </TStack>
</template>
