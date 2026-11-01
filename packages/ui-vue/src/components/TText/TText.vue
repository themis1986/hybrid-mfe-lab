<script setup lang="ts">
import { type ClassValue } from 'clsx'
import { Label } from 'reka-ui'
import { computed, useAttrs, useId } from 'vue'
import { cn } from '../../lib/cn'
import {
  tFieldHintVariants,
  tFieldLabelClasses,
  tFieldRootClasses,
} from '../TField/TField.variants'
import { tInputVariants } from '../TInput/TInput.variants'
import {
  tTextAreaVariants,
  tTextCounterClasses,
  tTextHintRowClasses,
} from './TText.variants'
import type { TTextProps } from './types'

// A labelled multi-line text field: TField's layout around a textarea with TInput's look. With
// `maxLength`, a character count sits under it. `class` and `style` go on the root; every other attribute
// and listener goes on the textarea.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TTextProps>(), { rows: 3 })
const model = defineModel<string>()
const attrs = useAttrs()

// useId() is unique within one Vue app: each app on the page sets its own app.config.idPrefix.
const generatedId = useId()
const textareaId = computed(() => props.id ?? generatedId)
const hintId = computed(() => `${textareaId.value}-hint`)
const counterId = computed(() => `${textareaId.value}-counter`)
const hint = computed(() => props.error ?? props.description)
const describedBy = computed(
  () =>
    [
      hint.value && hintId.value,
      props.maxLength !== undefined && counterId.value,
    ]
      .filter(Boolean)
      .join(' ') || undefined,
)

// The textarea's padding (py-2) plus its border, around a number of lines.
const rowsHeight = (rows: number) => `calc(${rows}lh + 1rem + 2px)`
const autoResizeStyle = computed(() =>
  props.autoResize
    ? {
        minHeight: rowsHeight(props.rows),
        maxHeight: props.maxRows ? rowsHeight(props.maxRows) : undefined,
      }
    : undefined,
)

function textareaAttrs() {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
}
</script>

<template>
  <div
    :class="cn(tFieldRootClasses, attrs.class as ClassValue)"
    :style="attrs.style"
  >
    <Label :for="textareaId" :class="tFieldLabelClasses">{{ label }}</Label>
    <textarea
      v-model="model"
      v-bind="textareaAttrs()"
      :id="textareaId"
      :rows="rows"
      :maxlength="maxLength"
      :aria-invalid="!!error || undefined"
      :aria-describedby="describedBy"
      :class="cn(tInputVariants({ size }), tTextAreaVariants({ autoResize }))"
      :style="autoResizeStyle"
    />
    <div v-if="hint || maxLength !== undefined" :class="tTextHintRowClasses">
      <p
        v-if="hint"
        :id="hintId"
        :role="error ? 'alert' : undefined"
        :class="tFieldHintVariants({ tone: error ? 'error' : 'description' })"
      >
        {{ hint }}
      </p>
      <p
        v-if="maxLength !== undefined"
        :id="counterId"
        :class="tTextCounterClasses"
      >
        {{ (model ?? '').length }} / {{ maxLength }}
      </p>
    </div>
  </div>
</template>
