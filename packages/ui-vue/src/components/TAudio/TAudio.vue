<script setup lang="ts">
import { VolumeX } from '@lucide/vue'
import { computed, ref, watch, watchEffect } from 'vue'
import { useSplitAttrs } from '../../lib/attrs'
import {
  applyPlayback,
  mediaCaptionClasses,
  mediaRootClasses,
  prefersReducedMotion,
  sourcesKey,
  type TMediaStatus,
} from '../../lib/media'
import { TIcon } from '../TIcon'
import { tAudioFallbackClasses, tAudioVariants } from './TAudio.variants'
import type { TAudioProps } from './types'

// An <audio> player with native controls, the width of its root, and the fallback slot in its place when
// nothing can be played. Name it with aria-label when no visible text says what it plays. The root's
// data-state is loading, loaded (metadata known) or error.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TAudioProps>(), {
  errorLabel: "This audio can't be played",
  controls: true,
  preload: 'metadata',
})
const { root, inner } = useSplitAttrs(() => mediaRootClasses)
const element = ref<HTMLAudioElement | null>(null)
defineExpose({ element })

// New sources re-create the <audio> (changing its <source> children doesn't reload it) and start over.
const key = computed(() => sourcesKey(props.src, props.sources))
const status = ref<TMediaStatus>('loading')
watch(key, () => (status.value = 'loading'))
const reducedMotion = prefersReducedMotion()

watchEffect(
  () => {
    if (element.value)
      applyPlayback(element.value, {
        volume: props.volume,
        playbackRate: props.playbackRate,
      })
  },
  { flush: 'post' },
)

function onLoadedMetadata() {
  const audio = element.value
  if (!audio) return
  if (props.startTime !== undefined) audio.currentTime = props.startTime
  // Loading resets the rate to the default one.
  applyPlayback(audio, {
    volume: props.volume,
    playbackRate: props.playbackRate,
  })
  status.value = 'loaded'
}
</script>

<template>
  <component
    :is="caption || $slots.caption ? 'figure' : 'div'"
    data-slot="audio"
    :data-state="status"
    v-bind="root()"
  >
    <audio
      :key="key"
      ref="element"
      v-bind="inner()"
      :src.attr="sources?.length ? undefined : src"
      :controls="controls"
      :preload="preload"
      :autoplay="autoplay && !reducedMotion"
      :class="tAudioVariants({ failed: status === 'error' })"
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
    </audio>
    <div
      v-if="status === 'error'"
      data-slot="audio-fallback"
      :class="tAudioFallbackClasses"
    >
      <slot name="fallback">
        <TIcon :icon="VolumeX" size="sm" />
        <span>{{ errorLabel }}</span>
      </slot>
    </div>
    <figcaption v-if="caption || $slots.caption" :class="mediaCaptionClasses">
      <slot name="caption">{{ caption }}</slot>
    </figcaption>
  </component>
</template>
