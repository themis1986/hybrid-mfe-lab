<script setup lang="ts">
import { TSkeleton } from '@repo/ui-vue'
</script>

<template>
  <!-- Shown while a chart component's chunk, with the chart engine, downloads. -->
  <TSkeleton shape="block" class="h-80 w-full" />
</template>
