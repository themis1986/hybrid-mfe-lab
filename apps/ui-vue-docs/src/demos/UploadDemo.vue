<script setup lang="ts">
import { TStack, TUpload } from '@repo/ui-vue'
import { ref } from 'vue'
import { mockUpload } from '../samples'

const photos = ref<File[]>([])
</script>

<template>
  <TStack :gap="6" class="max-w-lg">
    <TUpload
      v-model="photos"
      label="Photos"
      description="Images or PDF, up to 10 MB each, 5 files at most. A file named …fail… is refused, to show a retry."
      accept="image/*,.pdf"
      multiple
      :max-files="5"
      :max-size="10_000_000"
      :upload="mockUpload"
    />
    <TUpload label="Avatar" variant="compact" accept="image/*" name="avatar" description="One image; a new one replaces it." />
    <TUpload
      label="Attachments"
      multiple
      :upload="mockUpload"
      :auto-upload="false"
      upload-label="Send files"
      description="Uploads when you press the button."
    />
    <TUpload label="Disabled" variant="compact" disabled />
  </TStack>
</template>
