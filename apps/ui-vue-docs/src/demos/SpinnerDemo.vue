<script setup lang="ts">
import { TButton, TCluster, TSpinner } from '@repo/ui-vue'
</script>

<template>
  <TCluster :gap="6">
    <TSpinner size="sm" />
    <TSpinner />
    <TSpinner size="lg" />
    <TSpinner size="xl" label="Loading the report" />
    <TSpinner size="lg" class="text-fg-muted" />
    <TButton variant="soft" disabled>
      <TSpinner size="sm" aria-hidden="true" class="text-current" />
      Saving…
    </TButton>
  </TCluster>
</template>
