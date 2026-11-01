<script setup lang="ts">
import { TDateField, TGrid } from '@repo/ui-vue'
import { ref } from 'vue'

const birthday = ref<string>()
</script>

<template>
  <TGrid min-child-width="14rem" :gap="4">
    <div class="flex flex-col gap-1.5 text-sm">
      <span id="date-field-demo-birthday" class="font-medium">Date of birth</span>
      <TDateField v-model="birthday" max="2026-12-31" aria-labelledby="date-field-demo-birthday" />
      <span class="text-fg-muted">Value: {{ birthday ?? '—' }}</span>
    </div>
    <div class="flex flex-col gap-1.5 text-sm">
      <span id="date-field-demo-gb" class="font-medium">en-GB order</span>
      <TDateField locale="en-GB" default-value="2026-11-01" aria-labelledby="date-field-demo-gb" />
    </div>
    <TDateField size="sm" invalid aria-label="Invalid, small" />
    <TDateField disabled default-value="2026-11-01" aria-label="Disabled" />
  </TGrid>
</template>
