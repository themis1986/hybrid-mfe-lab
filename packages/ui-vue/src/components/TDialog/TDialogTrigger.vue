<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'
import type { TDialogTriggerProps } from './types'

defineProps<TDialogTriggerProps>()
</script>

<template>
  <DialogTrigger :as="as" :as-child="asChild">
    <slot />
  </DialogTrigger>
</template>
