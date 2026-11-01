<script setup lang="ts">
import { TButton, TProgress, TStack } from '@repo/ui-vue'
import { ref } from 'vue'

const upload = ref(35)
</script>

<template>
  <TStack :gap="4" class="max-w-md">
    <div class="flex items-center gap-3 text-sm">
      <TProgress :value="upload" aria-label="Upload" />
      <span class="w-10 tabular-nums">{{ upload }}%</span>
      <TButton
        size="sm"
        variant="soft"
        label="+15"
        @click="upload = Math.min(100, upload + 15)"
      />
    </div>
    <TProgress :value="100" tone="success" aria-label="Complete" />
    <TProgress :value="70" tone="warning" size="sm" aria-label="Storage" />
    <TProgress :value="90" tone="danger" size="sm" aria-label="Quota" />
    <TProgress aria-label="Loading" />
  </TStack>
</template>
