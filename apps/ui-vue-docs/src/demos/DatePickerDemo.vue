<script setup lang="ts">
import { TButton, TDatePicker, TGrid } from '@repo/ui-vue'
import { ref } from 'vue'

const due = ref<string>()
const submitted = ref('')

function submit(event: Event) {
  const data = new FormData(event.target as HTMLFormElement)
  submitted.value = JSON.stringify(Object.fromEntries(data))
}
</script>

<template>
  <TGrid min-child-width="16rem" :gap="4">
    <form class="flex flex-col gap-1.5 text-sm" @submit.prevent="submit">
      <span id="date-picker-demo-due" class="font-medium">Due date (required)</span>
      <TDatePicker v-model="due" name="due" required aria-labelledby="date-picker-demo-due" />
      <span class="text-fg-muted">Value: {{ due ?? '—' }}</span>
      <TButton type="submit" variant="outline" size="sm" class="self-start">Submit</TButton>
      <span v-if="submitted" class="text-fg-muted">Submitted: {{ submitted }}</span>
    </form>
    <TDatePicker :number-of-months="2" size="sm" aria-label="Two months, small" />
    <TDatePicker invalid aria-label="Invalid" />
    <TDatePicker disabled default-value="2026-11-01" aria-label="Disabled" />
  </TGrid>
</template>
