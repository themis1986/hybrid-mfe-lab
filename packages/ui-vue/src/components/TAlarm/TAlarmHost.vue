<script setup lang="ts">
import { CircleCheck, CircleX, Info, TriangleAlert, X } from '@lucide/vue'
import { ToastAction, ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { alarmStore, alarmSwipeDirection, alarmUrgency, groupAlarms } from '../../lib/alarm'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tAlarmActionClasses,
  tAlarmBodyClasses,
  tAlarmCloseClasses,
  tAlarmDescriptionClasses,
  tAlarmIconVariants,
  tAlarmTitleClasses,
  tAlarmVariants,
  tAlarmViewportVariants,
} from './TAlarm.variants'
import type { TAlarmHostProps } from './types'

// Renders the page's alarms (lib/alarm.ts), raised with alarm.success(…) and the like or by an open
// <TAlarm>. Mount one per app, at its root. Only the first host mounted on the page renders, so inside the
// shell the shell's host shows the microfrontends' alarms too. Each position in use gets its own Reka Toast
// provider and viewport; the host's own one answers F8.
const props = withDefaults(defineProps<TAlarmHostProps>(), {
  position: 'bottom-right',
  duration: 5000,
  label: 'Notifications',
})

const ICONS = { success: CircleCheck, error: CircleX, info: Info, warning: TriangleAlert }
const swipeStyle = {
  '--t-alarm-swipe-x': 'var(--reka-toast-swipe-move-x)',
  '--t-alarm-swipe-y': 'var(--reka-toast-swipe-move-y)',
}

const host = Symbol('TAlarmHost')
const state = shallowRef(alarmStore.getState())
const groups = computed(() => (state.value.host === host ? [...groupAlarms(state.value.items, props.position)] : []))

// Closed by its timer, a swipe or its close button.
const dismiss = (id: string) => alarmStore.dismiss(id)

let unsubscribe: (() => void) | undefined
let unregister: (() => void) | undefined
onMounted(() => {
  unsubscribe = alarmStore.subscribe(() => (state.value = alarmStore.getState()))
  unregister = alarmStore.registerHost(host)
})
onBeforeUnmount(() => {
  unsubscribe?.()
  unregister?.()
})
</script>

<template>
  <ToastProvider
    v-for="[groupPosition, items] in groups"
    :key="groupPosition"
    :duration="duration"
    :swipe-direction="alarmSwipeDirection(groupPosition)"
    :label="label"
  >
    <ToastRoot
      v-for="item in items"
      :key="item.id"
      data-slot="alarm"
      :data-variant="item.variant"
      :type="alarmUrgency(item.variant)"
      :duration="item.duration"
      :class="tAlarmVariants({ variant: item.variant })"
      :style="swipeStyle"
      @update:open="(open: boolean) => !open && dismiss(item.id)"
    >
      <TIcon
        v-if="item.variant !== 'neutral'"
        :icon="ICONS[item.variant]"
        size="md"
        :class="tAlarmIconVariants({ variant: item.variant })"
      />
      <div :class="tAlarmBodyClasses">
        <ToastTitle :class="tAlarmTitleClasses">{{ item.title }}</ToastTitle>
        <ToastDescription v-if="item.description" :class="tAlarmDescriptionClasses">{{ item.description }}</ToastDescription>
      </div>
      <!-- alt-text describes the action for screen readers, which reach it through F8. -->
      <ToastAction v-if="item.action" as-child :alt-text="item.action.label">
        <TButton
          variant="outline"
          size="sm"
          :label="item.action.label"
          :class="tAlarmActionClasses"
          @click="item.action.onClick()"
        />
      </ToastAction>
      <ToastClose as-child>
        <TButton variant="ghost" size="sm" aria-label="Dismiss" :class="tAlarmCloseClasses">
          <TIcon :icon="X" size="sm" />
        </TButton>
      </ToastClose>
    </ToastRoot>
    <ToastViewport
      data-slot="alarm-viewport"
      :hotkey="groupPosition === position ? undefined : []"
      :label="groupPosition === position ? `${label} ({hotkey})` : label"
      :class="tAlarmViewportVariants({ position: groupPosition })"
    />
  </ToastProvider>
</template>
