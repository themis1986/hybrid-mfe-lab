<script setup lang="ts">
import {
  applyBounds,
  applyView,
  createMap,
  DEFAULT_MAP_STYLE,
  type LngLatTuple,
  type MapHandle,
  type MapInstance,
  type MapMouseEvent,
  readView,
  setInteractive,
  setMapStyle,
  type ViewState,
} from '@repo/map-core'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { MAP_KEY, useListeners } from './context'
import {
  tMapViewCanvasClasses,
  tMapViewClasses,
  tMapViewMessageClasses,
} from './TMapView.variants'
import type { TMapViewProps } from './types'

// A Mapbox map filling its parent. Its default slot (markers, popups, layers) renders once the map exists;
// they register with its layer manager, which keeps them across style changes. Without a token it renders
// the missing-token slot instead, and creates no map.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TMapViewProps>(), {
  mapStyle: DEFAULT_MAP_STYLE,
  interactive: true,
  missingTokenLabel: 'Set a Mapbox access token to show the map.',
})
const emit = defineEmits<{
  load: [map: MapInstance]
  click: [event: MapMouseEvent]
  move: [view: ViewState]
  moveend: [view: ViewState]
  error: [error: Error]
  'update:center': [center: LngLatTuple]
  'update:zoom': [zoom: number]
  'update:bearing': [bearing: number]
  'update:pitch': [pitch: number]
}>()
const root = useRootAttrs(() => tMapViewClasses)
const hasListener = useListeners()

const container = ref<HTMLElement | null>(null)
// The engine's objects are never made reactive: shallowRef, and the map itself is only read.
const handle = shallowRef<MapHandle | null>(null)
const context = computed(
  () => handle.value && { map: handle.value.map, layers: handle.value.layers },
)
provide(MAP_KEY, context)
// What the map was last given, so a prop is applied only when it changes after creation.
let applied = { mapStyle: props.mapStyle, bounds: boundsKey(props.bounds) }

function controlledView(): Partial<ViewState> {
  const { center, zoom, bearing, pitch } = props
  return Object.fromEntries(
    Object.entries({ center, zoom, bearing, pitch }).filter(
      ([, value]) => value !== undefined,
    ),
  )
}

function create() {
  if (!props.accessToken || !container.value) return
  const created = createMap(container.value, {
    accessToken: props.accessToken,
    style: props.mapStyle,
    view: { ...props.initialViewState, ...controlledView() },
    bounds: props.bounds,
    fitBoundsOptions: props.fitBoundsOptions,
    interactive: props.interactive,
  })
  applied = { mapStyle: props.mapStyle, bounds: boundsKey(props.bounds) }
  const { map } = created
  map.on('load', () => emit('load', map))
  map.on('click', (event) => emit('click', event))
  map.on('move', () => {
    const view = readView(map)
    emit('move', view)
    emit('update:center', view.center)
    emit('update:zoom', view.zoom)
    emit('update:bearing', view.bearing)
    emit('update:pitch', view.pitch)
  })
  map.on('moveend', () => emit('moveend', readView(map)))
  map.on('error', ({ error }) => {
    if (hasListener('onError')) emit('error', error)
    else console.error(error)
  })
  handle.value = created
}

function destroy() {
  const current = handle.value
  handle.value = null
  current?.destroy()
}

onMounted(create)
// After the children's onBeforeUnmount, which remove their layers first.
onUnmounted(destroy)

// A new token: the children unmount with the old map, then remount on the new one.
watch(
  () => props.accessToken,
  async () => {
    destroy()
    await nextTick()
    create()
  },
  { flush: 'post' },
)

watch(
  () => props.mapStyle,
  (style) => {
    if (!handle.value || applied.mapStyle === style) return
    applied.mapStyle = style
    setMapStyle(handle.value, style)
  },
)

// Echoed values are no-ops (applyView compares with the camera), so v-model can't loop.
watch(
  () => [
    props.center?.[0],
    props.center?.[1],
    props.zoom,
    props.bearing,
    props.pitch,
  ],
  () => {
    if (handle.value) applyView(handle.value.map, controlledView())
  },
)

watch(
  () => boundsKey(props.bounds),
  (key) => {
    if (!handle.value || !props.bounds || applied.bounds === key) return
    applied.bounds = key
    applyBounds(handle.value.map, props.bounds, props.fitBoundsOptions)
  },
)

watch(
  () => props.interactive,
  (interactive) => {
    if (handle.value) setInteractive(handle.value.map, interactive)
  },
)

defineExpose({
  /** The engine's map, or null before it is created (or without a token). */
  getMap: (): MapInstance | null => handle.value?.map ?? null,
})
</script>

<script lang="ts">
function boundsKey(bounds: readonly number[] | undefined) {
  return bounds?.join(',')
}
</script>

<template>
  <div data-slot="map-view" v-bind="root()">
    <div
      v-if="accessToken"
      ref="container"
      data-slot="map-view-canvas"
      :class="tMapViewCanvasClasses"
    />
    <div
      v-else
      role="status"
      data-slot="map-view-message"
      :class="tMapViewMessageClasses"
    >
      <slot name="missing-token">{{ missingTokenLabel }}</slot>
    </div>
    <slot v-if="context" />
  </div>
</template>
