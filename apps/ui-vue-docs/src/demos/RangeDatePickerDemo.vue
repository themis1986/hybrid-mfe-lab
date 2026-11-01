<script setup lang="ts">
import {
  defaultRangePresets,
  TButton,
  type TDateRange,
  TGrid,
  TRangeDatePicker,
} from '@repo/ui-vue'
import { ref } from 'vue'

const presets = defaultRangePresets()
const period = ref<TDateRange>()
const submitted = ref('')

function submit(event: Event) {
  const data = new FormData(event.target as HTMLFormElement)
  submitted.value = JSON.stringify(Object.fromEntries(data))
}
</script>

<template>
  <TGrid min-child-width="20rem" :gap="4">
    <form class="flex flex-col gap-1.5 text-sm" @submit.prevent="submit">
      <span id="range-picker-demo" class="font-medium"
        >Report period (required)</span
      >
      <TRangeDatePicker
        v-model="period"
        name="period"
        required
        :presets="presets"
        :number-of-months="2"
        aria-labelledby="range-picker-demo"
      />
      <span class="text-fg-muted"
        >Value: {{ period ? `${period.start} → ${period.end}` : '—' }}</span
      >
      <TButton type="submit" variant="outline" size="sm" class="self-start"
        >Submit</TButton
      >
      <span v-if="submitted" class="text-fg-muted"
        >Submitted: {{ submitted }}</span
      >
    </form>
    <TRangeDatePicker
      size="sm"
      :default-value="{ start: '2026-11-01', end: '2026-11-07' }"
      aria-label="Small"
    />
  </TGrid>
</template>
