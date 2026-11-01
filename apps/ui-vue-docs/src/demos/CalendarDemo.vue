<script setup lang="ts">
import { TCalendar, TGrid } from '@repo/ui-vue'
import { ref } from 'vue'

// Today as an ISO date, in the viewer's time zone.
const now = new Date()
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
  .map((n) => String(n).padStart(2, '0'))
  .join('-')
const isWeekend = (iso: string) =>
  [0, 6].includes(new Date(`${iso}T00:00`).getDay())

const date = ref<string>()
const booking = ref<string>()
</script>

<template>
  <TGrid min-child-width="18rem" :gap="6">
    <div class="flex flex-col gap-2 text-sm">
      <TCalendar v-model="date" label="Date" />
      <span class="text-fg-muted">Selected: {{ date ?? '—' }}</span>
    </div>
    <div class="flex flex-col gap-2 text-sm">
      <TCalendar
        v-model="booking"
        :min="today"
        :is-date-unavailable="isWeekend"
        :week-starts-on="1"
        locale="en-GB"
        label="Delivery day"
      />
      <span class="text-fg-muted"
        >From today, weekdays only (en-GB, Monday first):
        {{ booking ?? '—' }}</span
      >
    </div>
  </TGrid>
</template>
