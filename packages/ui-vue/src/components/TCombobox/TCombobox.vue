<script setup lang="ts">
import { Check, ChevronDown, X } from '@lucide/vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { cn } from '../../lib/cn'
import { filterOptions } from '../../lib/combobox'
import {
  tCheckboxIconClasses,
  tCheckboxIndicatorClasses,
  tCheckboxVariants,
} from '../TCheckbox/TCheckbox.variants'
import { TIcon } from '../TIcon'
import {
  tRadioIndicatorClasses,
  tRadioVariants,
} from '../TRadioGroup/TRadioGroup.variants'
import {
  tSelectChevronClasses,
  tSelectContentClasses,
  tSelectIndicatorClasses,
  tSelectItemClasses,
  tSelectViewportClasses,
} from '../TSelect/TSelect.variants'
import {
  tComboboxChipClasses,
  tComboboxChipIconClasses,
  tComboboxChipLabelClasses,
  tComboboxChipRemoveClasses,
  tComboboxEmptyClasses,
  tComboboxFieldVariants,
  tComboboxInputClasses,
  tComboboxToggleClasses,
  tComboboxValuesClasses,
} from './TCombobox.variants'
import type { TComboboxProps } from './types'

// A text field that filters `options` as you type (Reka Combobox), selecting one value or, with `multiple`,
// several (shown as chips). The filtering is lib/combobox.ts's, shared with @repo/ui, so Reka's own filter
// is off. Name it with `aria-label` or a <label for> pointing at its `id`. The caller's class and style go
// on the field, the other attributes and listeners on the input.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TComboboxProps>(), {
  multiple: false,
  defaultValue: undefined,
  emptyText: 'No results',
  removeLabel: 'Remove',
})
// Undefined while no v-model is bound: the value then starts from defaultValue and is kept here.
const model = defineModel<string | string[] | undefined>({ default: undefined })
const uncontrolled = ref(props.defaultValue)
const value = computed(() =>
  model.value !== undefined ? model.value : uncontrolled.value,
)
const selected = computed(() =>
  value.value === undefined
    ? []
    : Array.isArray(value.value)
      ? value.value
      : [value.value],
)

function setValue(next: string | string[] | undefined) {
  uncontrolled.value = next
  model.value = next
}

const root = useRootAttrs(() => tComboboxFieldVariants({ size: props.size }))
const fieldAttrs = () => {
  const { class: className, style } = root()
  return { class: className, style }
}
const inputAttrs = () => {
  const { class: _class, style: _style, ...rest } = root()
  return rest
}

// ComboboxRoot is generic, so its instance type can't be named; this is the part of it used here.
const rootRef = useTemplateRef<{
  highlightFirstItem?: () => void
  highlightItem?: (value: string) => void
}>('rootRef')
const inputRef = useTemplateRef<InstanceType<typeof ComboboxInput>>('inputRef')
const inputElement = () => inputRef.value?.$el as HTMLInputElement | undefined

const open = ref(false)
// The input's text, and the part that filters the list: what was typed since the list last opened or closed.
const text = ref('')
const query = ref('')
const filtered = computed(() => filterOptions(props.options, query.value))
const labelOf = (v: unknown) =>
  props.options.find((option) => option.value === v)?.label ?? ''

function onOpenChange(next: boolean) {
  open.value = next
  query.value = ''
}

function onInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
}

// Typing highlights the first match.
watch(query, async (q) => {
  if (!q || !open.value) return
  await nextTick()
  rootRef.value?.highlightFirstItem?.()
})

// A toggle in multiple mode clears the typed text, so the next search starts afresh.
function onValueChange(next: unknown) {
  setValue(next as string | string[] | undefined)
  if (props.multiple) {
    text.value = ''
    query.value = ''
  }
}

function remove(v: string) {
  setValue(selected.value.filter((s) => s !== v))
}

function onKeydown(event: KeyboardEvent) {
  if (
    props.multiple &&
    event.key === 'Backspace' &&
    text.value === '' &&
    selected.value.length
  ) {
    event.preventDefault()
    remove(selected.value[selected.value.length - 1])
  }
  // With nothing highlighted (the pointer left the list), Reka's End goes to the first option.
  if (event.key === 'End' && open.value) {
    const last = filtered.value.filter((option) => !option.disabled).at(-1)
    if (last) nextTick(() => rootRef.value?.highlightItem?.(last.value))
  }
}

