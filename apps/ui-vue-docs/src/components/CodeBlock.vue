<script setup lang="ts">
import { TScrollArea } from '@repo/ui-vue'

defineProps<{ code: string; label: string }>()
</script>

<template>
  <TScrollArea orientation="horizontal" role="region" :aria-label="label" class="rounded-md bg-surface">
    <pre class="m-0 p-4 font-mono text-xs leading-relaxed text-fg"><code>{{ code }}</code></pre>
  </TScrollArea>
</template>
