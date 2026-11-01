<script setup lang="ts">
import { VideoOff } from '@lucide/vue'
import { computed, ref, watch, watchEffect } from 'vue'
import { useSplitAttrs } from '../../lib/attrs'
import {
  applyPlayback,
  mediaCaptionClasses,
  mediaOverlayClasses,
  mediaRootClasses,
  prefersReducedMotion,
  ratioPreset,
  ratioValue,
  sourcesKey,
  type TMediaStatus,
} from '../../lib/media'
import { TIcon } from '../TIcon'
import { tVideoFrameVariants, tVideoVariants } from './TVideo.variants'
import type { TVideoProps } from './types'

// A <video> in a box with a fixed ratio, native controls, and the fallback slot over the box when nothing
// can be played. The root's data-state is loading, loaded (metadata known) or error.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TVideoProps>(), {
  ratio: '16-9',
  errorLabel: "This video can't be played",
  controls: true,
  playsinline: true,
  preload: 'metadata',
})
const { root, inner } = useSplitAttrs(() => mediaRootClasses)
const element = ref<HTMLVideoElement | null>(null)
defineExpose({ element })

// New sources re-create the <video> (changing its <source> children doesn't reload it) and start over.
const key = computed(() => sourcesKey(props.src, props.sources))
const status = ref<TMediaStatus>('loading')
watch(key, () => (status.value = 'loading'))
const reducedMotion = prefersReducedMotion()

watchEffect(
  () => {
    if (element.value) applyPlayback(element.value, { volume: props.volume, playbackRate: props.playbackRate })
  },
  { flush: 'post' },
)

function onLoadedMetadata() {
  const video = element.value
  if (!video) return
  if (props.startTime !== undefined) video.currentTime = props.startTime
  // Loading resets the rate to the default one.
  applyPlayback(video, { volume: props.volume, playbackRate: props.playbackRate })
  status.value = 'loaded'
}
</script>

<template>
  <component :is="caption || $slots.caption ? 'figure' : 'div'" data-slot="video" :data-state="status" v-bind="root()">
    <div
      data-slot="video-frame"
      :class="tVideoFrameVariants({ ratio: ratioPreset(ratio), radius, bordered })"
      :style="{ aspectRatio: ratioValue(ratio) }"
    >
      <video
        :key="key"
        ref="element"
        v-bind="inner()"
        :src.attr="sources?.length ? undefined : src"
        :controls="controls"
        :playsinline="playsinline || undefined"
        :preload="preload"
        :autoplay="autoplay && !reducedMotion"
        :muted="muted || autoplay"
        :class="tVideoVariants({ fit })"
        @loadedmetadata="onLoadedMetadata"
        @error="status = 'error'"
      >
        <!-- With <source> children, failures fire on each source: the last one failing means none can play. -->
        <source
          v-for="(source, index) in sources"
          :key="source.src"
          :src="source.src"
          :type="source.type"
          :media="source.media"
          @error="index === sources!.length - 1 && (status = 'error')"
        />
        <track
          v-for="track in tracks"
          :key="track.src"
          :src="track.src"
          :kind="track.kind"
          :srclang="track.srcLang"
          :label="track.label"
          :default="track.default"
        />
      </video>
      <div v-if="status === 'error'" data-slot="video-fallback" :class="mediaOverlayClasses">
        <slot name="fallback">
          <TIcon :icon="VideoOff" size="lg" />
          <span>{{ errorLabel }}</span>
        </slot>
      </div>
    </div>
    <figcaption v-if="caption || $slots.caption" :class="mediaCaptionClasses">
      <slot name="caption">{{ caption }}</slot>
    </figcaption>
  </component>
</template>
