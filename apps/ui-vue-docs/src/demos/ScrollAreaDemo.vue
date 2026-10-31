<script setup lang="ts">
import { TScrollArea, TStack } from '@repo/ui-vue'
</script>

<template>
  <TScrollArea max-height="9rem" role="region" aria-label="Example log" class="rounded-md border border-line">
    <TStack :gap="1" class="p-3 font-mono text-xs">
      <span v-for="n in 20" :key="n">log line {{ n }}</span>
    </TStack>
  </TScrollArea>
</template>
