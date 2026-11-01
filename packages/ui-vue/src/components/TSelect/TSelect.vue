<script setup lang="ts">
import { Check, ChevronDown } from '@lucide/vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { useTemplateRef } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { cn } from '../../lib/cn'
import {
  tCheckboxIconClasses,
  tCheckboxIndicatorClasses,
  tCheckboxVariants,
} from '../TCheckbox/TCheckbox.variants'
import { TIcon } from '../TIcon'
import { tInputVariants } from '../TInput/TInput.variants'
import {
  tRadioIndicatorClasses,
  tRadioVariants,
} from '../TRadioGroup/TRadioGroup.variants'
import {
  tSelectChevronClasses,
  tSelectContentClasses,
  tSelectIndicatorClasses,
  tSelectItemClasses,
  tSelectTriggerClasses,
  tSelectValueClasses,
  tSelectViewportClasses,
} from './TSelect.variants'
import type { TSelectProps } from './types'

// A select over `options` (Reka Select): one value, or several with `multiple`. Each option shows the design
// system's radio (single) or checkbox (multiple) as a decorative indicator. Name it with `aria-label` or a
// <label for> pointing at its `id`. The caller's attributes and listeners go on the trigger.
defineOptions({ inheritAttrs: false })
// The explicit undefined defaults keep "not set" apart from "off", so the select is only controlled when
// v-model is bound and Reka's own defaults apply.
const props = withDefaults(defineProps<TSelectProps>(), {
  defaultValue: undefined,
  multiple: undefined,
})
const model = defineModel<string | string[] | undefined>({ default: undefined })
const trigger = useRootAttrs(() =>
  cn(tInputVariants({ size: props.size }), tSelectTriggerClasses),
)
const triggerRef =
  useTemplateRef<InstanceType<typeof SelectTrigger>>('triggerRef')

const contentStyle = {
  '--t-select-trigger-width': 'var(--reka-select-trigger-width)',
  '--t-select-available-height': 'var(--reka-select-content-available-height)',
}
</script>

<template>
  <SelectRoot
    v-slot="{ modelValue: current }"
    v-model="model"
    :default-value="defaultValue"
    :multiple="multiple"
    :disabled="disabled"
    :name="multiple ? undefined : name"
    :required="required"
  >
    <SelectTrigger
      ref="triggerRef"
      data-slot="select-trigger"
      v-bind="trigger()"
      :aria-invalid="invalid || undefined"
    >
      <SelectValue :placeholder="placeholder" :class="tSelectValueClasses" />
      <TIcon :icon="ChevronDown" :class="tSelectChevronClasses" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        data-slot="select-content"
        position="popper"
        side="bottom"
        align="start"
        :side-offset="4"
        :aria-multiselectable="multiple || undefined"
        :class="tSelectContentClasses"
        :style="contentStyle"
      >
        <SelectViewport :class="tSelectViewportClasses">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            data-slot="select-item"
            :value="option.value"
            :disabled="option.disabled"
            :class="tSelectItemClasses"
          >
            <span
              v-if="multiple"
              aria-hidden="true"
              :class="
                cn(tCheckboxVariants({ size: 'sm' }), tSelectIndicatorClasses)
              "
            >
              <SelectItemIndicator :class="tCheckboxIndicatorClasses">
                <TIcon :icon="Check" :class="tCheckboxIconClasses" />
              </SelectItemIndicator>
            </span>
            <span
              v-else
              aria-hidden="true"
              :class="
                cn(tRadioVariants({ size: 'sm' }), tSelectIndicatorClasses)
              "
            >
              <SelectItemIndicator :class="tRadioIndicatorClasses" />
            </span>
            <SelectItemText>{{ option.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
    <!-- Reka's hidden native select assigns a multiple value to select.value, which only matches an option
         while one value is selected; so a multiple select submits through its own (as in @repo/ui). An
         invalid form focuses it, which moves focus to the trigger. -->
    <select
      v-if="multiple && name !== undefined"
      multiple
      aria-hidden="true"
      tabindex="-1"
      :name="name"
      :required="required"
      :disabled="disabled"
      class="sr-only"
      @focus="triggerRef?.$el.focus()"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :selected="Array.isArray(current) && current.includes(option.value)"
      >
        {{ option.label }}
      </option>
    </select>
  </SelectRoot>
</template>
