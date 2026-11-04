<script setup lang="ts">
import { TButton, TIcon } from '@repo/ui-vue'
import { CloudOff } from '@repo/ui-vue/icons'

defineProps<{ message: string; description?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    role="alert"
    class="box-border flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-surface p-6 text-center"
  >
    <TIcon :icon="CloudOff" size="lg" class="text-fg-muted" />
    <div>
      <p class="m-0 font-medium">{{ message }}</p>
      <p v-if="description" class="m-0 mt-1 text-sm text-fg-muted">
        {{ description }}
      </p>
    </div>
    <slot>
      <TButton variant="soft" size="sm" @click="$emit('retry')"
        >Try again</TButton
      >
    </slot>
  </div>
</template>
