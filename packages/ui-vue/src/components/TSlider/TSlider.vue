<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import {
  tSliderClasses,
  tSliderRangeClasses,
  tSliderThumbVariants,
  tSliderTrackVariants,
} from './TSlider.variants'
import type { TSliderProps } from './types'

// A slider (Reka Slider): v-model, or defaultValue, as number arrays. One entry per thumb: [50] is a single
// value, [20, 80] a range. Name the thumbs with `thumbLabel`.
defineOptions({ inheritAttrs: false })
// The explicit undefined default keeps "not set" apart from an empty value, so Reka's own default applies
// and the slider is only controlled when v-model is bound.
const props = withDefaults(defineProps<TSliderProps>(), {
  defaultValue: undefined,
})
const model = defineModel<number[] | undefined>({ default: undefined })
const root = useRootAttrs(() => tSliderClasses)
const thumbLabelAt = (i: number) =>
  Array.isArray(props.thumbLabel) ? props.thumbLabel[i] : props.thumbLabel
</script>

<template>
  <SliderRoot
    v-slot="{ modelValue }"
    v-model="model"
    data-slot="slider"
    v-bind="root()"
    :default-value="defaultValue"
    :min="min"
    :max="max"
    :step="step"
    :min-steps-between-thumbs="minStepsBetweenThumbs"
    :orientation="orientation"
    :disabled="disabled"
    :name="name"
    :as="as"
    :as-child="asChild"
  >
    <SliderTrack
      data-slot="slider-track"
      :class="tSliderTrackVariants({ size })"
    >
      <SliderRange data-slot="slider-range" :class="tSliderRangeClasses" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, i) in modelValue"
      :key="i"
      data-slot="slider-thumb"
      :aria-label="thumbLabelAt(i)"
      :class="tSliderThumbVariants({ size })"
    />
  </SliderRoot>
</template>
