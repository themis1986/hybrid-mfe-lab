<script setup lang="ts">
import { TGrid, TSelect } from '@repo/ui-vue'
import { ref } from 'vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
]
const fruit = ref<string>()
const basket = ref<string[]>(['apple', 'cherry'])
</script>

<template>
  <TGrid min-child-width="14rem" :gap="4">
    <div class="flex flex-col gap-1.5">
      <label for="select-demo-single" class="text-sm font-medium">Single</label>
      <TSelect id="select-demo-single" v-model="fruit" :options="fruits" placeholder="Pick a fruit" />
      <span class="text-sm text-fg-muted">v-model: {{ fruit ?? '—' }}</span>
    </div>
    <div class="flex flex-col gap-1.5">
      <label for="select-demo-multiple" class="text-sm font-medium">Multiple</label>
      <TSelect id="select-demo-multiple" v-model="basket" multiple :options="fruits" placeholder="Pick fruits" />
      <span class="text-sm text-fg-muted">v-model: {{ basket.join(', ') || '—' }}</span>
    </div>
    <TSelect :options="fruits" size="sm" invalid placeholder="Invalid, small" aria-label="Invalid" />
    <TSelect :options="fruits" disabled default-value="banana" aria-label="Disabled" />
  </TGrid>
</template>
