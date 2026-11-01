<script setup lang="ts">
import {
  TButton,
  TDialog,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TDialogTrigger,
  TField,
  TIcon,
} from '@repo/ui-vue'
import { Pencil } from '@repo/ui-vue/icons'
import { ref, watch } from 'vue'
import { validateTitle } from '../hooks/validateTitle'

const props = defineProps<{ title: string }>()
const emit = defineEmits<{ save: [title: string] }>()

const open = ref(false)
const draft = ref('')
const error = ref<string>()

// Every opening starts from the current title: a cancelled draft doesn't come back.
watch(open, (isOpen) => {
  if (!isOpen) return
  draft.value = props.title
  error.value = undefined
})

function save() {
  error.value = validateTitle(draft.value)
  if (error.value) return
  emit('save', draft.value)
  open.value = false
}

function onInput() {
  if (error.value && !validateTitle(draft.value)) error.value = undefined
}
</script>

<!-- Escape, the close button and Cancel discard the draft; the dialog then hands focus back to the trigger. -->
<template>
  <TDialog v-model:open="open">
    <TDialogTrigger as-child>
      <TButton variant="ghost" size="sm" class="w-8 px-0 text-fg-muted hover:text-fg" :aria-label="`Edit “${title}”`">
        <TIcon :icon="Pencil" size="sm" />
      </TButton>
    </TDialogTrigger>
    <TDialogContent as="form" size="sm" novalidate @submit.prevent="save">
      <TDialogHeader>
        <TDialogTitle>Edit todo</TDialogTitle>
        <TDialogDescription>Press Enter to save, or Escape to keep it as it was.</TDialogDescription>
      </TDialogHeader>
      <!-- Not in a TDialogBody: its scrolling would clip the input's focus ring, and one field never scrolls. -->
      <TField v-model="draft" label="Title" autocomplete="off" :error="error" @input="onInput" />
      <TDialogFooter>
        <TDialogClose as-child>
          <TButton variant="ghost" label="Cancel" />
        </TDialogClose>
        <TButton type="submit" label="Save" />
      </TDialogFooter>
    </TDialogContent>
  </TDialog>
</template>
