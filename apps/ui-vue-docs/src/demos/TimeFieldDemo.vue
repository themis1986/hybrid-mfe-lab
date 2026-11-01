<script setup lang="ts">
import { TGrid, TTimeField } from '@repo/ui-vue'
import { ref } from 'vue'

const opens = ref('09:00')
const alarm = ref<string>()
</script>

<template>
  <TGrid min-child-width="12rem" :gap="4">
    <div class="flex flex-col gap-1.5 text-sm">
      <span id="time-field-demo-opens" class="font-medium">Opens at (24h)</span>
      <TTimeField
        v-model="opens"
        :hour-cycle="24"
        aria-labelledby="time-field-demo-opens"
      />
      <span class="text-fg-muted">Value: {{ opens ?? '—' }}</span>
    </div>
    <div class="flex flex-col gap-1.5 text-sm">
      <span id="time-field-demo-alarm" class="font-medium"
        >Alarm (12h, seconds)</span
      >
      <TTimeField
        v-model="alarm"
        :hour-cycle="12"
        granularity="second"
        aria-labelledby="time-field-demo-alarm"
      />
      <span class="text-fg-muted">Value: {{ alarm ?? '—' }}</span>
    </div>
    <TTimeField
      min="08:00"
      max="18:00"
      default-value="19:30"
      aria-label="Out of range"
    />
    <TTimeField disabled default-value="12:00" aria-label="Disabled" />
  </TGrid>
</template>
