<script setup lang="ts">
// The value a range or time field submits with its form, in place of Reka's own hidden input (a range's
// submits "undefined - undefined" while empty, which passes `required`; a time's always has seconds).
// Render it inside the field's root: an invalid form focuses it, which moves focus to the first segment.
defineProps<{
  name: string
  value: string
  required?: boolean
  disabled?: boolean
}>()

const firstSegment = [
  '[data-reka-date-field-segment]:not([data-reka-date-field-segment="literal"])',
  '[data-reka-time-field-segment]:not([data-reka-time-field-segment="literal"])',
].join(',')

function onFocus(event: FocusEvent) {
  ;(event.target as HTMLElement).parentElement
    ?.querySelector<HTMLElement>(firstSegment)
    ?.focus()
}
</script>

<template>
  <input
    aria-hidden="true"
    tabindex="-1"
    :name="name"
    :value="value"
    :required="required"
    :disabled="disabled"
    class="sr-only"
    @focus="onFocus"
  />
</template>
