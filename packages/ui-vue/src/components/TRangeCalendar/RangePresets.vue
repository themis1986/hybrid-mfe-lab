<script setup lang="ts">
import type { TDatePreset, TDateRange } from '../../lib/date'
import { TButton } from '../TButton'
import { tCalendarPresetClasses, tCalendarPresetsClasses } from '../TCalendar/TCalendar.variants'

// The presets column of a range calendar or range picker. The current range's preset is pressed.
defineProps<{ presets: TDatePreset[]; label: string; value: TDateRange | undefined; disabled?: boolean }>()
const emit = defineEmits<{ select: [range: TDateRange] }>()
</script>

<template>
  <ul data-slot="calendar-presets" :aria-label="label" :class="tCalendarPresetsClasses">
    <li v-for="preset in presets" :key="preset.label">
      <TButton
        variant="ghost"
        size="sm"
        :aria-pressed="value?.start === preset.value.start && value?.end === preset.value.end"
        :disabled="disabled"
        :class="tCalendarPresetClasses"
        @click="emit('select', preset.value)"
      >
        {{ preset.label }}
      </TButton>
    </li>
  </ul>
</template>
