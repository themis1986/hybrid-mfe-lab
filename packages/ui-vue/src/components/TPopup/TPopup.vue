<script setup lang="ts">
import { createPopup } from '@repo/map-core'
import type { ClassValue } from 'clsx'
import { inject, shallowRef, useAttrs, watch } from 'vue'
import { cn } from '../../lib/cn'
import { MARKER_KEY, useMapContext } from '../TMapView/context'
import { tPopupClasses } from './TPopup.variants'
import type { TPopupProps } from './types'

// A popup at a position, or, in a TMarker's popup slot, on that marker (opened by its click). The default
// slot is teleported into the popup's content element.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TPopupProps>(), {
  open: undefined,
  closeButton: true,
})
const emit = defineEmits<{ 'update:open': [open: boolean] }>()
const attrs = useAttrs()
const { map } = useMapContext('TPopup')
const marker = inject(MARKER_KEY, null)?.value ?? null
const created = shallowRef<ReturnType<typeof createPopup> | null>(null)

watch(
  () => [props.closeButton, props.anchor] as const,
  ([closeButton, anchor], _, onCleanup) => {
    const next = createPopup({
      closeButton,
      anchor,
      offset: props.offset,
      className: cn(tPopupClasses, attrs.class as ClassValue),
    })
    const opened = () => emit('update:open', true)
    const closed = () => emit('update:open', false)
    next.popup.on('open', opened).on('close', closed)
    marker?.setPopup(next.popup)
    created.value = next
    onCleanup(() => {
      created.value = null
      // Unmounting isn't the user closing it: no update:open.
      next.popup.off('open', opened).off('close', closed)
      if (marker?.getPopup() === next.popup) marker.setPopup(null)
      next.popup.remove()
    })
  },
  { immediate: true },
)

watch(
  () =>
    [created.value, props.open, props.lngLat?.[0], props.lngLat?.[1]] as const,
  ([current, open, lng, lat]) => {
    if (!current) return
    const { popup } = current
    if (marker) {
      // The marker owns the position and toggles on click; only a controlled `open` forces it.
      if (open !== undefined && open !== popup.isOpen()) marker.togglePopup()
      return
    }
    if (lng === undefined || lat === undefined) return
    popup.setLngLat([lng, lat])
    if (open === false) popup.remove()
    else if (!popup.isOpen()) popup.addTo(map)
  },
  { immediate: true },
)

watch(
  () => props.offset,
  (offset) => {
    if (offset !== undefined) created.value?.popup.setOffset(offset)
  },
)
</script>

<template>
  <Teleport v-if="created" :to="created.content"><slot /></Teleport>
</template>
