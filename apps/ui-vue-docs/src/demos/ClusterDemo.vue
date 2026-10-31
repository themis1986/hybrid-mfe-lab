<script setup lang="ts">
import { TCluster } from '@repo/ui-vue'

const tags = ['design', 'layout', 'tokens', 'react', 'vue', 'tailwind', 'reka', 'federation', 'a11y']
</script>

<template>
  <TCluster>
    <span
      v-for="tag in tags"
      :key="tag"
      class="rounded-full border border-accent-line px-2.5 py-0.5 text-xs text-accent-fg"
    >
      {{ tag }}
    </span>
  </TCluster>
</template>
