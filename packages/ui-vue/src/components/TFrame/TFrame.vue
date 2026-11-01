<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useSplitAttrs } from '../../lib/attrs'
import {
  mediaCaptionClasses,
  mediaOverlayClasses,
  mediaRootClasses,
  observeContentHeight,
  ratioPreset,
  ratioValue,
  type TMediaStatus,
  toAllow,
  toLength,
  toSandbox,
} from '../../lib/media'
import { TSpinner } from '../TSpinner'
import { tFrameBoxVariants, tFrameVariants } from './TFrame.variants'
import type { TFrameProps } from './types'

// An <iframe> in a box sized by a ratio, a fixed height or its content (autoHeight), with a spinner until
// it loads. Lazy-loaded, and sends only the origin as referrer by default. The root's data-state is
// loading or loaded (cross-origin frames report no errors).
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TFrameProps>(), {
  ratio: '16-9',
  bordered: true,
  showLoader: true,
  loadingLabel: 'Loading',
  loading: 'lazy',
  referrerpolicy: 'strict-origin-when-cross-origin',
})
const { root, inner } = useSplitAttrs(() => mediaRootClasses)
const element = ref<HTMLIFrameElement | null>(null)
defineExpose({ element })

// A new document starts over.
const status = ref<TMediaStatus>('loading')
watch([() => props.src, () => props.srcdoc], () => (status.value = 'loading'))
// Counts load events, including navigation inside the frame: each new document is observed again.
const loads = ref(0)
const contentHeight = ref<number>()

watchEffect(
  (onCleanup) => {
    const frame = element.value
    if (!props.autoHeight || !frame || loads.value === 0) return
    const stop = observeContentHeight(frame, (height) => (contentHeight.value = height))
    onCleanup(() => stop?.())
  },
  { flush: 'post' },
)

const measured = computed(() => props.autoHeight && contentHeight.value !== undefined)
const byRatio = computed(() => !measured.value && props.height === undefined)

function onLoad() {
  status.value = 'loaded'
  loads.value++
}
</script>

<template>
  <component :is="caption || $slots.caption ? 'figure' : 'div'" data-slot="frame" :data-state="status" v-bind="root()">
    <div
      data-slot="frame-box"
      :class="tFrameBoxVariants({ ratio: byRatio ? ratioPreset(ratio) : null, radius, bordered })"
      :style="{ aspectRatio: byRatio ? ratioValue(ratio) : undefined, height: measured ? undefined : toLength(height) }"
    >
      <iframe
        ref="element"
        v-bind="inner()"
        :src.attr="src"
        :srcdoc.attr="srcdoc"
        :title="title"
        :sandbox="toSandbox(sandbox)"
        :allow="toAllow(allow)"
        :loading="loading"
        :referrerpolicy="referrerpolicy"
        :class="tFrameVariants({ fill: !measured })"
        :style="measured ? { height: `${contentHeight}px` } : undefined"
        @load="onLoad"
      />
      <div v-if="showLoader && status === 'loading'" data-slot="frame-loader" :class="mediaOverlayClasses">
        <TSpinner :label="loadingLabel" />
      </div>
    </div>
    <figcaption v-if="caption || $slots.caption" :class="mediaCaptionClasses">
      <slot name="caption">{{ caption }}</slot>
    </figcaption>
  </component>
</template>
