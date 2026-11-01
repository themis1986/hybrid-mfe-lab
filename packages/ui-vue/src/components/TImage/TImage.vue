<script setup lang="ts">
import { ImageOff } from '@lucide/vue'
import { ref, watch } from 'vue'
import { useSplitAttrs } from '../../lib/attrs'
import { mediaCaptionClasses, mediaRootClasses, ratioPreset, ratioValue, type TMediaStatus } from '../../lib/media'
import { TIcon } from '../TIcon'
import { tImageFallbackClasses, tImageFrameVariants, tImageVariants } from './TImage.variants'
import type { TImageProps } from './types'

// An <img> in a box: an optional ratio, a skeleton while it loads, a fallback image and then the fallback
// slot when it fails, and an optional caption (the root is then a <figure>). The root's data-state is
// loading, loaded or error. `class` and `style` go on the root; every other attribute and listener on the <img>.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TImageProps>(), { placeholder: 'skeleton', loading: 'lazy', decoding: 'async' })
const { root, inner } = useSplitAttrs(() => mediaRootClasses)
const element = ref<HTMLImageElement | null>(null)
defineExpose({ element })

// The status belongs to one src: a new src starts over.
const current = ref(props.src || props.fallbackSrc)
const status = ref<TMediaStatus>(current.value ? 'loading' : 'error')
watch(
  () => props.src,
  (src) => {
    current.value = src || props.fallbackSrc
    status.value = current.value ? 'loading' : 'error'
  },
)

function onError() {
  if (props.fallbackSrc && current.value !== props.fallbackSrc) current.value = props.fallbackSrc
  else status.value = 'error'
}
</script>

<template>
  <component :is="caption || $slots.caption ? 'figure' : 'div'" data-slot="image" :data-state="status" v-bind="root()">
    <div
      data-slot="image-frame"
      :class="
        tImageFrameVariants({
          ratio: ratioPreset(ratio),
          sized: ratio !== undefined,
          radius,
          bordered,
          pending: placeholder === 'skeleton' && status === 'loading',
        })
      "
      :style="{ aspectRatio: ratioValue(ratio) }"
    >
      <img
        ref="element"
        v-bind="inner()"
        :src="current"
        :alt="alt"
        :loading="loading"
        :decoding="decoding"
        :class="tImageVariants({ sized: ratio !== undefined, fit, failed: status === 'error' })"
        :style="position ? { objectPosition: position } : undefined"
        @load="status = 'loaded'"
        @error="onError"
      />
      <div v-if="status === 'error'" data-slot="image-fallback" :class="tImageFallbackClasses">
        <slot name="fallback">
          <TIcon :icon="ImageOff" size="lg" :label="alt || undefined" />
        </slot>
      </div>
    </div>
    <figcaption v-if="caption || $slots.caption" :class="mediaCaptionClasses">
      <slot name="caption">{{ caption }}</slot>
    </figcaption>
  </component>
</template>
