<script setup lang="ts">
import { TButton } from '@repo/ui-vue'
import { useWeatherState } from '../hooks/useWeatherState'
import type { Units } from '../types'

const { units, setUnits } = useWeatherState()

const options: { value: Units; label: string; name: string }[] = [
  { value: 'metric', label: '°C', name: 'Metric units' },
  { value: 'imperial', label: '°F', name: 'Imperial units' },
]
</script>

<template>
  <div role="group" aria-label="Units" class="flex gap-1">
    <TButton
      v-for="option in options"
      :key="option.value"
      size="sm"
      :variant="units === option.value ? 'soft' : 'ghost'"
      :aria-label="option.name"
      :aria-pressed="units === option.value"
      @click="setUnits(option.value)"
    >
      {{ option.label }}
    </TButton>
  </div>
</template>
