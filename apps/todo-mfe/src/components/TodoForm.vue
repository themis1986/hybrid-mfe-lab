<script setup lang="ts">
import { TButton, TField, TIcon } from '@repo/ui-vue'
import { Plus } from '@repo/ui-vue/icons'
import { ref, useId } from 'vue'
import { useTodos } from '../hooks/useTodos'
import { validateTitle } from '../helpers/validation.helpers'

const { add } = useTodos()

const title = ref('')
const error = ref<string>()
// TField forwards the id to its input; the input is focused through it.
const inputId = useId()

function focus() {
  document.getElementById(inputId)?.focus()
}

function submit() {
  error.value = validateTitle(title.value)
  const todo = error.value ? undefined : add(title.value)
  if (todo) {
    title.value = ''
  }
  focus()
}

// The error goes as soon as the title is valid again, but only a submit shows a new one.
function onInput() {
  if (error.value && !validateTitle(title.value)) error.value = undefined
}

defineExpose({ focus })
</script>

<template>
  <form
    class="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
    novalidate
    @submit.prevent="submit"
  >
    <TField
      :id="inputId"
      v-model="title"
      label="What needs doing?"
      placeholder="e.g. Water the plants"
      autocomplete="off"
      :error="error"
      @input="onInput"
    />
    <!-- Pushed down by the label's line and the field's gap, so it lines up with the input. -->
    <TButton type="submit" class="mt-[calc(1.25rem+--spacing(1.5))]">
      <TIcon :icon="Plus" size="sm" />
      Add
    </TButton>
  </form>
</template>
