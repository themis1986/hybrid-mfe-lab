<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue'
import { type ClassValue } from 'clsx'
import { Label } from 'reka-ui'
import { computed, ref, useAttrs, useId } from 'vue'
import { cn } from '../../lib/cn'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import { TInput } from '../TInput'
import {
  tFieldControlClasses,
  tFieldHintVariants,
  tFieldLabelClasses,
  tFieldRevealClasses,
  tFieldRootClasses,
} from './TField.variants'
import type { TFieldProps } from './types'

// `class` and `style` go on the root; every other attribute and listener goes on the input.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TFieldProps>(), { revealLabel: 'Show password' })
const model = defineModel<string>()
const attrs = useAttrs()

// useId() is unique within one Vue app. Several apps (microfrontends) on one page must each set their
// own app.config.idPrefix, or their ids can collide.
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const hintId = computed(() => `${inputId.value}-hint`)
const hint = computed(() => props.error ?? props.description)
const password = computed(() => attrs.type === 'password')
const revealed = ref(false)

function inputAttrs() {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
}
</script>

<template>
  <div :class="cn(tFieldRootClasses, attrs.class as ClassValue)" :style="attrs.style">
    <Label :for="inputId" :class="tFieldLabelClasses">{{ label }}</Label>
    <!-- A password input gets a toggle that shows its text. aria-pressed carries the state, so the button
         keeps one name. -->
    <div v-if="password" :class="tFieldControlClasses">
      <TInput
        v-model="model"
        v-bind="inputAttrs()"
        :id="inputId"
        :type="revealed ? 'text' : 'password'"
        :size="size"
        :invalid="!!error"
        :aria-describedby="hint ? hintId : undefined"
        data-slot="field-input"
      />
      <TButton
        type="button"
        variant="ghost"
        size="sm"
        :aria-label="revealLabel"
        :aria-controls="inputId"
        :aria-pressed="revealed"
        :disabled="attrs.disabled as boolean | undefined"
        :class="tFieldRevealClasses"
        @click="revealed = !revealed"
      >
        <TIcon :icon="revealed ? EyeOff : Eye" size="sm" />
      </TButton>
    </div>
    <TInput
      v-else
      v-model="model"
      v-bind="inputAttrs()"
      :id="inputId"
      :size="size"
      :invalid="!!error"
      :aria-describedby="hint ? hintId : undefined"
      data-slot="field-input"
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
