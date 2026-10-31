<script setup lang="ts">
import { type ClassValue } from 'clsx'
import { Label } from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'
import { cn } from '../../lib/cn'
import { TInput } from '../TInput'
import { tFieldHintVariants, tFieldLabelClasses, tFieldRootClasses } from './TField.variants'
import type { TFieldProps } from './types'

// `class` and `style` go on the root; every other attribute and listener goes on the input.
defineOptions({ inheritAttrs: false })
const props = defineProps<TFieldProps>()
const model = defineModel<string>()
const attrs = useAttrs()

// useId() is unique within one Vue app. Several apps (microfrontends) on one page must each set their
// own app.config.idPrefix, or their ids can collide.
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const hintId = computed(() => `${inputId.value}-hint`)
const hint = computed(() => props.error ?? props.description)

function inputAttrs() {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
}
</script>

<template>
  <div :class="cn(tFieldRootClasses, attrs.class as ClassValue)" :style="attrs.style">
    <Label :for="inputId" :class="tFieldLabelClasses">{{ label }}</Label>
    <TInput
      v-model="model"
      v-bind="inputAttrs()"
      :id="inputId"
      :size="size"
      :invalid="!!error"
      :aria-describedby="hint ? hintId : undefined"
    />
    <p
      v-if="hint"
      :id="hintId"
      :role="error ? 'alert' : undefined"
      :class="tFieldHintVariants({ tone: error ? 'error' : 'description' })"
    >
      {{ hint }}
    </p>
  </div>
</template>
