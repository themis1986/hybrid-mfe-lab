<script setup lang="ts">
import { CollapsibleTrigger } from 'reka-ui'
import type { TCollapsibleTriggerProps } from './types'

defineProps<TCollapsibleTriggerProps>()
</script>

<template>
  <CollapsibleTrigger data-slot="collapsible-trigger" :as="as" :as-child="asChild">
    <slot />
  </CollapsibleTrigger>
</template>
