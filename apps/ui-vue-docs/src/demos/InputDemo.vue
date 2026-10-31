<script setup lang="ts">
import { TInput, TStack } from '@repo/ui-vue'
import { ref } from 'vue'

const query = ref('')
</script>

<template>
  <TStack :gap="2" class="max-w-sm">
    <TInput v-model="query" placeholder="Type to see v-model" aria-label="Query" />
    <span class="text-sm text-fg-muted">v-model: “{{ query }}”</span>
    <TInput size="sm" placeholder="Small" aria-label="Small" />
    <TInput invalid model-value="Invalid value" aria-label="Invalid" />
    <TInput disabled placeholder="Disabled" aria-label="Disabled" />
  </TStack>
</template>
