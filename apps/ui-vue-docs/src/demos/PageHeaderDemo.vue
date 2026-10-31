<script setup lang="ts">
import { TButton, TPageHeader } from '@repo/ui-vue'
</script>

<template>
  <TPageHeader title="Projects" description="All projects in your workspace." :heading-level="4">
    <template #actions>
      <TButton variant="outline" label="Import" />
      <TButton label="New project" />
    </template>
  </TPageHeader>
</template>
