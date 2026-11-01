<script setup lang="ts">
import type { TAlarmProps } from './types'
import { useAlarmItem } from './useAlarmItem'

// The declarative form of alarm.*(): while v-model:open is true, the alarm is in the page's alarm store, and
// the page's TAlarmHost renders it (this component renders nothing itself). When it closes on its own, open
// becomes false; setting it to false takes the alarm away.
const props = withDefaults(defineProps<TAlarmProps>(), { variant: 'info' })
const emit = defineEmits<{ action: [] }>()
const open = defineModel<boolean>('open', { default: false })

useAlarmItem(open, () => ({ ...props }), () => emit('action'))
</script>

<template>
  <!-- Rendered by the page's TAlarmHost. -->
</template>
