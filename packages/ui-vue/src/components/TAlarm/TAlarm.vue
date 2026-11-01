<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { alarmStore, newAlarmId } from '../../lib/alarm'
import type { TAlarmProps } from './types'

// The declarative form of alarm.*(): while v-model:open is true, the alarm is in the page's alarm store, and
// the page's TAlarmHost renders it (this component renders nothing itself). When it closes on its own, open
// becomes false; setting it to false takes the alarm away.
const props = withDefaults(defineProps<TAlarmProps>(), { variant: 'info' })
const open = defineModel<boolean>('open', { default: false })
const id = newAlarmId()

// Updates the alarm in place while open, so a changed prop doesn't restart it.
watch(
  () => [open.value, props.variant, props.title, props.description, props.position, props.duration],
  () => {
    if (!open.value) return alarmStore.remove(id)
    alarmStore.set({
      id,
      variant: props.variant,
      title: props.title,
      description: props.description,
      position: props.position,
      duration: props.duration,
      onClose: () => (open.value = false),
    })
  },
  { immediate: true },
)
onBeforeUnmount(() => alarmStore.remove(id))
</script>

<template>
  <!-- Rendered by the page's TAlarmHost. -->
</template>
