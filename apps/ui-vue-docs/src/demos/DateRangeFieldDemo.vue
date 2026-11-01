<script setup lang="ts">
import { TDateRangeField, type TDateRange, TGrid } from '@repo/ui-vue'
import { ref } from 'vue'

const stay = ref<TDateRange>()
</script>

<template>
  <TGrid min-child-width="18rem" :gap="4">
    <div class="flex flex-col gap-1.5 text-sm">
      <span id="date-range-field-demo" class="font-medium">Stay</span>
      <TDateRangeField v-model="stay" aria-labelledby="date-range-field-demo" />
      <span class="text-fg-muted"
        >Value: {{ stay ? `${stay.start} → ${stay.end}` : '—' }}</span
      >
    </div>
    <TDateRangeField
      size="lg"
      :default-value="{ start: '2026-11-01', end: '2026-11-07' }"
      aria-label="Large"
    />
  </TGrid>
</template>
