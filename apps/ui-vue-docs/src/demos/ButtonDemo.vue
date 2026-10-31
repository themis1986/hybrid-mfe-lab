<script setup lang="ts">
import { TButton, TCluster, TStack } from '@repo/ui-vue'
import { ref } from 'vue'

const variants = ['solid', 'soft', 'outline', 'ghost', 'danger'] as const
const clicks = ref(0)
</script>

<template>
  <TStack :gap="3">
    <TCluster>
      <TButton v-for="variant in variants" :key="variant" :variant="variant" @click="clicks++">{{ variant }}</TButton>
    </TCluster>
    <TCluster>
      <TButton size="sm" label="Small" />
      <TButton size="md" label="Medium" />
      <TButton size="lg" label="Large" />
      <TButton disabled label="Disabled" @click="clicks++" />
      <TButton as-child variant="outline">
        <a href="#button">A link</a>
      </TButton>
    </TCluster>
    <span class="text-sm text-fg-muted">Clicked {{ clicks }} times</span>
  </TStack>
</template>