// A click on the field outside the input opens the list as a click on the input does; its buttons keep
// focus in the input.
function onFieldMousedown(event: MouseEvent) {
  if (event.target !== inputElement()) event.preventDefault()
}

function onFieldClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('button') || target === inputElement()) return
  inputElement()?.click()
}

const contentStyle = {
  '--t-select-trigger-width': 'var(--reka-combobox-trigger-width)',
  '--t-select-available-height':
    'var(--reka-combobox-content-available-height)',
}
</script>

<template>
  <ComboboxRoot
    ref="rootRef"
    :model-value="value ?? (multiple ? [] : undefined)"
    :open="open"
    :multiple="multiple"
    :disabled="disabled"
    ignore-filter
    open-on-click
    class="contents"
    @update:model-value="onValueChange"
    @update:open="onOpenChange"
  >
    <ComboboxAnchor
      data-slot="combobox-field"
      :data-state="open ? 'open' : 'closed'"
      v-bind="fieldAttrs()"
      @mousedown="onFieldMousedown"
      @click="onFieldClick"
    >
      <div data-slot="combobox-values" :class="tComboboxValuesClasses">
        <template v-if="multiple">
          <span
            v-for="v in selected"
            :key="v"
            data-slot="combobox-chip"
            :class="tComboboxChipClasses"
          >
            <span :class="tComboboxChipLabelClasses">{{ labelOf(v) }}</span>
            <button
              type="button"
              tabindex="-1"
              :aria-label="`${removeLabel} ${labelOf(v)}`"
              :disabled="disabled"
              :class="tComboboxChipRemoveClasses"
              @click="remove(v)"
            >
              <TIcon :icon="X" :class="tComboboxChipIconClasses" />
            </button>
          </span>
        </template>
        <ComboboxInput
          ref="inputRef"
          v-model="text"
          v-bind="inputAttrs()"
          autocomplete="off"
          :display-value="multiple ? undefined : labelOf"
          :placeholder="multiple && selected.length ? undefined : placeholder"
          :aria-invalid="invalid || undefined"
          :class="tComboboxInputClasses"
          @input="onInput"
          @keydown="onKeydown"
        />
      </div>
      <ComboboxTrigger
        aria-label="Show options"
        :class="tComboboxToggleClasses"
      >
        <TIcon :icon="ChevronDown" :class="tSelectChevronClasses" />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <!-- Pressing an option keeps focus in the input (Reka moves it to the option), as in @repo/ui. -->
      <ComboboxContent
        data-slot="combobox-content"
        position="popper"
        side="bottom"
        align="start"
        :side-offset="4"
        :class="tSelectContentClasses"
        :style="contentStyle"
        @mousedown.prevent
      >
        <ComboboxViewport :class="tSelectViewportClasses">
          <div v-if="!filtered.length" :class="tComboboxEmptyClasses">
            {{ emptyText }}
          </div>
          <ComboboxItem
            v-for="option in filtered"
            :key="option.value"
            data-slot="combobox-item"
            :value="option.value"
            :text-value="option.label"
            :disabled="option.disabled"
            :aria-disabled="option.disabled || undefined"
            :class="tSelectItemClasses"
          >
            <span
              v-if="multiple"
              aria-hidden="true"
              :class="
                cn(tCheckboxVariants({ size: 'sm' }), tSelectIndicatorClasses)
              "
            >
              <ComboboxItemIndicator :class="tCheckboxIndicatorClasses">
                <TIcon :icon="Check" :class="tCheckboxIconClasses" />
              </ComboboxItemIndicator>
            </span>
            <span
              v-else
              aria-hidden="true"
              :class="
                cn(tRadioVariants({ size: 'sm' }), tSelectIndicatorClasses)
              "
            >
              <ComboboxItemIndicator :class="tRadioIndicatorClasses" />
            </span>
            {{ option.label }}
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
    <!-- Form submission and `required` validation, as TSelect's hidden native select (and the same in
         @repo/ui). An invalid form focuses it, which moves focus to the input. -->
    <select
      v-if="name !== undefined"
      :multiple="multiple"
      aria-hidden="true"
      tabindex="-1"
      :name="name"
      :required="required"
      :disabled="disabled"
      class="sr-only"
      @focus="inputElement()?.focus()"
    >
      <option v-if="!multiple" value="" :selected="!selected.length" />
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :selected="selected.includes(option.value)"
      >
        {{ option.label }}
      </option>
    </select>
  </ComboboxRoot>
</template>
