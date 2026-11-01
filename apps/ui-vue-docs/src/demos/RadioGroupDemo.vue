<script setup lang="ts">
import { TCluster, TRadioGroup, TRadioGroupItem } from '@repo/ui-vue'
import { ref } from 'vue'

const plan = ref('monthly')
const plans = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'lifetime', label: 'Lifetime' },
]
</script>

<template>
  <TCluster :gap="8" align="start">
    <div class="flex flex-col gap-3">
      <TRadioGroup v-model="plan" aria-label="Plan">
        <label v-for="item in plans" :key="item.value" class="inline-flex items-center gap-2 text-sm">
          <TRadioGroupItem :value="item.value" />
          {{ item.label }}
        </label>
      </TRadioGroup>
      <span class="text-sm text-fg-muted">v-model: {{ plan }}</span>
    </div>
    <TRadioGroup orientation="horizontal" default-value="b" aria-label="Size">
      <label class="inline-flex items-center gap-2 text-sm">
        <TRadioGroupItem value="a" size="sm" />
        Small
      </label>
      <label class="inline-flex items-center gap-2 text-sm">
        <TRadioGroupItem value="b" size="sm" />
        Medium
      </label>
      <label class="inline-flex items-center gap-2 text-sm text-fg-muted">
        <TRadioGroupItem value="c" size="sm" disabled />
        Large (disabled)
      </label>
    </TRadioGroup>
  </TCluster>
</template>
