<script setup lang="ts">
import { TButton, TInline, TInput, TPanel, TSpacer, TStack } from '@repo/ui-vue'
</script>

<template>
  <TStack :gap="3">
    <TPanel title="Filters">
      <TInline wrap :gap="2">
        <TInput size="sm" placeholder="Search…" aria-label="Search" class="w-48" />
        <TButton size="sm" variant="soft" label="Apply" />
        <TSpacer />
        <TButton size="sm" variant="ghost" label="Reset" />
      </TInline>
    </TPanel>
    <TPanel tone="accent" :padding="3">
      <span class="text-sm">An accent panel for a highlighted note.</span>
    </TPanel>
  </TStack>
</template>
