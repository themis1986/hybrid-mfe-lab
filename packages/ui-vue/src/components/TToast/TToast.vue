<script setup lang="ts">
import { useAlarmItem } from '../TAlarm/useAlarmItem'
import type { TToastProps } from './types'

// The declarative form of toast(): an untinted message, typically with an action ('Message deleted' · Undo).
// While v-model:open is true, the page's TAlarmHost shows it in the same stack as the alarms; this renders
// nothing itself. Clicking the action emits `action` and closes it.
const props = defineProps<TToastProps>()
const emit = defineEmits<{ action: [] }>()
const open = defineModel<boolean>('open', { default: false })

useAlarmItem(open, () => ({ ...props, variant: 'neutral' }), () => emit('action'))
</script>

<template>
  <!-- Rendered by the page's TAlarmHost. -->
</template>
